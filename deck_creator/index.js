'use strict';

const colors = require("colors");

try {
    require(__dirname + "/../src/game");
} catch (err) {
    require("readline-sync").question("ERROR: This program is dependant on the modules in Hearthstone.js, so the file 'index.js' needs to be in the directory 'Hearthstone.js/deck_creator'.\n".red);
    require("process").exit(1);
}

const { Game } = require("../src/game");

const game = new Game({}, {});
const functions = game.functions;
game.dirname = __dirname + "/../";

functions.importCards(__dirname + "/../cards");
functions.importConfig(__dirname + "/config");
// ===========================================================

const config = game.config;
const cards = functions.getCards();
const classes = functions.getClasses();

let chosen_class;
let filtered_cards = {};

let deck = [];
let runes = "";

let plr = new game.Player("");

let maxDeckLength = config.maxDeckLength;
let minDeckLength = config.minDeckLength;

let warnings = {
    latestCard: true
}

let settings = {
    card: {
        latest: null
    },
    view: {
        type: "cards",
        page: 1,
        maxPage: null,
        cpp: 15, // Cards per page
        class: null
    },
    sort: {
        type: "rarity",
        order: "asc"
    },
    search: {
        query: [],
        prevQuery: []
    },
    deckcode: {
        cardId: "id"
    },
    other: {
        defaultCmd: "add",
        rulesShown: false
    }
}

function askClass() {
    game.interact.printName();
    let _class = game.input("What class to you want to choose?\n" + classes.join(", ") + "\n");
    if (_class) _class = functions.capitalizeAll(_class);

    if (!classes.includes(_class)) return askClass();

    if (_class == "Death Knight") {
        runes = "";

        while (runes.length < 3) {
            game.interact.printName();

            let rune = game.input(`What runes do you want to add (${3 - runes.length} more)\nBlood, Frost, Unholy\n`);
            if (!rune || !["B", "F", "U"].includes(rune[0].toUpperCase())) continue;

            runes += rune[0].toUpperCase();
        }

        plr.runes = runes;
    }

    return _class;
}

function getDisplayName(card) {
    return card.displayName || card.name;
}

function sortCards(_cards) {
    if (!["asc", "desc"].includes(settings.sort.order)) settings.sort.order = "asc"; // If the order is invalid, fall back to ascending
    settings.sort.type = settings.sort.type.toLowerCase();
    settings.sort.type = settings.sort.type.toLowerCase();

    let type = settings.sort.type;
    let order = settings.sort.order;

    const calcOrder = (a, b) => {
        if (order == "asc") return a - b;
        else return b - a;
    }

    if (type == "rarity") {
        let sortScores = ["Free", "Common", "Rare", "Epic", "Legendary"];

        return _cards.sort((a, b) => {
            let scoreA = sortScores.indexOf(a.rarity);
            let scoreB = sortScores.indexOf(b.rarity);

            return calcOrder(scoreA, scoreB);
        });
    }

    if (["name", "type"].includes(type)) {
        return _cards.sort((a, b) => {
            let typeA;
            let typeB;

            if (type == "name") {
                typeA = getDisplayName(a);
                typeB = getDisplayName(b);
            }
            else {
                typeA = functions.getType(a);
                typeB = functions.getType(b);
            }

            let ret = typeA.localeCompare(typeB);
            if (order == "desc") ret = -ret;

            return ret;
        });
    }

    if (["mana", "id"].includes(type)) {
        return _cards.sort((a, b) => {
            return calcOrder(a[type], b[type]);
        });
    }

    // If 'type' isn't valid, fall back to sorting by rarity
    settings.sort.type = "rarity";
    return sortCards(_cards);
}

