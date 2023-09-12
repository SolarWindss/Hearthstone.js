
/**
 * Upgrade pre 2.0 cards into 2.0 cards.
 * 
 * @module Upgrade Cards
 */

import fs from "fs";
import { createGame } from "../src/internal.js";
import chalk from "chalk";

const { game, player1, player2 } = createGame();

function upgradeCard(path: string, filename: string, data: string) {
    console.log(`--- Found ${filename} ---`);

    let hasPassive = data.includes("passive(plr, game, self, key, ");
    let eventValue = hasPassive ? ", EventValue" : "";

    console.log(`Passive: ${hasPassive}`);
    
    let bpDefRegex = /\/\*\*\n \* @type {import\("(?:\.\.\/)+src\/types"\)\.Blueprint}\n \*\//g;
    let kwmRegex = /\n    \/\*\*\n     \* @type {import\("(?:\.\.\/)+src\/types"\)\.KeywordMethod}\n     \*\//g;

    let oldData = data;
    data = data.replaceAll(bpDefRegex, `import { Blueprint${eventValue} } from "@Game/types.js";\n`);
    if (data !== oldData) {
        console.log(`Replaced blueprint type from jsdoc to import.`);
    }

    oldData = data;
    data = data.replaceAll(kwmRegex, ``);
    if (data !== oldData) {
        console.log(`Removed KeywordMethod jsdoc type.`);
    }

    oldData = data;
    data = data.replace(`module.exports = {`, `export const blueprint: Blueprint = {`);
    if (data !== oldData) {
        console.log(`Replaced blueprint definition from module.exports to object.`);
    }

    oldData = data;
    data = data.replace(/\n {4}set: (.*),/, ``);
    if (data !== oldData) {
        console.log(`Removed the set field.`);
    }

    oldData = data;
    data = data.replace(/ {4}class: (.*),/, `    classes: [$1],`);
    if (data !== oldData) {
        console.log(`Updated the class field.`);
    }

    // Replace the card's id with a new one
    data = data.replace(/\n {4}id: (\d+),?/, "");
    let currentId = Number(fs.readFileSync(game.functions.dirname() + "../cards/.latest_id", { encoding: "utf8" })) + 1;

    data = data.replace(/( {4}.+: .+,)(\n\n {4}.*\(plr, game, self)/, `$1\n    id: ${currentId},$2`);
    console.log(`Card was assigned id ${currentId}.`);

    fs.writeFileSync(game.functions.dirname() + "../cards/.latest_id", `${currentId}`);

    if (hasPassive) {
        // Find key
        let keyRegex = /\n {8}if \(key [!=]+ "(\w+)"\) /;
        let match = data.match(keyRegex);
        let key = "";
        if (match) {
            key = match[1];
            console.log(`Found key: ${key}.`);
        } else {
            console.error(chalk.yellow("WARNING: Could not find event key in passive."));
        }

        data = data.replace(/(\n {4}passive\(plr, game, self, key), val\) {/g, `$1, _unknownVal) {
// Only proceed if the correct event key was broadcast
if (!(key === "${key}")) return;

// Here we cast the value to the correct type.
// Do not use the '_unknownVal' variable after this.
const val = _unknownVal as EventValue<typeof key>;
`);

        data = data.replace(keyRegex, "");
        console.log("Updated passive.")
    }

    fs.writeFileSync(path.replace(filename, filename.replace(".js", ".mts")), data);
    
    console.log(`--- Finished ${filename} ---`);
}

function upgradeCards(path: string) {
    if (path.includes("cards/Tests")) return; // We don't care about test cards

    path = path.replaceAll("\\", "/").replace("/dist/..", "");

    fs.readdirSync(path, { withFileTypes: true }).forEach(file => {
        let fullPath = `${path}/${file.name}`;

        if (file.name.endsWith(".js")) {
            // It is an actual card.
            let data = fs.readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });

            upgradeCard(fullPath, file.name, data);
        }
        else if (file.isDirectory()) upgradeCards(fullPath);
    });
}

function main() {
    console.error(chalk.yellow("WARNING: This will create new cards with the `.mts` extension, but will leave your old card alone. Please verify that the new cards work before deleting the old ones."));

    let proceed = game.input("Do you want to proceed? ([y]es, [n]o): ").toLowerCase()[0] === "y";
    if (!proceed) process.exit(0);

    upgradeCards(game.functions.dirname() + "../cards");

    console.log("Done");
}

main();
