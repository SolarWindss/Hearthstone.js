//@ts-check
// This is a library

const rl = require("readline-sync");
const fs = require("fs");
const { Game } = require("../src/game");
const { editor } = require("../config/general.json");

const game = new Game({}, {});
game.functions.importCards(__dirname + "/../cards");
game.functions.importConfig(__dirname + "/../config");

let card = {};
let type;

let debug = false;
let cctype = "Undefined";

function getCardFunction(card_type) {
    // Get the card's 'function' (battlecry, cast, deathrattle, etc...)
    let func;

    if (card_type == "spell") func = "Cast"; // If the card is a spell, the function is 'cast'
    else if (card_type == "hero") func = "HeroPower"; // If the card is a hero card, the function is 'heropower'
    else if (card_type == "location") func = "Use"; // If the card is a location, the function is 'use'
    else { // If the card is a Minion or Weapon
        //func = input("Function: ");

        // Try to extract a function from the card's description
        let reg = /[A-Z][a-z].*?:/;
        func = card.desc.match(reg);

        if (!func && card.desc) func = "Passive:"; // If it didn't find a function, but the card has text in its' description, the function is 'passive'
        else if (!card.desc) func = ":"; // If the card doesn't have a description, it doesn't get a default function.
        else func = func[0]; // If it found a function, and the card has a description, the function is the function it found in the description.

        func = func.slice(0, -1); // Remove the last ':'
    }

    return func;
}

function generateCardPath(...args) {
    // Create a path to put the card in.
    let [classes, type] = args;

    // DO NOT CHANGE THIS
    let static_path = `${__dirname}/../cards/`;

    // You can change this
    let dynamic_path = `Classes/${classes}/${type}s/${card.mana} Cost/`;

    return static_path + dynamic_path;
}

function create(override_type, override_card, override_path = "", override_filename = "") {
    card = override_card;
    type = override_type;

    // If the user didn't specify a tribe, but the tribe exists, set the tribe to "None".
    if (card.tribe == "") card.tribe = "None";

    let file_friendly_type = type.toLowerCase();

    let func = getCardFunction(file_friendly_type);

    // If the type is Hero, we want the card to go to '.../Heroes/...' and not to '.../Heros/...'
    file_friendly_type = (type == "Hero") ? "Heroe" : type;

    // If the card has the word "Secret" in its description, put it in the ".../Secrets/..." folder.
    if (card.desc.includes("Secret:")) file_friendly_type = "Secret";

    // Here it creates a default function signature
    let triggerText = ")";
    if (func.toLowerCase() == "passive") triggerText = ", key, val)";
    
    let desc_to_clean = type == "Hero" ? card.hpDesc : card.desc;
    let cleaned_desc = game.functions.stripTags(desc_to_clean);

    if (func) func = `${func.toLowerCase()}(plr, game, self${triggerText} {\n        // ${cleaned_desc}\n        \n    }`; // Examples: '\n\n    passive(plr, game, self, key, val) {\n        // Your battlecries trigger twice\n        }', '\n\n    battlecry(plr, game, self) {\n\n    }'

    // If there are multiple classes in a card, put the card in a directory something like this '.../Class1/Class2/...'
    let classes = card.class.replaceAll(" / ", "/");

    // Create a path to put the card in.
    let path = generateCardPath(classes, file_friendly_type);
    if (override_path) path = override_path; // If this function was passed in a path, use that instead.

    // Create a filename. Example: "Test Card" -> "test_card.js"
    let filename = card.name.toLowerCase().replaceAll(" ", "_") + ".js";
    if (override_filename) filename = override_filename; // If this function was passed in a filename, use that instead.

    // Get the latest card-id
    let id = parseInt(fs.readFileSync(__dirname + "/../cards/.latest_id", "utf8"));
    let file_id = `\n    id: ${id},`;

    // Generate the content of the card
    // If the value is a string, put '"value"'. If it is not a string, put 'value'.
    const getTypeValue = val => {
        let ret = val;

        if (typeof(val) === 'string' && val[0] != "[") ret = `"${val}"`; // If the value is a string, but not an array (arrays are parsed as strings, don't ask), set the value to '"value"'.

        return ret;
    }

    let split_path = path.split(/[\\/]/);
    let num = split_path.length - split_path.indexOf("cards");
    let type_path_rel = "../".repeat(num - 1) + "src/types";

    let bpDocstring = `/**
* @type {import("${type_path_rel}").Blueprint}
*/`;

    let methodDocstring = `/**
     * @type {import("${type_path_rel}").KeywordMethod}
     */`;

    // If the card has a function, add the docstring to it.
    let funcString = "";
    if (func) {
        funcString = `

    ${methodDocstring}
    ${func}`;
    }

    let content = Object.entries(card).map(c => `${c[0]}: ${getTypeValue(c[1])}`); // name: "Test"
    content = `//@ts-check

// Created by the ${cctype} Card Creator

${bpDocstring}
module.exports = {
    ${content.join(',\n    ')},${file_id}${funcString}
}`;

    // Reset the type back to default.
    set_type("Undefined");

    // The path is now "./card_creator/../cards/...", replace this with "./cards/..."
    let file_path = path.replaceAll("/", "\\") + filename; // Replace '/' with '\' because windows

    if (!debug) {
        // If debug mode is disabled, write the card to disk.
        
        // Increment the id in '.latest_id' by 1
        fs.writeFileSync(__dirname + "/../cards/.latest_id", (id + 1).toString()); 

        // If the path the card would be written to doesn't exist, create it.
        if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        // Write the file to the path
        fs.writeFileSync(path + filename, content);

        console.log('File created at: "' + file_path + '"');
    } else {
        // If debug mode is enabled, just show some information about the card.
        console.log(`\nNew ID: ${id + 1}`); // This is the id that would be written to '.latest_id'
        console.log(`Would be path: "${file_path}"`);
        console.log(`Content: ${content}`);
        rl.question();
    }

    // Open the defined editor on that card if it has a function to edit, and debug mode is disabled
    if (func && !debug) {
        let success = game.functions.openWithArgs(editor, `"${file_path}"`);
        if (!success) rl.question();
    }

    return file_path;
}

function set_debug(state) {
    debug = state;
}

function set_type(state) {
    cctype = state;
}

exports.create = create;
exports.set_debug = set_debug;
exports.set_type = set_type;

// If the program was run directly, run 'main'. This is the same as "if __name__ == '__main__'" in python.
if (require.main == module) {
    console.error("This is meant to be imported as a module, not ran.")
}