function searchCards(_cards, sQuery) {
    if (sQuery == []) return _cards;

    let ret_cards = [];

    let query = sQuery.split(":");

    if (query.length <= 1) {
        // The user didn't specify a key. Do a general search
        query = query[0].toLowerCase();

        _cards.forEach(c => {
            let name = getDisplayName(c).toLowerCase();
            let desc = c.desc.toLowerCase();

            if (!name.includes(query) && !desc.includes(query)) return;

            ret_cards.push(c);
        });

        return ret_cards;
    }

    let [key, val] = query;

    val = val.toLowerCase();

    const doReturn = (c) => {
        let ret = c[key];

        if (!ret && ret !== 0) { // Javascript
            console.log(`\nKey '${key}' not valid!`.red);
            return -1;
        }

        // Mana even / odd
        if (key == "mana") {
            // Mana range
            let regex = /\d+-\d+/; // 1-10
            if (regex.test(val)) {
                let _val = val.split("-");

                let min = _val[0];
                let max = _val[1];

                return ret >= min && ret <= max;
            }

            if (val == "even") return ret % 2 == 0;
            else if (val == "odd") return ret % 2 == 1;
            else if (parseInt(val)) return ret == val;
            else {
                console.log(`\nValue '${val}' not valid!`.red);
                return -1;
            }
        }

        if (typeof(ret) === "string") return ret.toLowerCase().includes(val);
        else if (typeof(ret) === "number") return ret == val;
    }

    let error = false;

    _cards.forEach(c => {
        if (error) return;

        let ret = doReturn(c);

        if (ret === -1) {
            error = true;
            return;
        }

        if (ret) ret_cards.push(c);
    });

    if (error) return false;

    return ret_cards;
}

function showCards() {
    filtered_cards = {};
    game.interact.printName();

    if (!settings.view.class || !["Neutral", chosen_class].includes(settings.view.class)) settings.view.class = chosen_class;

    Object.values(cards).forEach(c => {
        if (c.runes && !plr.testRunes(c.runes)) return;

        let reg = new RegExp(`^${chosen_class}|Neutral`);

        c.class.split(" / ").forEach(cl => {
            if (!reg.test(cl)) return;

            filtered_cards[c.name] = c;
        });
    });

    if (!settings.other.rulesShown) showRules();

    let cpp = settings.view.cpp;
    let page = settings.view.page;

    // Search

    if (settings.search.query.length > 0) console.log(`Searching for '${settings.search.query.join(' ')}'.`);

    let _filtered_cards = Object.values(filtered_cards).filter(c => c.class == settings.view.class);

    let searchFailed = false;

    settings.search.query.forEach(q => {
        if (searchFailed) return;

        _filtered_cards = searchCards(_filtered_cards, q);

        if (_filtered_cards === false) {
            game.input(`Search failed at '${q}'! Reverting back to last successfull query.\n`.red);
            searchFailed = true;
        }
    });

    if (_filtered_cards.length <= 0) {
        game.input(`\nNo cards match search.\n`);
        searchFailed = true;
    }

    if (searchFailed) {
        settings.search.query = settings.search.prevQuery;
        return showCards();
    }

    settings.search.prevQuery = settings.search.query;

    settings.view.maxPage = Math.ceil(_filtered_cards.length / cpp);
    if (page > settings.view.maxPage) page = settings.view.maxPage;

    if (!settings.other.rulesShown) console.log(); // Add newline

    let oldSortType = settings.sort.type;
    let oldSortOrder = settings.sort.order;
    console.log(`Sorting by ${settings.sort.type.toUpperCase()}, ${settings.sort.order}ending.`);

    // Sort
    _filtered_cards = sortCards(_filtered_cards);

    let sortTypeInvalid = oldSortType != settings.sort.type;
    let sortOrderInvalid = oldSortOrder != settings.sort.order;

    if (sortTypeInvalid) console.log(`Sorting by '${oldSortType.toUpperCase()}' failed! Falling back to ${settings.sort.type.toUpperCase()}.`.yellow);
    if (sortOrderInvalid) console.log(`Ordering by '${oldSortOrder}ending' failed! Falling back to ${settings.sort.order}ending.`.yellow)

    if (sortTypeInvalid || sortOrderInvalid) console.log(`\nSorting by ${settings.sort.type.toUpperCase()}, ${settings.sort.order}ending.`);

    // Page logic
    _filtered_cards = _filtered_cards.slice(cpp * (page - 1), cpp * page);

    // Loop
    console.log(`\nPage ${page} / ${settings.view.maxPage}\n`);

    console.log(settings.view.class.rainbow);

    let [wall, finishWall] = functions.createWall("-");

    _filtered_cards.forEach(c => {
        wall.push(getDisplayName(c) + " - " + c.id);
    });

    finishWall().forEach(b => {
        b = b.split("-");

        b = functions.colorByRarity(b[0], findCard(b[0].trim()).rarity) + "-" + b[1];

        console.log(b);
    });

    console.log("\nCurrent deckcode output:");
    let [_deckcode, error] = deckcode();
    if (error == "valid") {
        console.log("Valid deck!".green);
        console.log(_deckcode);
    }

    if (!settings.other.rulesShown) settings.other.rulesShown = true;
}

