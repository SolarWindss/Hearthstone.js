const colors = require("colors");
const { exit } = require('process');

const license_url = 'https://github.com/Keatpole/Hearthstone.js/blob/main/LICENSE';
const copyright_year = "2023";

let game;
let curr;

class Interact {
    constructor(_game) {
        game = _game;
    }

    // Constant interaction
    doTurnAttack() {
        /**
         * Asks the user to attack a minion or hero
         *
         * @returns {undefined}
         */

        let attacker, target;

        if (curr.ai) {
            let ai = curr.ai.chooseBattle();

            if (ai.includes(-1)) return -1;
            if (ai.includes(null)) return null;

            attacker = ai[0];
            target = ai[1];
        } else {
            attacker = this.selectTarget("Which minion do you want to attack with?", false, "self");
            if (!attacker) return;

            target = this.selectTarget("Which minion do you want to attack?", false, "enemy");
            if (!target) return;
        }
    
        let errorcode = game.attack(attacker, target);
        game.killMinions();

        let ignore = ["divineshield"];
        if (errorcode === true || ignore.includes(errorcode)) return errorcode;
        let err;

        switch (errorcode) {
            case "taunt":
                err = "There is a minion with taunt in the way";
                break;
            case "stealth":
                err = "That minion has stealth";
                break;
            case "frozen":
                err = "That minion is frozen";
                break;
            case "plrnoattack":
                err = "You don't have any attack";
                break;
            case "noattack":
                err = "This minion has no attack";
                break;
            case "hasattacked":
                err = "This minion has already attacked this turn";
                break;
            case "sleepy":
                err = "This minion is exhausted";
                break;
            case "cantattackhero":
                err = "This minion cannot attack heroes";
                break;
            default:
                err = "An unknown error occurred. Error code: 19";
                break;
        }

        console.log(`${err}.`.red);
        game.input();
    }
    handleCmds(q) {
        /**
         * Checks if "q" is a command, if it is, do something, if not return -1
         * 
         * @returns {undefined} | -1
         */

        if (q === "end") game.endTurn();
        else if (q === "hero power") {
            if (curr.ai) {
                curr.heroPower();
                return;
            }

            if (curr.mana < (curr.hero.hpCost || 2)) {
                game.input("You do not have enough mana.\n".red);
                return;
            }

            this.printAll(curr);
            let ask = this.yesNoQuestion(curr, curr.hero.hpDesc.yellow + " Are you sure you want to use this hero power?");
            if (!ask) return;

            this.printAll(curr);
            curr.heroPower();
        }
        else if (q === "attack") {
            this.doTurnAttack();
            game.killMinions();
        }
        else if (q === "use") {
            // Use location
            let errorcode = this.useLocation();
            game.killMinions();

            if (errorcode === true || curr.ai) return true;
            let err;

            switch (errorcode) {
                case "nolocations":
                    err = "You have no location cards";
                    break;
                case "invalidtype":
                    err = "That card is not a location card";
                    break;
                case "cooldown":
                    err = "That location is on cooldown";
                    break;
                default:
                    err = "An unknown error occourred. Error code: 51";
                    break;
            }

            console.log(`${err}.`.red);
            game.input();
        }
        else if (q === "help") {
            this.printName();
            console.log("(In order to run a command; input the name of the command and follow further instruction.)\n");
            console.log("Available commands:");
            console.log("(name)     - (description)\n");

            console.log("end        - Ends your turn");
            console.log("attack     - Attack");
            console.log("concede    - Forfeits the game");
            console.log("view       - View a minion");
            console.log("hero power - Use your hero power");
            console.log("use        - Use a location card");
            console.log("detail     - Get more details about opponent");
            console.log("help       - Displays this message");
            console.log("license    - Opens a link to this project's license");

            const cond_color = (str) => {return (game.config.debug) ? str : str.gray};

            console.log(cond_color("\n--- Debug Commands (") + ((game.config.debug) ? "ON".green : "OFF".red) + cond_color(") ---"));
            console.log(cond_color("/give <Card Name> - Adds a card to your hand"));
            console.log(cond_color("/eval <Code>      - Runs the code specified"));
            console.log(cond_color("/debug            - Destroys your hand and deck and gives you infinite mana, health and armor"));
            console.log(cond_color("/stats            - Gives you a list of the game stats that have happened in an alphabetical order"));
            console.log(cond_color("/ai               - Gives you a list of the actions the ai(s) have taken in the order they took it"));
            console.log(cond_color("---------------------------" + ((game.config.debug) ? "" : "-")));
            
            game.input("\nPress enter to continue...\n");
        }
        else if (q == "view") {
            let minion = this.selectTarget("Which minion do you want to view?", false, null, "minion");
            if (!minion) return -1;
    
            this.viewMinion(minion);
        }
        else if (q == "detail") {
            this.printAll(curr, true);
            game.input("Press enter to continue...\n");
            this.printAll(curr);
        }
        else if (q == "concede") {
            let confirmation = this.yesNoQuestion(curr, "Are you sure you want to concede?");
            if (!confirmation) return;

            game.endGame(curr.getOpponent());
        }
        else if (q == "license") {
            let start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
            require('child_process').exec(start + ' ' + license_url);
        }

        else if (q.startsWith("/give ")) {
            if (!game.config.debug) return -1;
    
            let name = q.split(" ");
            name.shift();
            name = name.join(" ");
    
            let card = game.functions.getCardByName(name);
            if (!card) return game.input("Invalid card: `" + name + "`.\n");
    
            curr.addToHand(new game.Card(card.name, curr));
        }
        else if (q.startsWith("/eval")) {
            if (!game.config.debug) return -1;

            let code = q.split(" ");
            code.shift();
            code = code.join(" ");
    
            eval(code);
        }
        else if (q == "/debug") {
            if (!game.config.debug) return -1;
    
            curr.maxMaxMana = 1000;
            curr.maxMana = 1000;
            curr.mana = 1000;
    
            curr.deck = [];
            curr.hand = [];
    
            curr.health += 10000;
            curr.armor += 100000;
            curr.fatigue = 0;
        }
        else if (q == "/ai") {
            if (!game.config.debug) return -1;

            console.log("AI Info:\n");

            for (let i = 1; i <= 2; i++) {
                const plr = game["player" + i];
                if (!plr.ai) continue;

                console.log(`AI${i} History: {`);

                plr.ai.history.forEach((t, j) => {
                    console.log(`${j + 1} ${t[0]}: (${t[1]}),`);
                });
                
                console.log("}");
            }

            game.input("\nPress enter to continue...");
        }
        else if (q == "/stats") {
            if (!game.config.debug) return -1;

            console.log("Stats:\n");

            for (let i = 1; i <= 2; i++) {
                const plr = game["player" + i];
                
                console.log(`Player ${i}'s Stats: {`);

                Object.keys(game.stats).forEach(s => {
                    if (!game.stats[s][plr.id]) return;
                    game.stats[s][plr.id].forEach(t => {
                        if (t instanceof Array && t[0] instanceof game.Card) {
                            let sb = `[${s}] ([`;
                            t.forEach(v => {
                                if (v instanceof game.Card) v = v.name;
                                sb += `${v}, `;
                            });
                            sb = sb.slice(0, -2);
                            sb += "]),";
                            console.log(sb);
                            return;
                        }
                        if (t instanceof game.Card || typeof(t) !== 'object') {
                            if (t instanceof game.Card) t = t.name;
                            console.log(`[${s}] (${t}),`);
                            return;
                        }

                        console.log(`[${s}] (`);
                        console.log(t);
                        console.log("),");
                    });
                });

                console.log("}");
            }

            game.input("\nPress enter to continue...");
        }

        else return -1;
    }
    doTurnLogic(input) {
        /**
         * Takes the input and checks if it is a command, if it is not, play the card with the id of input parsed into a number
         * 
         * @param {string} input The user input
         * 
         * @returns {boolean | string | Card} true | "invalid" | The return value of game.playCard
         */

        if (this.handleCmds(input) !== -1) return true;
        let card = curr.hand[parseInt(input) - 1];
        if (!card) return "invalid";

        if (input == curr.hand.length || input == 1) card.activate("outcast");
        return game.playCard(card, curr);    
    }
    doTurn() {
        /**
         * Show information and asks the user for an input which is put into doTurnLogic
         * 
         * @returns {boolean | string | Card} Success | The return value of doTurnLogic
         */

        curr = game.player;

        if (curr.ai) {
            let input = curr.ai.calcMove();
            if (!input) return;
            if (input instanceof game.Card) input = (curr.hand.indexOf(input) + 1).toString();

            let turn = this.doTurnLogic(input);

            game.killMinions();

            return turn;
        }

        this.printAll(curr);
    
        let input = "\nWhich card do you want to play? ";
        if (game.turns <= 2 && !game.config.debug) input += "(type 'help' for further information <- This will disappear once you end your turn) ";
    
        const ret = this.doTurnLogic(game.input(input));
        game.killMinions();

        if (ret === true || ret instanceof game.Card) return ret; // If there were no errors, return true.
        if (["refund", "magnetize"].includes(ret)) return ret; // Ignore these error codes
        let err;

        // Error Codes
        if (ret == "mana") err = "Not enough mana";
        else if (ret == "counter") err = "Your card has been countered";
        else if (ret == "space") err = `You can only have ${game.config.maxBoardSpace} minions on the board`;
        else if (ret == "invalid") err = "Invalid card";
        else err = "An unknown error occurred";

        console.log(`${err}.`.red);
        game.input();

        return false;
    }
    useLocation() {
        /**
         * Asks the user to select a location card to use, and activate it.
         * 
         * @return (boolean) Success
         */

        let locations = game.board[curr.id].filter(m => m.type == "Location");
        if (locations.length <= 0) return "nolocations";

        let location = this.selectTarget("Which location do you want to use?", false, "self", "minion", ["allow_locations"]);
        if (location.type != "Location") return "invalidtype";
        if (location.cooldown > 0) return "cooldown";
        
        if (location.activate("use") === -1) return -1;
        
        location.remStats(0, 1);
        location.cooldown = location.backups.cooldown;
        return true;
    }

