import rl from 'readline-sync';
import { type Target, type GamePlayCardReturn } from '@Game/types.js';
import { type Ai, Card, commands, debugCommands } from '../../internal.js';

const overrideConsole = {
    log(..._data: any[]): void {
        throw new Error('Attempting to use override console before being given the `log` function.');
    },
    warn(..._data: any[]): void {
        throw new Error('Attempting to use override console before being given the `warn` function.');
    },
    error(..._data: any[]): void {
        throw new Error('Attempting to use override console before being given the `error` function.');
    },
};
overrideConsole.log = console.log;
overrideConsole.warn = console.warn;
overrideConsole.error = console.error;

console.log = (...data) => {
    game.log(...data);
};

console.warn = (...data) => {
    game.logWarn(...data);
};

console.error = (...data) => {
    game.logError(...data);
};

export const gameloopInteract = { /**
     * Ask the user a question and returns their answer
     *
     * @param q The question to ask
     * @param overrideNoInput If this is true, it overrides `game.noInput`. Only use this when debugging.
     * @param useInputQueue If it should use the player's input queue
     *
     * @returns What the user answered
     */
    input(q = '', overrideNoInput = false, useInputQueue = true): string {
        const wrapper = (a: string) => {
            game.events.broadcast('Input', a, game.player);

            return a;
        };

        if (game.noOutput) {
            q = '';
        }

        if (game.noInput && !overrideNoInput) {
            return wrapper('');
        }

        q = game.functions.color.fromTags(q);

        // Let the game make choices for the user
        if (game.player.inputQueue && useInputQueue) {
            const queue = game.player.inputQueue;

            if (typeof queue === 'string') {
                return wrapper(queue);
            }

            // Invalid queue
            if (!Array.isArray(queue)) {
                return wrapper(rl.question(q));
            }

            const answer = queue[0];
            queue.splice(0, 1);

            if (queue.length <= 0) {
                game.player.inputQueue = undefined;
            }

            return wrapper(answer);
        }

        return wrapper(rl.question(q));
    },

    /**
     * Helper function for the `console.log` functions. Don't use.
     */
    logWrapper(callback: (...data: any) => void, ...data: any): void {
        if (game.noOutput) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        data = data.map((i: any) => typeof i === 'string' ? game.functions.color.fromTags(i) : i);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        callback(...data);
    },

    /**
     * Wrapper for console.log
     */
    log(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.logWrapper(overrideConsole.log, ...data);
    },

    /**
     * Wrapper for console.error
     */
    logError(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.logWrapper(overrideConsole.error, ...data);
    },

    /**
     * Wrapper for console.warn
     */
    logWarn(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.logWrapper(overrideConsole.warn, ...data);
    },

    /**
     * Asks the user to attack a minion or hero
     *
     * @returns Cancel | Success
     */
    // eslint-disable-next-line complexity
    doTurnAttack(): -1 | boolean | Card {
        let attacker;
        let target;

        if (game.player.ai) {
            const alternativeModel = `legacyAttack${game.config.ai.attackModel}`;

            // Run the correct ai attack model
            const model = game.player.ai[alternativeModel as keyof Ai];
            const aiSelections = model ? (model as () => Array<-1 | Target>)() : game.player.ai.attack();

            attacker = aiSelections[0];
            target = aiSelections[1];

            if (attacker === -1 || target === -1) {
                return -1;
            }

            if (attacker === null || target === null) {
                return false;
            }
        } else {
            attacker = game.interact.selectTarget('Which minion do you want to attack with?', undefined, 'friendly', 'any');
            if (!attacker) {
                return false;
            }

            target = game.interact.selectTarget('Which minion do you want to attack?', undefined, 'enemy', 'any');
            if (!target) {
                return false;
            }
        }

        const errorCode = game.attack(attacker, target);
        game.killMinions();

        const ignore = ['divineshield'];
        if (errorCode === true || ignore.includes(errorCode)) {
            return true;
        }

        let error;

        switch (errorCode) {
            case 'taunt': {
                error = 'There is a minion with taunt in the way';
                break;
            }

            case 'stealth': {
                error = 'That minion has stealth';
                break;
            }

            case 'frozen': {
                error = 'That minion is frozen';
                break;
            }

            case 'plrnoattack': {
                error = 'You don\'t have any attack';
                break;
            }

            case 'noattack': {
                error = 'That minion has no attack';
                break;
            }

            case 'plrhasattacked': {
                error = 'Your hero has already attacked this turn';
                break;
            }

            case 'hasattacked': {
                error = 'That minion has already attacked this turn';
                break;
            }

            case 'sleepy': {
                error = 'That minion is exhausted';
                break;
            }

            case 'cantattackhero': {
                error = 'That minion cannot attack heroes';
                break;
            }

            case 'immune': {
                error = 'That minion is immune';
                break;
            }

            case 'dormant': {
                error = 'That minion is dormant';
                break;
            }

            case 'titan': {
                error = 'That minion has titan abilities that hasn\'t been used';
                break;
            }

            default: {
                error = `An unknown error occurred. Error code: UnexpectedAttackingResult@${errorCode}`;
                break;
            }
        }

        console.log(`<red>${error}.</red>`);
        game.pause('');
        return false;
    },

    /**
     * Tries to run `cmd` as a command. If it fails, return -1
     *
     * @param cmd The command
     * @param flags Some flags to pass to the commands
     *
     * @returns A string if "echo" is false
     */
    handleCmds(cmd: string, flags?: { echo?: boolean; debug?: boolean }): boolean | string | -1 {
        const args = cmd.split(' ');
        const name = args.shift()?.toLowerCase();
        if (!name) {
            game.pause('<red>Invalid command.</red>\n');
            return false;
        }

        const getReturn = (result: any) => {
            if (typeof result === 'string' || result === -1) {
                return result as string | -1;
            }

            return true;
        };

        const commandName = Object.keys(commands).find(cmd => cmd.startsWith(name));
        if (commandName) {
            const command = commands[commandName];
            const result = command(args, flags);
            return getReturn(result);
        }

        if (!name.startsWith(game.config.advanced.debugCommandPrefix)) {
            return -1;
        }

        const debugName = name.slice(1);

        const debugCommandName = Object.keys(debugCommands).find(cmd => cmd.startsWith(debugName));
        if (debugCommandName) {
            if (!game.config.general.debug) {
                game.pause('<red>You are not allowed to use this command.</red>\n');
                return false;
            }

            const command = debugCommands[debugCommandName];
            const result = command(args, flags);
            return getReturn(result);
        }

        return -1;
    },

    /**
     * Tries to handle `input` as a command. If it fails, try to play the card with the index of `input`.
     *
     * @param input The user input
     *
     * @returns The return value of `game.playCard`
     */
    doTurnLogic(input: string): GamePlayCardReturn {
        if (this.handleCmds(input) !== -1) {
            return true;
        }

        const parsedInput = game.lodash.parseInt(input);

        const card = game.player.hand[parsedInput - 1];
        if (!card) {
            return 'invalid';
        }

        if (parsedInput === game.player.hand.length || parsedInput === 1) {
            card.activate('outcast');
        }

        return game.playCard(card, game.player);
    },

    /**
     * Show the game state and asks the user for an input which is put into `doTurnLogic`.
     *
     * This is the core of the game loop.
     *
     * @returns Success | Ignored error code | The return value of doTurnLogic
     */
    doTurn(): boolean | string | GamePlayCardReturn {
        game.events.tick('GameLoop', 'doTurn', game.player);

        if (game.player.ai) {
            const rawInput = game.player.ai.calcMove();
            if (!rawInput) {
                return false;
            }

            const input = rawInput instanceof Card ? (game.player.hand.indexOf(rawInput) + 1).toString() : rawInput;

            game.events.broadcast('Input', input, game.player);
            const turn = this.doTurnLogic(input);

            game.killMinions();

            return turn;
        }

        game.interact.info.showGame(game.player);
        console.log();

        let input = 'Which card do you want to play? ';
        if (game.turns <= 2 && !game.config.general.debug) {
            input += '(type \'help\' for further information <- This will disappear once you end your turn) ';
        }

        const user = game.input(input);
        const returnValue = this.doTurnLogic(user);
        game.killMinions();

        // If there were no errors, return true.
        if (returnValue === true) {
            return returnValue;
        }

        let error;

        // Get the card
        const card = game.player.hand[game.lodash.parseInt(user) - 1];
        let cost = 'mana';
        if (card) {
            cost = card.costType;
        }

        // Error Codes
        switch (returnValue) {
            case 'cost': {
                error = `Not enough ${cost}`;
                break;
            }

            case 'counter': {
                error = 'Your card has been countered';
                break;
            }

            case 'space': {
                error = `You can only have ${game.config.general.maxBoardSpace} minions on the board`;
                break;
            }

            case 'invalid': {
                error = 'Invalid card';
                break;
            }

            // Ignore these error codes
            case 'refund':
            case 'magnetize':
            case 'traded':
            case 'forged':
            case 'colossal': {
                return returnValue;
            }

            default: {
                error = `An unknown error occurred. Error code: UnexpectedDoTurnResult@${returnValue as string}`;
                break;
            }
        }

        game.pause(`<red>${error}.</red>\n`);

        return false;
    },
};