function showRules() {
    let config_text = "### RULES ###";
    console.log("#".repeat(config_text.length));
    console.log(config_text);
    console.log("#".repeat(config_text.length));

    console.log("#");

    console.log("# Validation: " + (config.validateDecks ? "ON".green : "OFF".red));

    console.log("#\n# Rule 1. Minimum Deck Length: " + minDeckLength.toString().yellow);
    console.log("# Rule 2. Maximum Deck Length: " + maxDeckLength.toString().yellow);

    console.log("#\n# Rule 3. Maximum amount of cards for each card (eg. You can only have: " + "x".yellow + " Seances in a deck): " + config.maxOfOneCard.toString().yellow);
    console.log("# Rule 4. Maximum amount of cards for each legendary card (Same as Rule 3 but for legendaries): " + config.maxOfOneLegendary.toString().yellow);

    console.log("#");

    console.log("# There are 3 types of deck states: Valid, Pseudo-Valid, Invalid");
    console.log("# Valid decks will work properly");
    console.log("# Pseudo-valid decks will be rejected by the deck importer for violating a rule");
    console.log("# Invalid decks are decks with a fundemental problem that the deck importer cannot resolve. Eg. An invalid card in the deck.");
    console.log("# Violating any of these rules while validation is enabled will result in a pseudo-valid deck.");

    console.log("#");

    console.log("#".repeat(config_text.length));
}

function findCard(card) {
    let _card;

    Object.values(filtered_cards).forEach(c => {
        if (getDisplayName(c).toLowerCase() == card.toLowerCase() || c.id == card) _card = c;
    });

    return _card;
}

function chooseCard(prompt) {
    let card = game.input(prompt);
    card = findCard(card);

    if (!card) return chooseCard();

    return card;
}

function viewCard(c) {
    let stats = "";

    if (["Minion", "Weapon"].includes(functions.getType(c))) stats = ` [${c.stats.join(' / ')}]`.green;
    console.log(`{${c.mana}} `.cyan + functions.colorByRarity(getDisplayName(c), c.rarity) + stats + ` (${c.desc}) ` + `(${functions.getType(c)})`.yellow);

    game.input("\nPress enter to continue...");
}

function add(c) {
    deck.push(c);

    if (!c.settings) return;

    maxDeckLength = c.settings.maxDeckSize || maxDeckLength
    minDeckLength = c.settings.minDeckSize || minDeckLength
}
function remove(c) {
    deck.splice(deck.indexOf(c), 1);
}

function showDeck() {
    game.interact.printName();

    console.log("Deck Size: " + deck.length.toString().yellow + "\n");

    let _cards = {};

    deck.forEach(c => {
        if (!_cards[c.name]) _cards[c.name] = [c, 0];
        _cards[c.name][1]++;
    });

    let [wall, finishWall] = functions.createWall("-");

    Object.values(_cards).forEach(c => {
        let card = c[0];
        let amount = c[1];

        let viewed = "";

        if (amount > 1) viewed += `x${amount} `;
        viewed += getDisplayName(card).replaceAll("-", "`") + ` - ${card.id}`;

        wall.push(viewed);
    });

    finishWall().forEach(b => {
        b = b.split("-");
        b = [b[0].replaceAll("`", "-"), b[1]]; // Replace '`' with '-'

        // Color b[0] by rarity
        let r = /^x\d+ /;

        if (r.test(b[0])) {
            // Amount specified
            let amount = b[0].split(r);
            let card = findCard(b[0].replace(r, "").trim());
            let name = functions.colorByRarity(amount[1], card.rarity);

            console.log(`${r.exec(b[0])}${name}-${b[1]}`);
            return;
        }

        let card = findCard(b[0].trim());
        let name = functions.colorByRarity(b[0], card.rarity);

        console.log(`${name}-${b[1]}`);
    });

    console.log("\nCurrent deckcode output:");
    let [_deckcode, error] = deckcode();
    if (error == "valid") {
        console.log("Valid deck!".green);
        console.log(_deckcode);
    }
}