    // Deck stuff
    validateCard(card, plr) {
        /**
         * Checks if a card is a valid card to put into a players deck
         * 
         * @param {Card} card The card to check
         * @param {Player} plr The player to check against
         * 
         * @returns {boolean | string} Valid | ["class", "uncollectible", "runes"]
         */

        if (plr.heroClass != card.class && card.class != "Neutral") return "class";
        if (card.uncollectible) return "uncollectible";

        // Runes
        if (!card.runes) return true;

        const charCount = (str, letter) => {
            let letter_count = 0;

            for (let i = 0; i < str.length; i++) {
                if (str.charAt(i) == letter) letter_count++;
            }

            return letter_count;
        }

        let blood = charCount(card.runes, "B");
        let frost = charCount(card.runes, "F");
        let unholy = charCount(card.runes, "U");

        let b = charCount(plr.runes, "B");
        let f = charCount(plr.runes, "F");
        let u = charCount(plr.runes, "U");

        if (blood > b || frost > f || unholy > u) return "runes";

        return true;
    }
    deckCode(plr) {
        /**
         * Asks the player to supply a deck code, if no code was given, fill the players deck with 30 Sheep
         * 
         * @param {Player} plr The player to ask
         * 
         * @returns {undefined}
         */

        this.printName();
    
        const deckcode = game.input(`Player ${plr.id + 1}, please type in your deckcode ` + `(Leave this empty for a test deck)`.gray + `: `);
    
        if (deckcode.length > 0) game.functions.importDeck(plr, deckcode);
        else while (plr.deck.length < 30) plr.deck.push(new game.Card("Sheep", plr));
    }
    mulligan(plr) {
        /**
         * Asks the player to mulligan their cards
         * 
         * @param {Player} plr The player to ask
         * 
         * @returns {string} A string of the indexes of the cards the player mulligan'd
         */

        this.printName();

        let sb = "Your hand is: [ ";

        plr.hand.forEach(c => {
            if (c.name == "The Coin") return;

            sb += game.functions.colorByRarity(c.displayName, c.rarity) + ", ";
        });

        sb = sb.slice(0, -2) + " ]\n";
        sb += "Choose the cards to mulligan (1, 2, 3, ...):\n";
        if (!game.config.debug) sb += "(Example: 13 will mulligan your left and right most cards, 123 will mulligan your 3 leftmost cards, just pressing enter will not mulligan any cards):\n".gray;

        let input;

        if (plr.ai) input = plr.ai.mulligan();
        else input = game.input(sb);

        let is_int = game.functions.mulligan(plr, input);

        if (!is_int && input != "") {
            game.input("Invalid input!\n".red);
            return this.mulligan(plr);
        }

        return input;
    }

