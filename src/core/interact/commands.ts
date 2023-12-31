import { type CommandList, type Todo } from '@Game/types.js';
import { Card, Player } from '../../internal.js';

const getGame = () => game;

export const commands: CommandList = {
    end(): boolean {
        game.endTurn();
        return true;
    },

    'hero power'(): boolean {
        if (game.player.ai) {
            game.player.heroPower();
            return true;
        }

        if (game.player.mana < game.player.hero.heroPower!.cost) {
            game.pause('<red>You do not have enough mana.</red>\n');
            return false;
        }

        if (!game.player.canUseHeroPower) {
            game.pause('<red>You have already used your hero power this turn.</red>\n');
            return false;
        }

        game.interact.info.showGame(game.player);
        const ask = game.interact.yesNoQuestion(`<yellow>${game.player.hero.heroPower!.text}</yellow> Are you sure you want to use this hero power?`, game.player);
        if (!ask) {
            return false;
        }

        game.interact.info.showGame(game.player);
        game.player.heroPower();
        return true;
    },

    attack(): boolean {
        game.interact.gameLoop.doTurnAttack();
        game.killMinions();
        return true;
    },

    use(): boolean {
        // Use location
        const errorCode = game.interact.card.useLocation();
        game.killMinions();

        if (errorCode === true || errorCode === 'refund' || game.player.ai) {
            return true;
        }

        let error;

        switch (errorCode) {
            case 'nolocations': {
                error = 'You have no location cards';
                break;
            }

            case 'invalidtype': {
                error = 'That card is not a location card';
                break;
            }

            case 'cooldown': {
                error = 'That location is on cooldown';
                break;
            }

            default: {
                error = `An unknown error occourred. Error code: UnexpectedUseLocationResult@${errorCode}`;
                break;
            }
        }

        console.log(`<red>${error}.</red>`);
        game.pause();
        return true;
    },

    titan(): boolean {
        // Use titan card
        const card = game.interact.selectCardTarget('Which card do you want to use?', undefined, 'friendly');
        if (!card) {
            return false;
        }

        if (card.sleepy) {
            game.pause('<red>That card is exhausted.</red>\n');
            return false;
        }

        const titanIds = card.getKeyword('Titan') as number[] | undefined;

        if (!titanIds) {
            game.pause('<red>That card is not a titan.</red>\n');
            return false;
        }

        const titanCards = titanIds.map(id => new Card(id, game.player));

        game.interact.info.showGame(game.player);
        console.log(`\nWhich ability do you want to trigger?\n${titanCards.map(c => game.interact.card.getReadable(c)).join(',\n')}`);

        const choice = game.lodash.parseInt(game.input());

        if (!choice || choice < 1 || choice > titanCards.length || Number.isNaN(choice)) {
            game.pause('<red>Invalid choice.</red>\n');
            return false;
        }

        const ability = titanCards[choice - 1];

        if (ability.activate('cast') === -1) {
            game.functions.util.remove(ability.plr.hand, ability);
            return false;
        }

        titanIds.splice(choice - 1, 1);

        card.setKeyword('Titan', titanIds);

        if (titanIds.length <= 0) {
            card.remKeyword('Titan');
        } else {
            card.sleepy = true;
        }

        game.events.broadcast('Titan', [card, ability], game.player);

        return true;
    },

    help(): boolean {
        game.interact.info.watermark();
        console.log('\n(In order to run a command; input the name of the command and follow further instruction.)\n');
        console.log('Available commands:');

        const bricks = [
            '(name) - (description)\n',

            'end - Ends your turn',
            'attack - Attack',
            'hero power - Use your hero power',
            'history - Displays a history of actions',
            'concede - Forfeits the game',
            'view - View a minion',
            'use - Use a location card',
            'titan - Use a titan card',
            'detail - Get more details about opponent',
            'help - Displays this message',
            'version - Displays the version, branch, your settings preset, and some information about your current version.',
            'license - Opens a link to this project\'s license',
        ];

        const debugBricks = [
            'give (name) - Adds a card to your hand',
            'eval [log] (code) - Runs the code specified. If the word \'log\' is before the code, instead console.log the code and wait for user input to continue. Examples: `/eval game.endGame(game.player)` (Win the game) `/eval @Player1.addToHand(@fe48ac1.perfectCopy())` (Adds a perfect copy of the card with uuid "fe48ac1" to player 1\'s hand) `/eval log h#c#1.attack + d#o#26.health + b#c#1.attack` (Logs the card in the current player\'s hand with index 1\'s attack value + the 26th card in the opponent\'s deck\'s health value + the card on the current player\'s side of the board with index 1\'s attack value)',
            'exit - Force exits the game. There will be no winner, and it will take you straight back to the hub.',
            'history - Displays a history of actions. This doesn\'t hide any information, and is the same thing the log files uses.',
            'undo - Undoes the last card played. It gives the card back to your hand, and removes it from where it was. (This does not undo the actions of the card)',
            'ai - Gives you a list of the actions the ai(s) have taken in the order they took it',
        ];

        const wall = game.functions.util.createWall(bricks, '-');
        const debugWall = game.functions.util.createWall(debugBricks, '-');

        // Normal commands
        for (const brick of wall) {
            console.log(brick);
        }

        const condColor = (text: string) => (game.config.general.debug) ? text : `<gray>${text}</gray>`;
        const debugEnabled = (game.config.general.debug) ? '<bright:green>ON</bright:green>' : '<red>OFF</red>';

        console.log(condColor(`\n--- Debug Commands (${debugEnabled}) ---`));

        // Debug Commands
        for (const brick of debugWall) {
            console.log(condColor(game.config.advanced.debugCommandPrefix + brick));
        }

        console.log(condColor('---------------------------' + ((game.config.general.debug) ? '' : '-')));

        game.pause('\nPress enter to continue...\n');
        return true;
    },

    view(): boolean {
        const isHandAnswer = game.interact.question(game.player, 'Do you want to view a minion on the board, or in your hand?', ['Board', 'Hand']);
        const isHand = isHandAnswer === 'Hand';

        if (!isHand) {
            // AllowLocations Makes selecting location cards allowed. This is disabled by default to prevent, for example, spells from killing the card.
            const card = game.interact.selectCardTarget('Which minion do you want to view?', undefined, 'any', ['allowLocations']);
            if (!card) {
                return false;
            }

            game.interact.card.view(card);

            return true;
        }

        // View minion on the board
        const cardIndex = game.input('\nWhich card do you want to view? ');
        if (!cardIndex || !game.lodash.parseInt(cardIndex)) {
            return false;
        }

        const card = game.player.hand[game.lodash.parseInt(cardIndex) - 1];

        game.interact.card.view(card);
        return true;
    },

    detail(): boolean {
        game.player.detailedView = !game.player.detailedView;
        return true;
    },

    concede(): boolean {
        game.interact.info.showGame(game.player);
        const confirmation = game.interact.yesNoQuestion('Are you sure you want to concede?', game.player);
        if (!confirmation) {
            return false;
        }

        game.endGame(game.player.getOpponent());
        return true;
    },

    license(): boolean {
        game.functions.util.openInBrowser(game.config.info.githubUrl + '/blob/main/LICENSE');
        return true;
    },

    version(): boolean {
        const { version, branch, build } = game.config.info;

        let running = true;
        while (running) {
            const todos = Object.entries(game.config.todo);

            const printInfo = () => {
                const game = getGame();
                game.interact.info.showGame(game.player);

                let strbuilder = `\nYou are on version: ${version}, on `;

                switch (branch) {
                    case 'topic': {
                        strbuilder += 'a topic branch';

                        break;
                    }

                    case 'alpha': {
                        strbuilder += 'the alpha branch';

                        break;
                    }

                    case 'beta': {
                        strbuilder += 'the beta branch';

                        break;
                    }

                    case 'stable': {
                        strbuilder += 'the stable (release) branch';

                        break;
                    }

                    // No default
                }

                strbuilder += `, on build ${build}`;
                strbuilder += `, with latest commit hash '${game.functions.info.latestCommit()}',`;

                if (game.config.general.debug && game.config.ai.player2) {
                    strbuilder += ' using the debug settings preset';
                } else if (!game.config.general.debug && !game.config.ai.player2) {
                    strbuilder += ' using the recommended settings preset';
                } else {
                    strbuilder += ' using custom settings';
                }

                console.log(strbuilder + '.\n');

                console.log('Version Description:');

                let introText;

                switch (branch) {
                    case 'topic': {
                        introText = game.config.info.topicIntroText;

                        break;
                    }

                    case 'alpha': {
                        introText = game.config.info.alphaIntroText;

                        break;
                    }

                    case 'beta': {
                        introText = game.config.info.betaIntroText;

                        break;
                    }

                    case 'stable': {
                        introText = game.config.info.stableIntroText;

                        break;
                    }

                    // No default
                }

                console.log(introText);
                if (game.config.info.versionText) {
                    console.log(game.config.info.versionText);
                }

                console.log();

                console.log('Todo List:');
                if (todos.length <= 0) {
                    console.log('None.');
                }
            };

            printInfo();

            // This is the todo list
            if (todos.length <= 0) {
                game.pause('\nPress enter to continue...');
                running = false;
                break;
            }

            const printTodo = (todo: [string, Todo], id: number, printDesc = false) => {
                let [name, info] = todo;

                name = name.replaceAll('_', ' ');
                let state: string;

                switch (info.state) {
                    case 'done': {
                        state = 'x';

                        break;
                    }

                    case 'doing': {
                        state = 'o';

                        break;
                    }

                    case 'not done': {
                        state = ' ';

                        break;
                    }

                    case 'first pass':
                    case 'second pass':
                    case 'third pass': {
                        state = info.state;

                        break;
                    }

                    // No default
                }

                if (printDesc) {
                    console.log(`{${id}} [${state}] ${name}\n${info.description}`);
                } else {
                    console.log(`{${id}} [${state}] ${name}`);
                }
            };

            for (const [index, todo] of todos.entries()) {
                printTodo(todo, index + 1);
            }

            const todoIndex = game.lodash.parseInt(game.input('\nType the id of a todo to see more information about it (eg. 1): '));
            if (!todoIndex || todoIndex > todos.length || todoIndex <= 0) {
                running = false;
                break;
            }

            const todo = todos[todoIndex - 1];

            printInfo();
            printTodo(todo, todoIndex, true);

            const command = game.input('\nType "issue" to open the todo in your webbrowser.\n');
            if (command === 'issue') {
                const link = game.config.info.githubUrl + `/issues/${todo[1].issue}`;
                game.functions.util.openInBrowser(link);
            }
        }

        return true;
    },

    history(_, flags): string {
        // History
        const { history } = game.events;
        let finished = '';

        const showCard = (value: Card) => `${game.interact.card.getReadable(value)} which belongs to: <blue>${value.plr.name}</blue>, and has uuid: ${value.coloredUUID()}`;

        /**
        * Transform the `value` into a readable string
        *
        * @param hide If it should hide the card
        */
        const doValue = (value: any, plr: Player, hide: boolean): any => {
            if (value instanceof Player) {
                return `Player ${value.id + 1}`;
            }

            if (!(value instanceof Card)) {
                // Return value as-is if it is not a card / player
                return value;
            }

            // If the card is not hidden, or the card belongs to the current player, show it
            if (!hide || value.plr === plr) {
                return showCard(value);
            }

            // Hide the card
            let revealed = false;

            // It has has been revealed, show it.
            for (const historyValue of Object.values(history)) {
                if (revealed) {
                    continue;
                }

                for (const historyKey of historyValue) {
                    if (revealed) {
                        continue;
                    }

                    const [key, newValue] = historyKey;

                    // This shouldn't happen?
                    if (!newValue) {
                        continue;
                    }

                    if (game.config.advanced.whitelistedHistoryKeys.includes(key)) {
                        // Do nothing
                    } else {
                        continue;
                    }

                    if (game.config.advanced.hideValueHistoryKeys.includes(key)) {
                        continue;
                    }

                    // If it is not a card
                    if (!(newValue instanceof Card)) {
                        continue;
                    }

                    if (value.uuid !== newValue.uuid) {
                        continue;
                    }

                    // The card has been revealed.
                    revealed = true;
                }
            }

            if (revealed) {
                return 'Hidden > Revealed as: ' + showCard(value);
            }

            return 'Hidden';
        };

        for (const [historyListIndex, historyList] of Object.values(history).entries()) {
            let hasPrintedHeader = false;
            let previousPlayer: Player | undefined;

            for (const [historyIndex, historyKey] of historyList.entries()) {
                let [key, value, player] = historyKey;
                if (!player) {
                    // TODO: Maybe throw an error
                    continue;
                }

                if (player !== previousPlayer) {
                    hasPrintedHeader = false;
                }

                previousPlayer = player;

                if (game.config.advanced.whitelistedHistoryKeys.includes(key) || flags?.debug) {
                    // Pass
                } else {
                    continue;
                }

                // If the `key` is "AddCardToHand", check if the previous history entry was `DrawCard`, and they both contained the exact same `val`.
                // If so, ignore it.
                if (key === 'AddCardToHand' && historyIndex > 0) {
                    const lastEntry = history[historyListIndex][historyIndex - 1];

                    if (lastEntry[0] === 'DrawCard' && (lastEntry[1] as Card).uuid === (value as Card).uuid) {
                        continue;
                    }
                }

                const shouldHide = game.config.advanced.hideValueHistoryKeys.includes(key) && !flags?.debug;

                if (!hasPrintedHeader) {
                    finished += `\nTurn ${historyListIndex} - Player [${player.name}]\n`;
                }

                hasPrintedHeader = true;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value = doValue(value, game.player, shouldHide);

                if (Array.isArray(value)) {
                    let strbuilder = '';

                    for (let v of value) {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        v = doValue(v, game.player, shouldHide);
                        strbuilder += `${v?.toString()}, `;
                    }

                    strbuilder = strbuilder.slice(0, -2);
                    value = strbuilder;
                }

                const finishedKey = key[0].toUpperCase() + key.slice(1);

                finished += `${finishedKey}: ${value?.toString()}\n`;
            }
        }

        if (flags?.echo === false) {
            // Do nothing
        } else {
            console.log(finished);

            game.pause('\nPress enter to continue...');
        }

        return finished;
    },
};