function deckcode() {
    let pseudo = false;

    // Deck size warnings
    if (deck.length < minDeckLength) {
        console.log("WARNING: Too few cards.".yellow);

        pseudo = true;
    }
    if (deck.length > maxDeckLength) {
        console.log("WARNING: Too many cards.".yellow);

        pseudo = true;
    }

    // Check if the deck is empty
    if (deck.length <= 0) {
        console.log("ERROR: Could not generate deckcode as your deck is empty. The resulting deckcode would be invalid.".red);
        return ["", "invalid"];
    }

    let deckcode = `${chosen_class} `;
    if (runes) {
        // If the runes is 3 of one type, write, for example, 3B instead of BBB
        if (new Set(runes.split("")).size == 1) deckcode += `[3${runes[0]}] `;
        else deckcode += `[${runes}] `;
    }

    deckcode += "/";

    let _cards = {};

    deck.forEach(c => {
        if (!_cards[c.name]) _cards[c.name] = [c, 0];
        _cards[c.name][1]++;
    });

    let __cards = {};

    Object.values(_cards).forEach(c => {
        let a = c[1];
        if (!__cards[a]) __cards[a] = [];
        __cards[a].push(c);
    });

    let str_cards = "";

    let prev_amount = 0;
    Object.values(__cards).forEach((c, i) => {
        let amount = c[0][1];

        if (i == Object.keys(__cards).length - 1) deckcode += `${amount},`;
        else deckcode += `${amount}:${__cards[amount].length},`; // "/3:5,2:8,1/";

        c.forEach(v => {
            let card = v[0];

            let id = card[settings.deckcode.cardId];

            // Extra optimization
            if (settings.deckcode.cardId == "id") id = id.toString(36);

            str_cards += `${id},`;

            if (amount > config.maxOfOneLegendary && card.rarity == "Legendary") {
                console.log("WARNING: Too many copies of a Legendary card. Maximum is: ".yellow + config.maxOfOneLegendary.toString() + ". Offender: ".yellow + `{ Name: "${card.name}", Amount: "${amount}" }`);

                pseudo = true;
            }
            else if (amount > config.maxOfOneCard) {
                console.log("WARNING: Too many copies of a card. Maximum is: ".yellow + config.maxOfOneCard.toString() + ". Offender: ".yellow + `{ Name: "${card.name}", Amount: "${amount}" }`);

                pseudo = true;
            }
        });
    });

    deckcode = deckcode.slice(0, -1); // Remove the last ", "

    deckcode += "/ ";

    deckcode += str_cards;
    deckcode = deckcode.slice(0, -1); // Remove the last ", "

    return pseudo ? [deckcode, "pseudo"] : [deckcode, "valid"];
}