    // One-time things
    chooseOne(prompt, options, times = 1) {
        /**
         * Asks the user a "prompt" give the user "options" and do it all "times" times
         * 
         * @param {string} prompt The prompt to ask the user
         * @param {string[]} options The options to give the user
         * @param {number} times [default=1] The amount of time to ask
         * 
         * @returns {string | string[]} The user's answer(s)
         */

        this.printAll(curr);

        let choices = [];

        for (let i = 0; i < times; i++) {
            if (game.player.ai) {
                choices.push(game.player.ai.chooseOne(options));
                continue;
            }

            let p = `\n${prompt} [`;

            options.forEach((v, i) => {
                p += `${i + 1}: ${v}, `;
            });

            p = p.slice(0, -2);
            p += "] ";

            let choice = game.input(p);
            if (!parseInt(choice)) {
                game.input("Invalid input!\n".red);
                return this.chooseOne(prompt, options, times);
            }

            choices.push(parseInt(choice) - 1);
        }

        if (times === 1) {
            return choices[0];
        } else {
            return choices;
        }
    }
    question(plr, prompt, answers) {
        /**
         * Asks the user a "prompt", show them a list of answers and make them choose one
         *
         * @param {Player} plr The player to ask
         * @param {string} prompt The prompt to show
         * @param {string[]} answers The answers to choose from
         *
         * @returns {string} Chosen
         */

        this.printAll(plr);

        let strbuilder = `\n${prompt} [`;

        answers.forEach((v, i) => {
            strbuilder += `${i + 1}: ${v}, `;
        });

        strbuilder = strbuilder.slice(0, -2);
        strbuilder += "] ";

        let choice;

        if (plr.ai) choice = plr.ai.question(prompt, answers);
        else choice = game.input(strbuilder); 

        let answer = answers[parseInt(choice) - 1];
        if (!answer) {
            game.input("Invalid input!\n".red);
            return this.question(plr, prompt, answers);
        }

        return answer;
    }
    yesNoQuestion(plr, prompt) {
        /**
         * Asks the user a yes/no question
         *
         * @param {Player} plr The player to ask
         * @param {string} prompt The prompt to ask
         *
         * @returns {bool} true if Yes / false if No
         */

        this.printAll(plr);

        let ask = `\n${prompt} [` + 'Y'.green + ' | ' +  'N'.red + `] `;

        if (plr.ai) return plr.ai.yesNoQuestion(prompt);

        let _choice = game.input(ask);
        let choice = _choice.toUpperCase()[0];

        if (["Y", "N"].includes(choice)) return choice === "Y";

        // Invalid input
        console.log("Unexpected input: '".red + _choice.yellow + "'. Valid inputs: ".red + "[" + "Y".green + " | " + "N".red + "]");
        game.input();

        return this.yesNoQuestion(plr, prompt);
    }
    discover(prompt, amount = 3, flags = [], add_to_hand = true, _cards = []) {
        /**
         * Asks the user a "prompt", show them "amount" cards based on "flags", if "add_to_hand", add the card chosen to the player's hand, else return the card chosen
         * 
         * @param {string} prompt The prompt to ask
         * @param {number} amount [default=3] The amount of cards to show
         * @param {string[]} flags [default=[]] Some flags to filter the cards shown, possible flags: ["Minion", "Spell", "Weapon"]
         * @param {boolean} add_to_hand [default=true] If it should add the card chosen to the current player's hand
         * @param {Blueprint[]} _cards [default=[]] Do not use this variable, keep it at default
         * 
         * @returns {Card} The card chosen.
         */

        this.printAll(curr);
        let values = _cards;

        if (_cards.length == 0) {
            let possible_cards = [];

            game.functions.getCards().forEach((c, _) => {
                let type = game.functions.getType(c);

                if (type == "Spell" && c.class == "Neutral") {}
                else if (c.class === game.player.class || c.class == "Neutral") {
                    if (flags.includes("Minion") && type !== "Minion") return;
                    if (flags.includes("Spell") && type !== "Spell") return;
                    if (flags.includes("Weapon") && type !== "Weapon") return;

                    possible_cards.push(c);
                }
            });

            if (possible_cards.length == 0) return;

            for (let i = 0; i < amount; i++) {
                let c = game.functions.randList(possible_cards);

                values.push(c);
                possible_cards.splice(possible_cards.indexOf(c), 1);
            }
        }

        if (values.length <= 0) return;

        if (game.player.ai) return game.player.ai.discover(values);

        let p = `\n${prompt}\n[\n`;

        values.forEach((v, i) => {
            v = game.functions.getCardByName(v.name);
            let stats = v.type == "Minion" ? ` [${v.getAttack()} / ${v.getHealth()}]`.brightGreen : "";
            let desc = `(${v.desc})` || "";

            // Check for a TypeError and ignore it
            try {
                p += `[${i + 1}] ` + `{${v.mana}} `.cyan + game.functions.colorByRarity(`${v.displayName || v.name}`, v.rarity) + `${stats} ${desc} ` + `(${game.functions.getType(v)})`.yellow + `,\n`;
            } catch (e) {}
        });

        p = p.slice(0, -2);
        p += "\n] ";

        let choice = game.input(p);

        if (!values[parseInt(choice) - 1]) {
            return this.discover(prompt, amount, flags, add_to_hand, values);
        }

        let card = values[parseInt(choice) - 1];
        card = new game.Card(card.name, game.player);

        if (add_to_hand) game.player.addToHand(card);

        return card;
    }
    selectTarget(prompt, elusive = false, force_side = null, force_class = null, flags = []) {
        /**
         * Asks the user a "prompt", the user can then select a minion or hero
         * 
         * @param {string} prompt The prompt to ask
         * @param {boolean | string} elusive [default=false] Wether or not to prevent selecting elusive minions, if this is a string, allow selecting elusive minions but don't trigger secrets / quests
         * @param {string | null} force_side [default=null] Force the user to only be able to select minions / the hero of a specific side: ["enemy", "self"]
         * @param {string | null} force_class [default=null] Force the user to only be able to select a minion or a hero: ["hero", "minion"]
         * @param {string[]} flags [default=[]] Change small behaviours ["allow_locations" => Allow selecting location, ]
         * 
         * @returns {Card | Player} The card or hero chosen
         */


        // force_class = [null, "hero", "minion"]
        // force_side = [null, "enemy", "self"]

        if (game.player.ai) return game.player.ai.selectTarget(prompt, elusive, force_side, force_class, flags);

        if (force_class == "hero") {
            const target = game.input(`Do you want to select the enemy hero, or your own hero? (y: enemy, n: self) `);
    
            return (target.startsWith("y")) ? game.opponent : game.player;
        }

        let p = `\n${prompt} (`;
        if (force_class == null) p += "type 'face' to select a hero | ";
        p += "type 'back' to go back) ";

        const target = game.input(p);

        if (target.startsWith("b")) {
            const return_question = this.yesNoQuestion(game.player, "WARNING: Going back might cause unexpected things to happen. ".red + "Do you still want to go back?");
            
            if (return_question) return false;
        }

        const board_next = game.board[game.opponent.id];
        const board_self = game.board[game.player.id];

        const board_next_target = board_next[parseInt(target) - 1];
        const board_self_target = board_self[parseInt(target) - 1];

        let minion = undefined;

        if (!target.startsWith("face") && !board_self_target && !board_next_target) {
            // target != "face" and target is not a minion.
            // The input is invalid

            return this.selectTarget(prompt, elusive, force_side, force_class);
        }

        if (force_side) {
            if (target.startsWith("face") && force_class != "minion") {
                if (force_side == "enemy") return game.opponent;

                return game.player;
            }

            minion = (force_side == "enemy") ? board_next_target : board_self_target;
        } else {
            if (target.startsWith("face") && force_class != "minion") return this.selectTarget(prompt, false, null, "hero");
            
            if (board_next.length >= parseInt(target) && board_self.length >= parseInt(target)) {
                // Both players have a minion with the same index.
                // Ask them which minion to select
                let target2 = game.input(`Do you want to select your opponent's (${game.functions.colorByRarity(board_next_target.displayName, board_next_target.rarity)}) or your own (${game.functions.colorByRarity(board_self_target.displayName, board_self_target.rarity)})? (y: opponent, n: self | type 'back' to go back) `);
            
                if (target2.startsWith("b")) {
                    // Go back.
                    return this.selectTarget(prompt, elusive, force_side, force_class);
                }

                minion = (target2.startsWith("y")) ? board_next_target : board_self_target;
            } else {
                minion = board_next.length >= parseInt(target) ? board_next_target : board_self_target;
            }
        }

        if (minion === undefined) {
            game.input("Invalid minion.\n".red);
            return false;
        }

        if (minion.keywords.includes("Elusive") && elusive) {
            game.input("Can't be targeted by Spells or Hero Powers.\n".red);
            
            // elusive can be set to any value other than true to prevent targetting but not update
            // spells cast on minions
            if (elusive === true) {
                game.stats.update("spellsCastOnMinions", m);
            }
            return false;
        }

        if (minion.keywords.includes("Stealth") && game.player != minion.plr) {
            game.input("This minion has stealth.\n".red);

            return false;
        }

        // Location
        if (minion.type == "Location") {
            // Set the "allow_locations" flag to allow targetting locations.
            if (flags.includes("allow_locations")) return minion;
            game.input("You cannot target location cards.\n".red);

            return false;
        }

        return minion;
    }