export const debugCommands: CommandList = {
    give(args): boolean {
        if (args.length <= 0) {
            game.pause('<red>Too few arguments.</red>\n');
            return false;
        }

        const cardName = args.join(' ');

        // TODO: Get all cards from the name and ask the user which one they want
        const card = game.functions.card.getFromName(cardName, game.player);
        if (!card) {
            game.pause(`<red>Invalid card: <yellow>${cardName}</yellow>.\n`);
            return false;
        }

        game.player.addToHand(card);
        return true;
    },

    exit(): boolean {
        game.running = false;
        game.functions.util.createLogFile();
        return true;
    },

    eval(args): boolean {
        if (args.length <= 0) {
            game.pause('<red>Too few arguments.</red>\n');
            return false;
        }

        let log = false;

        if (args[0] === 'log') {
            log = true;
            args.shift();
        }

        let code = args.join(' ');

        // Allow for stuff like `/eval @Player1.addToHand(@00ff00.perfectCopy());`
        code = code.replaceAll('@Player', 'game.player');

        /**
         * Looks for a specific UUID in an array of cards and replaces it with a string representation of the index of the card in the array.
         *
         * @param uuid The UUID to look for.
         * @param where The array of cards to search in.
         * @param stringOfWhere The string representation of the array of cards.
         * @return This function does not return a value.
         */
        function lookForUUID(uuid: string, where: Card[], stringOfWhere: string): void {
            const card = where.find(card => card.uuid.startsWith(uuid));
            if (!card) {
                return;
            }

            code = code.replace(`@${uuid}`, `${stringOfWhere}[${where.indexOf(card)}]`);
        }

        const uuidRegex = /@\w+/g;
        for (const match of code.matchAll(uuidRegex)) {
            const uuid = match[0].slice(1);

            for (const player of [game.player1, game.player2]) {
                const gamePlayer = `game.player${player.id + 1}`;

                lookForUUID(uuid, player.deck, `${gamePlayer}.deck`);
                lookForUUID(uuid, player.hand, `${gamePlayer}.hand`);
                lookForUUID(uuid, game.board[player.id], `game.board[${player.id}]`);
                lookForUUID(uuid, game.board[player.id], `game.graveyard[${player.id}]`);
            }
        }

        // Allow for stuff like `/eval h#c#1.addAttack(b#o#2.attack)`;
        // ^^ This adds the second card on the opponent's side of the board's attack to the card at index 1 in the current player's hand
        const indexBasedRegex = /([hbd])#([co])#(\d+)/g;
        for (const match of code.matchAll(indexBasedRegex)) {
            let [line, where, side, index] = match;

            switch (where) {
                case 'h': {
                    where = 'game.player[x].hand';
                    break;
                }

                case 'd': {
                    where = 'game.player[x].deck';
                    break;
                }

                case 'b': {
                    where = 'game.board[[x] - 1]';
                    break;
                }

                // No default
            }

            side = side === 'c' ? (game.player.id + 1).toString() : (game.opponent.id + 1).toString();
            where = where.replaceAll('[x]', side);

            code = code.replace(line, `${where}[${index} - 1]`);
        }

        if (log) {
            if (code.at(-1) === ';') {
                code = code.slice(0, -1);
            }

            code = `console.log(${code});game.pause();`;
        }

        try {
            // eslint-disable-next-line no-eval
            eval(code);

            game.events.broadcast('Eval', code, game.player);
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new TypeError('`error` is not an instance of Error');
            }

            console.log('\n<red>An error happened while running this code! Here is the error:</red>');

            // The stack includes "<anonymous>", which would be parsed as a tag, which would cause another error
            game.functions.color.parseTags = false;
            console.log(error.stack);
            game.functions.color.parseTags = true;

            game.pause();
        }

        return true;
    },

    undo(): boolean {
        // Get the last played card
        if (!game.events.events.PlayCard || game.events.events.PlayCard[game.player.id].length <= 0) {
            game.pause('<red>No cards to undo.</red>\n');
            return false;
        }

        const eventCards: Array<[Card, number]> = game.events.events.PlayCard[game.player.id];
        if (eventCards.length <= 0) {
            game.pause('<red>No cards to undo.</red>\n');
            return false;
        }

        let card = game.lodash.last(eventCards)?.[0];
        if (!card) {
            game.pause('<red>No cards found.</red>\n');
            return false;
        }

        // Remove the event so you can undo more than the last played card
        game.events.events.PlayCard[game.player.id].pop();

        // If the card can appear on the board, remove it.
        if (card.canBeOnBoard()) {
            game.functions.util.remove(game.board[game.player.id], card);

            // If the card has 0 or less health, restore it to its original health (according to the blueprint)
            if (card.type === 'Minion' && card.health && card.health <= 0) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                card.health = card.storage.init.health;
            } else if (card.type === 'Location' && card.durability! <= 0) {
                if (!card.durability) {
                    throw new Error('Location has undefined durability!');
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                card.durability = card.storage.init.durability;
            }
        }

        card = card.perfectCopy();

        // If the card is a weapon, destroy it before adding it to the player's hand.
        if (card.type === 'Weapon') {
            game.player.destroyWeapon();
        }

        // If the card is a hero, reset the player's hero to the default one from their class.
        if (card.type === 'Hero') {
            game.player.setToStartingHero();
        }

        game.player.addToHand(card);
        game.player.refreshMana(card.cost);
        return true;
    },

    ai(_, flags): string {
        let finished = '';

        if (flags?.echo) {
            finished += 'AI Info:\n\n';
        }

        for (let i = 0; i < 2; i++) {
            const player = game.functions.util.getPlayerFromId(i);
            if (!player.ai) {
                continue;
            }

            finished += `AI${i + 1} History: {\n`;

            for (const [objectIndex, object] of player.ai.history.entries()) {
                finished += `${objectIndex + 1} ${object.type}: (${object.data}),\n`;
            }

            finished += '}\n';
        }

        if (flags?.echo === false) {
            // Do nothing
        } else {
            console.log(finished);

            game.pause('\nPress enter to continue...');
        }

        return finished;
    },

    history(): string {
        return game.interact.gameLoop.handleCmds('history', { debug: true }) as string;
    },
};