function help() {
    game.interact.printName();

    // Commands
    console.log("Available commands:".bold);
    console.log("(In order to run a command; input the name of the command and follow further instruction.)\n");
    console.log("(name) [optional] (required) - (description)\n");

    console.log("add [name | id]       - Add a card to the deck");
    console.log("remove [card | id]    - Remove a card from the deck");
    console.log("view [card | id]      - View a card");
    console.log("page (num)            - View a different page");
    console.log("cards (class)         - Show cards from 'class'");
    console.log("sort (type) [order]   - Sorts by 'type' in 'order'ending order. (Type can be: ('rarity', 'name', 'mana', 'id', 'type'), Order can be: ('asc', 'desc')) (Example: sort mana asc - Will show cards ordered by mana cost, ascending.)");
    console.log("search [query]        - Searches by query. Keys: ('name', 'desc', 'mana', 'rarity', 'id'), Examples: (search the - Search for all cards with the word 'the' in the name or description, case insensitive.), (search mana:2 - Search for all cards that costs 2 mana, search mana:even name:r - Search for all even cost cards with 'r' in its name)");
    console.log("deck                  - Toggle deck-view");
    console.log("deckcode              - View the current deckcode");
    console.log("import                - Imports a deckcode (Overrides your deck)");
    console.log("export                - Temporarily saves your deck to the runner so that when you choose to play, the decks get filled in automatically. (Only works when running the deck creator from the Hearthstone.js Runner)");
    console.log("set (setting) (value) - Change some settings. Look down to 'Set Subcommands' to see available settings");
    console.log("class                 - Change the class");
    console.log("config | rules        - Displays the rules text that shows when first running the program");
    console.log("help                  - Displays this message");
    console.log("exit                  - Quits the program");

    // Set
    console.log("\nSet Subcommands:".bold);
    console.log("(In order to use these; input 'set ', then one of the subcommands. Example: 'set cpp 20')\n");
    console.log("(name) [optional] (required) - (description)\n");

    console.log("name                        - Makes the deckcode generator use names instead of ids");
    console.log("id                          - Makes the deckcode generator use ids instead of names");
    console.log("cardsPerPage | cpp (num)    - How many cards to show per page [default = 15]");
    console.log("latestCardWarning | lcwarn  - If it should warn you when using the latest card, the latest card is used if the card chosen is invalid and the name specified begins with 'l'");
    console.log("defaultCommand | dcmd (cmd) - The command that should run when the command is unspecified. ('add', 'remove', 'view') [default = 'add']");

    console.log("\nNote the 'cardsPerPage' commands has 2 different subcommands; cpp & cardsPerPage. Both do the same thing.".gray);

    // Notes
    console.log("\nNotes:".bold);

    console.log("Type 'cards Neutral' to see Neutral cards.");

    game.input("\nPress enter to continue...\n");
}

function getCardArg(cmd, callback) {
    let times = 1;

    let card = cmd.split(" ");
    card.shift();

    if (card.length > 1 && parseInt(card[0])) {
        times = parseInt(card[0])
        card.shift();
    }

    card = card.join(" ");

    let eligibleForLatest = false;
    if (card.startsWith("l")) eligibleForLatest = true;

    card = findCard(card);

    if (!card && eligibleForLatest) {
        console.log(`Card not found. Using latest valid card instead.`.yellow);
        if (warnings.latestCard) game.input();
        card = settings.card.latest;
    }

    if (!card) {
        game.input("Invalid card.\n".red);
        return false;
    }

    for (let i = 0; i < times; i++) callback(card);

    settings.card.latest = card;

    return card;
}