    // Print game information
    printName(name = true) {
        /**
         * Prints the "watermark" border
         * 
         * @param {boolean} name [default=true] If the watermark border should appear, if this is false, just clear the screen
         * 
         * @returns {undefined}
         */

        cls();
    
        if (!name) return;
    
        console.log("|-----------------------------|");
        console.log(`|        HEARTHSTONE.JS       |`);
        console.log("|-----------------------------|\n");
    }
    printLicense(disappear = true) {
        /**
         * Prints some license info
         * 
         * @param {boolean} disappear [default=true] If this is true, "This will disappear once you end your turn" will show up.
         * 
         * @returs undefined
         */

        if (game.config.debug) return;
    
        cls();
    
        console.log(`|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||`)
        console.log(`|||                  Hearthstone.js | Copyright (C) ${copyright_year} | Keatpole                   |||`)
        console.log(`||| This program is licensed under the GNU-GPL license. To learn more: type 'license' |||`)
        if (disappear)
        console.log(`|||                     This will disappear once you end your turn.                   |||`)
        console.log(`|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||\n`);
    }
    printAll(curr, detailed = false) {
        /**
         * Prints all the information you need to understand the game state
         * 
         * @param {Player} curr The current player
         * @param {boolean} detailed [default=false] Show more, less important, information
         * 
         * @returns {undefined}
         */

        if (game.turns <= 2 && !game.config.debug) this.printLicense();
        else this.printName();
    
        let op = curr.getOpponent();
    
        let sb = "";
    
        console.log("Your side  :                              | Your opponent's side".gray);
        /// Mana
        // Current Player's Mana
        sb += `Mana       : ${curr.mana.toString().cyan} / ${curr.maxMana.toString().cyan}`;
        sb += "                        | ";
        let to_remove = (curr.mana.toString().length + curr.maxMana.toString().length) - 2;
        if (to_remove > 0) sb = sb.replace(" ".repeat(to_remove) + "|", "|");

        // Opponent's Mana
        sb += `Mana       : ${op.mana.toString().cyan} / ${curr.maxMana.toString().cyan}`;
        // Mana End
        console.log(sb);
        sb = "";
        
        // Health
        sb += `Health     : ${curr.health.toString().red} (${curr.armor.toString().gray}) / ${curr.maxHealth.toString().red}`;

        sb += "                       | ";
        to_remove = (curr.health.toString().length + curr.armor.toString().length + curr.maxHealth.toString().length);
        if (to_remove > 0) sb = sb.replace(" ".repeat(to_remove) + "|", "|");
    
        // Opponent's Health
        sb += `Health     : ${op.health.toString().red} (${op.armor.toString().gray}) / ${op.maxHealth.toString().red}`;
        // Health End
        console.log(sb);
        sb = "";

        // Weapon
        if (curr.weapon) {
            // Current player has a weapon
            // Attack: 1 | Weapon: Wicked Knife (1 / 1)
            sb += `Weapon     : ${game.functions.colorByRarity(curr.weapon.displayName, curr.weapon.rarity)}`;

            let wpnStats = ` [${curr.weapon.stats.join(' / ')}]`;

            sb += (curr.attack > 0) ? wpnStats.brightGreen : wpnStats.gray;
        }
    
        if (op.weapon) {
            // Opponent has a weapon
            let len = sb.split(": ")[1];
            if (!curr.weapon) sb += "                                 "; // Show that this is the opponent's weapon, not yours
            
            sb += "         | "; 
            sb += `Weapon     : ${op.weapon.displayName.bold}`;
            let opWpnStats = ` [${op.weapon.stats.join(' / ')}]`;

            sb += (op.attack > 0) ? opWpnStats.brightGreen : opWpnStats.gray;
        }
    
        // Weapon End
        if (sb) console.log(sb);
        sb = "";
    
        // Deck
        sb += `Deck Size  : ${curr.deck.length.toString().yellow}`;

        sb += "                            | ";
        to_remove = (curr.deck.length.toString().length + curr.deck.length.toString().length) - 3;
        if (to_remove > 0) sb = sb.replace(" ".repeat(to_remove) + "|", "|");
    
        // Opponent's Deck
        sb += `Deck Size  : ${op.deck.length.toString().yellow}`;
        // Deck End
        console.log(sb);
        sb = "";

        // Secrets
        if (curr.secrets.length > 0) {
            sb += "Secrets: ";
            sb += curr.secrets.map(x => x["name"].bold).join(', '); // Get all your secret's names
        }
        // Secrets End
        if (sb) console.log(sb);
        sb = "";
    
        // Sidequests
        if (curr.sidequests.length > 0) {
            sb += "Sidequests: ";
            sb += curr.sidequests.map(sidequest => {
                sidequest["name"].bold +
                " (" + sidequest["progress"][0].toString().brightGreen +
                " / " + sidequest["progress"][1].toString().brightGreen +
                ")"
            }).join(', ');
        }
        // Sidequests End
        if (sb) console.log(sb);
        sb = "";
    
        // Quests
        if (curr.quests.length > 0) {
            const quest = curr.quests[0];
            const prog = quest["progress"];
    
            sb += `Quest(line): ${quest["name"].bold} `;
            sb += `[${prog[0]} / ${prog[1]}]`.brightGreen;
        }
        // Quests End
        if (sb) console.log(sb);
        sb = "";
    
        // Detailed Info
        if (detailed) {
            // Hand Size
            sb += `Hand Size  : ${curr.hand.length.toString().yellow}`;

            sb += "                             | ";
            to_remove = curr.hand.length.toString().length;
            if (to_remove > 0) sb = sb.replace(" ".repeat(to_remove) + "|", "|");

            // Opponents Hand Size
            sb += `Hand Size  : ${op.hand.length.toString().yellow}`;

            console.log(sb);
            sb = "";

            // Corpses
            sb += "Corpses    : ".gray;
            sb += curr.corpses.toString().yellow;
            
            sb += "                             | ";
            to_remove = curr.corpses.toString().length;
            if (to_remove > 0) sb = sb.replace(" ".repeat(to_remove) + "|", "|");

            // Opponents Corpses
            sb += "Corpses    : ".gray;
            sb += op.corpses.toString().yellow;

            sb += "\n-------------------------------\n";
    
            if (op.secrets.length > 0) {
                sb += `Opponent's Secrets: ${op.secrets.length.toString().yellow}\n`;
            }
    
            if (op.sidequests.length > 0) {
                sb += "Opponent's Sidequests: ";
                sb += op.sidequests.map(sidequest => {
                    sidequest["name"].bold +
                    " (" +
                    sidequest["progress"][0].toString().brightGreen +
                    " / " +
                    sidequest["progress"][1].toString().brightGreen +
                    ")"
                }).join(', ');
    
                sb += "\n";
            }
            
            if (op.quests.length > 0) {
                const quest = op.quests[0];
    
                sb += "Opponent's Quest(line): ";
                sb += quest["name"].bold;
                sb += " (";
                sb += quest["progress"][0].toString().brightGreen;
                sb += " / ";
                sb += quest["progress"][1].toString().brightGreen;
                sb += ")";
    
                sb += "\n";
            }
        }
        // Detailed Info End
        if (sb) console.log(sb);
        sb = "";
    
        // Board
        console.log("\n--- Board ---");
        
        game.board.forEach((_, i) => {
            const t = (i == curr.id) ? "--- You ---" : "--- Opponent ---";
    
            console.log(t) // This is not for debugging, do not comment out
    
            if (game.board[i].length == 0) {
                console.log("(None)".gray);
                return;
            }
    
            game.board[i].forEach((m, n) => {
                if (m.type == "Location") {            
                    sb += `[${n + 1}] `;
                    sb += `${m.displayName} `.bold;
                    sb += "{";
                    sb += "Durability: ".brightGreen;
                    sb += `${m.getHealth()}`.brightGreen;
                    sb += " / ".brightGreen;
                    sb += `${m.backups.stats[1]}`.brightGreen;
                    sb += ", ";
        
                    sb += "Cooldown: ".cyan;
                    sb += `${m.cooldown}`.cyan;
                    sb += " / ".cyan;
                    sb += `${m.backups.cooldown}`.cyan;
                    sb += "}";

                    sb += " [Location]".yellow;
        
                    console.log(sb);
                    sb = "";

                    return;
                }

                const excludedKeywords = ["Magnetic", "Corrupt", "Corrupted"];
                let keywords = m.keywords.filter(k => !excludedKeywords.includes(k));
                keywords = keywords.length > 0 ? ` {${keywords.join(", ")}}`.gray : "";

                let frozen = m.frozen ? " (Frozen)".gray : "";
                let dormant = m.dormant ? " (Dormant)".gray : "";
                let immune = m.immune ? " (Immune)".gray : "";
                let sleepy = (m.sleepy) || (m.attackTimes <= 0) ? " (Sleepy)".gray : "";
    
                sb += `[${n + 1}] `;
                sb += game.functions.colorByRarity(m.displayName, m.rarity);
                sb += ` [${m.stats.join(" / ")}]`.brightGreen;
    
                sb += keywords;
                sb += frozen
                sb += dormant;
                sb += immune
                sb += sleepy;
    
                console.log(sb);
                sb = "";
            });
        });
        console.log("-------------")
    
        let _class = curr.hero.name.includes("Starting Hero") ? curr.heroClass : curr.hero.name;
        if (detailed && curr.hero.name.includes("Starting Hero")) {
            _class += " | ";
            _class += "HP: ";
            _class += curr.hero.name;
        }
    
        // Hand
        console.log(`\n--- ${curr.name} (${_class})'s Hand ---`);
        console.log("([id] " + "{Cost}".cyan + " Name".bold + " [attack / health]".brightGreen + " (type)".yellow + ")\n");
    
        curr.hand.forEach((card, i) => {
            const desc = card.desc.length > 0 ? ` (${card.desc}) ` : " ";
    
            sb += `[${i + 1}] `;
            sb += `{${card.mana}} `.cyan;
            sb += game.functions.colorByRarity(card.displayName, card.rarity);
            
            if (card.type === "Minion" || card.type === "Weapon") {
                sb += ` [${card.stats.join(" / ")}]`.brightGreen;
            }
    
            sb += desc;
            sb += `(${card.type})`.yellow;

            console.log(sb);
            sb = ""
        });
        // Hand End
    
        console.log("------------");
    }
    viewMinion(minion) {
        /**
         * View information about a minion.
         * 
         * @param {Card} minion The minion to show information about
         */

        console.log(`{${minion.mana}} `.cyan + game.functions.colorByRarity(`${minion.displayName} `, minion.rarity) + `[${minion.blueprint.stats.join(' / ')}]\n`.brightGreen);
        if (minion.desc) console.log(minion.desc + "\n");
        console.log("Rarity: " + game.functions.colorByRarity(minion.rarity, minion.rarity));
        console.log("Tribe: " + minion.tribe.gray);
        console.log("Class: " + minion.class.gray);
        console.log("Set: " + minion.set.gray);
        console.log("Turn played: " + minion.turn.toString().yellow);
    
        game.input("\nPress enter to continue...\n");
    
        return;
    }
}

const cls = () => process.stdout.write('\033c');

exports.Interact = Interact;
