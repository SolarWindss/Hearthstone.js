import rl from "readline-sync";
import * as lib from "../lib.js";
import { Game, Player } from "../../src/internal.js";
import { Blueprint, CardClass, CardKeyword, CardRarity, CardType, MinionTribe, SpellSchool } from "../../src/types.js";

const game = new Game();
const player1 = new Player("Player 1");
const player2 = new Player("Player 2");
game.setup(player1, player2);
game.functions.importCards(game.functions.dirname() + "cards");
game.functions.importConfig(game.functions.dirname() + "config");

// @ts-expect-error
let card: Blueprint = {};

let shouldExit = false;
let type: CardType;

function input(prompt: string) {
    const ret = rl.question(prompt);

    if (["exit", "stop", "quit", "back"].includes(ret.toLowerCase())) shouldExit = true;
    return ret;
}

function applyCard(_card: Blueprint) {
    // @ts-expect-error
    let newCard: Blueprint = {};

    Object.entries(_card).forEach(c => {
        let [key, val] = c;

        let required_keys = ["name", "desc", "mana", "class", "rarity", "stats", "hpDesc", "hpCost", "cooldown"];
        if (!val && val !== 0 && !required_keys.includes(key)) return;

        // @ts-expect-error
        newCard[key] = val;
    });

    return newCard;
}

function common(): false | Blueprint {
    const name = input("Name: ");
    if (shouldExit) return false;

    const displayName = input("Display Name: ");
    if (shouldExit) return false;

    const description = input("Description: ");
    if (shouldExit) return false;

    const cost = input("Mana Cost: ");
    if (shouldExit) return false;

    const classes = input("Classes: ") as CardClass;
    if (shouldExit) return false;

    const rarity = input("Rarity: ") as CardRarity;
    if (shouldExit) return false;

    let keywords = input("Keywords: ");
    if (shouldExit) return false;
    
    let runes;
    if (classes == "Death Knight") runes = input("Runes: ");
    if (shouldExit) return false;

    //if (keywords) keywords = '["' + keywords.split(', ').join('", "') + '"]';
    let realKeywords: CardKeyword[] | undefined;
    if (keywords) realKeywords = keywords.split(', ') as CardKeyword[];

    return {
        name: name,
        displayName: displayName,
        desc: description,
        mana: parseInt(cost),
        type: type,
        classes: [classes],
        rarity: rarity,
        runes: runes,
        keywords: realKeywords,
        id: 0,
    };
}

function minion() {
    let _card = common();
    if (!_card) return false;

    let stats = input("Stats: ");
    if (shouldExit) return false;

    const tribe = input("Tribe: ");
    if (shouldExit) return false;

    return applyCard({
        name: _card.name,
        displayName: _card.displayName,
        stats: stats.split("/").map(s => parseInt(s)),
        desc: _card.desc,
        mana: _card.mana,
        type: _card.type,
        tribe: tribe as MinionTribe,
        classes: _card.classes,
        rarity: _card.rarity,
        runes: _card.runes,
        keywords: _card.keywords,
        id: 0,
    });
}

function spell() {
    let _card = common();
    if (!_card) return false;

    const spellClass = input("Spell Class: ") as SpellSchool;
    if (shouldExit) return false;

    let combined = Object.assign(_card, { "spellClass": spellClass });

    return applyCard(combined);
}

function weapon() {
    let _card = common();
    if (!_card) return false;

    let stats = input("Stats: ");
    if (shouldExit) return false;

    return applyCard({
        name: _card.name,
        displayName: _card.displayName,
        stats: stats.split("/").map(s => parseInt(s)),
        desc: _card.desc,
        mana: _card.mana,
        type: _card.type,
        classes: _card.classes,
        rarity: _card.rarity,
        runes: _card.runes,
        keywords: _card.keywords,
        id: 0,
    });
}

function hero() {
    let _card = common();
    if (!_card) return false;

    const hpDesc = input("Hero Power Description: ");
    if (shouldExit) return false;

    let hpCost = parseInt(input("Hero Power Cost (Default: 2): "));
    if (shouldExit) return false;

    if (!hpCost) hpCost = 2;

    let combined = Object.assign(_card, {
        hpDesc,
        hpCost
    });

    return applyCard(combined);
}

function location() {
    let _card = common();
    if (!_card) return false;
    
    let durability = parseInt(input("Durability (How many times you can trigger this location before it is destroyed): "));
    if (shouldExit) return false;

    let cooldown = parseInt(input("Cooldown (Default: 2): "));
    if (shouldExit) return false;

    if (!cooldown) cooldown = 2;
    let stats = [0, durability];

    return applyCard({
        name: _card.name,
        displayName: _card.displayName,
        stats: stats,
        desc: _card.desc,
        mana: _card.mana,
        type: _card.type,
        classes: _card.classes,
        rarity: _card.rarity,
        runes: _card.runes,
        keywords: _card.keywords,
        cooldown: cooldown,
        id: 0,
    });
}

export function main() {
    // Reset the card
    // @ts-expect-error
    card = {};

    // Reset the shouldExit switch
    shouldExit = false;
    console.log("Hearthstone.js Custom Card Creator (C) 2022\n");
    console.log("type 'back' at any step to cancel.\n");

    // Ask the user for the type of card they want to make
    type = input("Type: ") as CardType;
    if (shouldExit) return false;

    if (type.toLowerCase() == "minion") {
        let tmpCard = minion();
        if (!tmpCard) return false;
        card = tmpCard;
    }
    else if (type.toLowerCase() == "weapon") {
        let tmpCard = weapon();
        if (!tmpCard) return false;
        card = tmpCard;
    }
    else if (type.toLowerCase() == "spell") {
        let tmpCard = spell();
        if (!tmpCard) return false;
        card = tmpCard;
    }
    else if (type.toLowerCase() == "location") {
        let tmpCard = location();
        if (!tmpCard) return false;
        card = tmpCard;
    }
    else if (type.toLowerCase() == "hero") {
        let tmpCard = hero();
        if (!tmpCard) return false;
        card = tmpCard;
    }
    else {
        // Invalid type
        console.log("That is not a valid type!");
        rl.question();

        shouldExit = true;
    }

    if (shouldExit) return false;

    // Ask the user if the card should be uncollectible
    let uncollectible = rl.keyInYN("Uncollectible?");
    if (uncollectible) card.uncollectible = uncollectible as boolean;

    // Actually create the card
    console.log("Creating file...");

    lib.set_type("Custom");
    let filePath = lib.create(type, card);

    game.input();
    return filePath;
}
