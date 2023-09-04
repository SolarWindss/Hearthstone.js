import fs from "fs";
import chalk from "chalk";
import { Game, Player } from "../src/internal.js";
import { Blueprint, VanillaCard } from "../src/types.js";

const game = new Game();
const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
game.setup(player1, player2);
game.functions.importCards(game.functions.dirname() + "cards");
game.functions.importConfig(game.functions.dirname() + "config");

const fileLocation = game.functions.dirname() + "../card_creator/vanilla/.ignore.cards.json";
if (!fs.existsSync(fileLocation)) {
    game.input(chalk.red("Cards file not found! Run 'scripts/genvanilla.bat' (requires an internet connection), then try again.\n"));
    process.exit(1);
}

const readVanillaCards = fs.readFileSync(fileLocation, "utf-8");
const vanillaCards: VanillaCard[] = JSON.parse(readVanillaCards);

let customCards = game.functions.getCards(false);
let filteredVanillaCards = game.functions.filterVanillaCards(vanillaCards, false, false);

console.log(chalk.yellow("WARNING: This program might find the incorrect card, so if it says that a card has 10 health instead of 2 sometimes, just ignore it.\n"));

customCards.forEach(custom => {
    let vanilla = filteredVanillaCards.find(vanilla => vanilla.name.toLowerCase() == (custom.displayName ?? custom.name).toLowerCase() && vanilla.type.toLowerCase() == custom.type.toLowerCase());
    if (!vanilla) return; // There is no vanilla version of that card.

    Object.entries(custom).forEach(ent => {
        let [key, val] = ent;

        // For some reason, typescript thinks that vanilla can be undefined
        vanilla = vanilla!;

        if (key == "stats") {
            check("attack", val[0].toString(), vanilla, custom);
            check("health", val[1].toString(), vanilla, custom);
            return;
        }

        vanilla.text = vanilla.text?.replaceAll("<b>", "&B");
        vanilla.text = vanilla.text?.replaceAll("</b>", "&R");
        vanilla.text = vanilla.text?.replace(/\$(\d*?) /g, "$1 ");
        vanilla.text = vanilla.text?.replaceAll("\n", " ");
        vanilla.text = vanilla.text?.replaceAll("[x]", "");

        check(key, val, vanilla, custom);
    });
});

function check(key: string, val: string, vanilla: VanillaCard, card: Blueprint) {
    let ignore = ["id", "set", "name", "rarity", "type"];

    let table = {
        "desc": "text"
    }

    // @ts-expect-error
    if (!vanilla[table[key]] || ignore.includes(key)) return;
    // @ts-expect-error
    if (val.toLowerCase() == vanilla[table[key]]?.toString().toLowerCase()) return;

    console.log("Card outdated!");
    console.log(`Name: ${card.name}`);
    console.log(`Local: "${key}: ${val}"`);
    // @ts-expect-error
    console.log(`New:   "${key}: ${vanilla[table[key]]}"\n`);
}