function handleCmds(cmd) {
    if (cmd.startsWith("config") || cmd.startsWith("rules")) {
        game.interact.printName();
        showRules();
        game.input("\nPress enter to continue...\n");
    }
    else if (cmd == "view") {
        let card = chooseCard("View a card: ");

        viewCard(card);
    }
    else if (cmd.startsWith("view")) {
        getCardArg(cmd, viewCard);
    }
    else if (cmd == "add") {
        let card = chooseCard("Add a card to the deck: ");

        add(card);
    }
    else if (cmd.startsWith("a")) {
        getCardArg(cmd, add);
    }
    else if (cmd == "remove") {
        let card = chooseCard("Remove a card from the deck: ");

        remove(card);
    }
    else if (cmd.startsWith("r")) {
        getCardArg(cmd, remove);
    }
    else if (cmd.startsWith("p")) {
        let page = cmd.split(" ");
        page.shift();
        page = page.join(" ");

        page = parseInt(page)
        if (!page) return;

        if (page < 1) page = 1;
        settings.view.page = parseInt(page);
    }
    else if (cmd.startsWith("cards")) {
        let _class = cmd.split(" ");
        _class.shift();

        if (_class.length <= 0) return;

        _class = _class.join(" ");
        _class = functions.capitalizeAll(_class);

        if (!classes.includes(_class) && _class != "Neutral") {
            game.input("Invalid class!\n".red);
            return;
        }

        if (![chosen_class, "Neutral"].includes(_class)) {
            game.input(`Class '${_class}' is a different class. To see these cards, please switch class from '${chosen_class}' to '${_class}' to avoid confusion.\n`.red);
            return;
        }

        settings.view.class = _class;
    }
    else if (cmd.startsWith("deckcode")) {
        let [_deckcode, error] = deckcode();

        let toPrint = _deckcode + "\n";
        if (error == "invalid") toPrint = "";

        game.input(toPrint);
    }
    else if (cmd.startsWith("sort")) {
        let args = cmd.split(" ");
        args.shift();

        if (args.length <= 0) return;

        settings.sort.type = args[0];
        if (args.length > 1) settings.sort.order = args[1];
    }
    else if (cmd.startsWith("search")) {
        let args = cmd.split(" ");
        args.shift();

        if (args.length <= 0) {
            settings.search.query = [];
            return;
        }

        //args = args.join(" ");

        settings.search.query = args;
    }
    else if (cmd.startsWith("deck")) {
        settings.view.type = settings.view.type == "cards" ? "deck" : "cards";
    }
    else if (cmd.startsWith("import")) {
        console.log("WARNING: Deck importing is currently buggy. Please be patient.".yellow); // TODO: Fix deck importing, removing a card from the deck after importing will somehow remove an unrelated card
        let _deckcode = game.input("Please input a deckcode: ");

        game.config.validateDecks = false;
        let _deck = functions.importDeck(plr, _deckcode);
        game.config.validateDecks = true;

        if (_deck == "invalid") return;

        deck = [];
        _deck.forEach(c => add(c)); // You can just set deck = functions.importDeck(), but doing it that way doesn't account for renathal or any other card that changes the config in any way since that is done using the add function.
        chosen_class = plr.heroClass;
        runes = plr.runes;

        showCards();
    }
    else if (cmd.startsWith("export")) {
        if (!opened_from_runner) {
            game.input("ERROR: This command can only be used when the deck creator was opened using the Hearthstone.js Runner.\n".red);
            return;
        }

        let [_deckcode, error] = deckcode();

        if (error != "valid") {
            game.input("ERROR: Cannot export invalid / pseudo-valid deckcodes.\n".red);
            return;
        }

        require(__dirname + "/../index").store_deck(_deckcode);

        game.input("Deck successfully exported.\n".green);
    }
    else if (cmd.startsWith("class")) {
        let _runes = runes;
        let new_class = askClass();

        if (new_class == chosen_class && runes == _runes) {
            game.input("Your class was not changed\n".yellow);
            return;
        }

        deck = [];
        chosen_class = new_class;
        if (settings.view.class != "Neutral") settings.view.class = chosen_class;
    }
    else if (cmd.startsWith("set")) {
        let setting = cmd.split(" ");
        setting.shift();
        let args = setting.slice(1);
        setting = setting[0];

        switch (setting) {
            case "id":
                settings.deckcode.cardId = "id";
                break;
            case "name":
                settings.deckcode.cardId = "name";
                break;
            case "lcwarn":
            case "latestCardWarning":
                warnings.latestCard = !warnings.latestCard;
                console.log(`Latest card warning is now: ${warnings.latestCard}.\n`);
                break;
            case "cpp":
            case "cardsPerPage":
                settings.view.cpp = parseInt(args);
                break;
            case "dcmd":
            case "defaultCommand":
                if (args.length == 0) {
                    settings.other.defaultCmd = "add";
                    console.log("Set default command to: " + "add".yellow);
                    break;
                }

                if (!["add", "remove", "view"].includes(args[0])) return;
                let cmd = args[0];

                settings.other.defaultCmd = cmd;
                console.log("Set default command to: " + args[0].yellow);
                break;
            default:
                game.input(`'${setting}' is not a valid setting.\n`.red);
                return;
        }

        game.input("Setting successfully changed!\n".green);
    }
    else if (cmd.startsWith("help")) {
        help();
    }
    else if (cmd.startsWith("exit")) {
        running = false;
    }
    else {
        // Infer add
        console.log(`Unable to find command. Trying '${settings.other.defaultCmd} ${cmd}'`.yellow);
        handleCmds(`${settings.other.defaultCmd} ${cmd}`);
    }
}

let opened_from_runner = false;
let running = true;

function runner() {
    require(__dirname + "/../index").free_decks(); // Remove all decks
    opened_from_runner = true;
    running = true;
    main();
}

function main() {
    chosen_class = askClass();

    while (running) {
        if (settings.view.type == "cards") showCards();
        else if (settings.view.type == "deck") showDeck();
        handleCmds(game.input("\n> "));
    }
}

exports.runner = runner;

if (require.main == module) main();
