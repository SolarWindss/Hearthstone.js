// It only confines these functions to the Hearthstone.js directory. Look in the fs wrapper functions in this file to confirm.
import fs from 'node:fs';
import { dirname as pathDirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import childProcess from 'node:child_process';
import process from 'node:process';
import { createHash } from 'node:crypto';
import date from 'date-and-time';
import { type Player } from '@Game/internal.js';
import { type Target } from '@Game/types.js';

export const utilFunctions = {
    /**
     * Removes `element` from `list`.
     *
     * @param list The list to remove from
     * @param element The element to remove from the list
     *
     * @returns Success
     */
    remove<T>(list: T[], element: T): boolean {
        if (!list.includes(element)) {
            return false;
        }

        list.splice(list.indexOf(element), 1);
        return true;
    },

    /**
     * Creates a wall.
     *
     * Walls are a formatting tool for strings, which makes them easier to read.
     * Look at the example below.
     *
     * @param bricks The array
     * @param sep The seperator.
     *
     * @example
     * const bricks = [];
     * bricks.push('Example - Example');
     * bricks.push('Test - Hello World');
     * bricks.push('This is the longest - Short');
     * bricks.push('Tiny - This is even longer then that one!');
     *
     * const wall = createWall(bricks, "-");
     *
     * for (const brick of wall) {
     *     console.log(brick);
     * }
     * // Example             - Example
     * // Test                - Hello World
     * // This is the longest - Short
     * // Tiny                - This is even longer then that one!
     *
     * assert.equal(wall, ["Example             - Example", "Test                - Hello World", "This is the longest - Short", "Tiny                - This is even longer then that one!"]);
     *
     * @returns The wall
     */
    createWall(bricks: string[], sep: string): string[] {
        // Find the longest brick, most characters to the left of the seperator.

        /**
         * The longest brick
         */
        let longestBrick: [string, number] = ['', Number.NEGATIVE_INFINITY];

        for (const brick of bricks) {
            const splitBrick = brick.split(sep);

            const { length } = game.functions.color.stripAll(splitBrick[0]);

            if (length <= longestBrick[1]) {
                continue;
            }

            longestBrick = [brick, length];
        }

        /**
         * The wall to return.
         */
        const wall: string[] = [];

        for (const brick of bricks) {
            const splitBrick = brick.split(sep);

            let strbuilder = '';
            const difference = longestBrick[1] - game.functions.color.stripAll(splitBrick[0]).length;

            strbuilder += splitBrick[0];
            strbuilder += ' '.repeat(difference);
            strbuilder += sep;
            strbuilder += game.lodash.tail(splitBrick).join(sep);

            wall.push(strbuilder);
        }

        return wall;
    },

    /**
     * Create a (crash)log file
     *
     * @param err If this is set, create a crash log. If this is not set, create a normal log file.
     *
     * @returns Success
     */
    createLogFile(error?: Error): boolean {
        // Create a (crash-)log file
        if (!this.fs('exists', '/logs')) {
            this.fs('mkdir', '/logs');
        }

        const now = new Date();
        const dateString = date.format(now, 'DD/MM/YYYY HH:mm:ss');

        // 01.01.23-23.59.59
        const dateStringFileFriendly = date.format(now, 'DD.MM.YY-HH.mm.ss');

        // Grab the history of the game
        // handleCmds("history", echo, debug)
        let history = game.interact.gameLoop.handleCmds('history', { echo: false, debug: true });
        if (typeof history !== 'string') {
            throw new TypeError('createLogFile history did not return a string.');
        }

        // Strip the color codes from the history
        history = game.functions.color.stripTags(history);
        history = game.functions.color.stripColors(history);

        // AI log
        // Do this so it can actually run '/ai'
        game.config.general.debug = true;
        const aiHistory = game.interact.gameLoop.handleCmds('/ai', { echo: false });

        let name = 'Log';
        if (error) {
            name = 'Crash Log';
        }

        let errorContent = '';

        if (error) {
            errorContent = `
Error:
${error.stack}
`;
        }

        const historyContent = `-- History --${history}-- History --\n`;
        const aiContent = `\n-- AI Logs --\n${aiHistory}-- AI Logs --\n`;

        const config = JSON.stringify(game.config, null, 2);
        const configContent = `\n-- Config --\n${config}\n-- Config --`;

        let mainContent = historyContent;
        if (game.config.ai.player1 || game.config.ai.player2) {
            mainContent += aiContent;
        }

        mainContent += configContent;
        mainContent += errorContent;

        let osName: string = process.platform;

        if (osName === 'linux') {
            // Get the operating system name from /etc/os-release
            const osRelease = this.runCommand('cat /etc/os-release');
            if (osRelease instanceof Error) {
                throw osRelease;
            }

            osName = osRelease.split('PRETTY_NAME="')[1].split('"\n')[0];

            // Also add information from uname
            const uname = this.runCommand('uname -srvmo');
            if (uname instanceof Error) {
                throw uname;
            }

            osName += ' (' + uname.trim() + ')';
        } else if (osName === 'win32') {
            osName = 'Windows';
        }

        let content = `Hearthstone.js ${name}
Date: ${dateString}
Version: ${game.functions.info.version(4)}
Operating System: ${osName}
Log File Version: 3

${mainContent}
`;

        let filename = 'log';
        if (error) {
            filename = 'crashlog';
        }

        filename = `${filename}-${dateStringFileFriendly}.txt`;

        // Add a sha256 checksum to the content
        const checksum = createHash('sha256').update(content).digest('hex');
        content += `\n${checksum}  ${filename}`;

        this.fs('write', `/logs/${filename}`, content);

        if (!error) {
            return true;
        }

        console.log(`\n<red>The game crashed!\nCrash report created in 'logs/${filename}'\nPlease create a bug report at:\n${game.config.info.githubUrl}/issues</red>`);
        game.pause();

        return true;
    },

    /**
     * Parses the contents of a log file.
     *
     * @param path The path to the log file.
     *
     * @returns An object containing the parsed log data.
     */
    parseLogFile(path: string) {
        if (!this.fs('exists', path)) {
            throw new Error('File does not exist');
        }

        let content = (this.fs('read', path) as string).trim();
        const contentSplit = content.split('\n');
        const fileName = path.split('/').pop();

        // Verify checksum
        content = game.lodash.initial(contentSplit).join('\n');
        const checksum = createHash('sha256').update(content).digest('hex') + '  ' + fileName;

        const matchingChecksum = checksum === game.lodash.last(contentSplit);
        if (!matchingChecksum) {
            throw new Error('Invalid checksum');
        }

        // Checksum matches
        const [watermark, date, version, os, logVersion] = contentSplit.map(l => l.split(': ')[1]);
        const history = content.split('-- History --')[1].trim();
        const ai = content.split('-- AI Logs --')[1].trim();
        const config = content.split('-- Config --')[1].trim();

        const headerObject = { watermark, date, version: game.lodash.parseInt(version), os, logVersion: game.lodash.parseInt(logVersion) };

        return { header: headerObject, history, ai, config };
    },

    /**
     * Runs a command and returns the result.
     *
     * This function is slow, so think about saving the output of this to `game.cache` if you intend to run this multiple times.
     */
    runCommand(cmd: string): string | Error {
        try {
            return childProcess.execSync(cmd).toString();
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new TypeError('`error` is not an error in runCommand');
            }

            return error;
        }
    },

    /**
     * Tries to compile the project
     *
     * @returns If the compilation was successful
     */
    tryCompile(): boolean {
        try {
            const error = this.runCommand('npx tsc');
            if (error instanceof Error) {
                throw error;
            }

            return true;
        } catch (error) {
            if (!(error instanceof Error)) {
                throw new TypeError('`error` is not an error in tryCompile');
            }

            // Status 2 means compiler error
            if ((error as any).status === 2) {
                return false;
            }

            throw error;
        }
    },

    /**
     * Creates a child process and runs a command in it.
     *
     * @param command The command/program to run
     *
     * @returns Success
     *
     * @example
     * // Opens notepad to "foo.txt" in the main folder.
     * const success = runCommandAsChildProcess("notepad foo.txt");
     *
     * // Wait until the user presses enter. This function automatically prints a traceback to the screen but will not pause by itself.
     * if (!success) game.pause();
     */
    runCommandAsChildProcess(command: string): boolean {
        // Windows vs Linux. Pros and Cons:
        if (process.platform === 'win32') {
            // Windows
            this.runCommand(`start ${command}`);
        } else {
            // Linux (/ Mac)
            command = command.replaceAll('\\', '/');

            const attempts: string[] = [];

            const isCommandAvailable = (testCommand: string, argsSpecifier: string) => {
                console.log(`Trying '${testCommand} ${argsSpecifier}${command}'...`);
                attempts.push(testCommand);

                const error = this.runCommand(`which ${testCommand} 2> /dev/null`);
                if (error instanceof Error) {
                    return false;
                }

                childProcess.exec(`${testCommand} ${argsSpecifier}${command}`);

                console.log('Success!');

                return true;
            };

            if (isCommandAvailable('x-terminal-emulator', '-e ')) {
                // Success
            } else if (isCommandAvailable('gnome-terminal', '-- ')) {
                // Success
            } else if (isCommandAvailable('xterm', '-e ')) {
                // Success
            } else if (isCommandAvailable('konsole', '-e ')) {
                // Sucess
            } else if (isCommandAvailable('xfce4-terminal', '--command=')) {
                // Sucess
            } else {
                console.log('Error: Failed to open program. Traceback:');
                console.log('Operating system: Linux');

                for (const attempt of attempts) {
                    console.log(`Tried '${attempt}'... failed!`);
                }

                console.log('Please install any of these using your package manager.');
                console.log('If you\'re not using linux, open up an issue on the github page.');
                // Game.pause(); <- It is your job to pause the program when you run this, since function.ts functions should generally not pause the game.

                return false;
            }
        }

        return true;
    },

    /**
     * Open the provided link in the users browser.
     *
     * This uses the "open" command in Mac, the "start" command in Windows, and the "xdg-open" command in Linux
     */
    openInBrowser(link: string) {
        const start = (process.platform === 'darwin' ? 'open' : (process.platform === 'win32' ? 'start' : 'xdg-open'));
        game.functions.util.runCommand(start + ' ' + link);
    },

    /**
     * Returns a more traditional turn counter format.
     *
     * `game.turns` increments at the end of every player's turn.
     * This only increments at the end of the second player's turn.
     */
    getTraditionalTurnCounter(): number {
        return Math.ceil(game.turns / 2);
    },

    /**
     * Retrieves the player corresponding to the given id.
     * 0 is Player 1.
     * 1 is Player 2.
     *
     * @param id The id of the player - 1.
     *
     * @returns The player
     */
    getPlayerFromId(id: number): Player {
        if (id === 0) {
            return game.player1;
        }

        return game.player2;
    },

    /**
     * Executes a file system operation based on the provided callback.
     *
     * @param callback The name of the fs operation to execute.
     * @param path The path of the file or directory.
     * @param args Additional arguments for the fs operation.
     *
     * @returns The result of the fs operation.
     */
    fs(callback: keyof typeof fs, path: string, ...args: any[]): unknown {
        path = this.restrictPath(path);
        if (callback.endsWith('Sync')) {
            callback = callback.replace('Sync', '') as keyof typeof fs;
        }

        if (callback === 'write') {
            callback = 'writeFile';
        }

        if (callback === 'read') {
            callback = 'readFile';
        }

        const callbackFunction = fs[callback + 'Sync' as keyof typeof fs];
        if (typeof callbackFunction !== 'function') {
            throw new TypeError(`Invalid fs function: ${callback}Sync`);
        }

        // Cache files when they are read
        if (callback === 'readFile') {
            if (!game.cache.files) {
                game.cache.files = {};
            }

            const cached = game.cache.files[path] as string | undefined;

            if (args[0]?.invalidateCache && cached) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete game.cache.files[path];
            } else if (cached) {
                return cached;
            }

            const content = fs.readFileSync(path, { encoding: 'utf8' });
            game.cache.files[path] = content;
            return content;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return (callbackFunction as (path: string, ...args: any[]) => any)(path, ...args);
    },

    /**
     * Calls `callback` on all cards in the cards folder.
     *
     * @param path By default, this is the cards folder (not in dist)
     * @param extension The extension to look for in cards. By default, this is ".ts"
     */
    searchCardsFolder(callback: (path: string, content: string, file: fs.Dirent) => void, path = '/cards', extension = '.ts'): void {
        path = path.replaceAll('\\', '/');

        for (const file of this.fs('readdir', path, { withFileTypes: true }) as fs.Dirent[]) {
            const fullPath = `${path}/${file.name}`;

            if (file.name === 'exports.ts') {
                continue;
            }

            if (file.name.endsWith(extension)) {
                // It is an actual card.
                const data = this.fs('read', fullPath) as string;

                callback(fullPath, data, file);
            } else if (file.isDirectory()) {
                this.searchCardsFolder(callback, fullPath, extension);
            }
        }
    },

    /**
     * Confines the path specified to the Hearthstone.js folder.
     * There are no known ways to bypass this.
     */
    restrictPath(path: string): string {
        path = path.replaceAll('\\', '/');
        path = path.replaceAll(this.dirname(), '');

        // Prevent '..' usage
        path = path.replaceAll('../', '');
        path = path.replaceAll('..', '');

        // Remove "~/", "./", or "/" from the start of the path
        path = path.replace(/^[~.]?\//, '');

        // The path doesn't begin with a "/", so we add one in
        path = this.dirname() + '/' + path;

        return path;
    },

    /**
     * Returns the directory name of the program.
     *
     * # Example
     * ```ts
     * // Outputs: "(path to the folder where hearthstone.js is stored)/Hearthstone.js/cards/the_coin.ts"
     * console.log(dirname() + "/cards/the_coin.ts");
     * ```
     *
     * @returns The directory name.
     */
    dirname(): string {
        let dirname = pathDirname(fileURLToPath(import.meta.url)).replaceAll('\\', '/');
        dirname = dirname.split('/dist')[0];

        return dirname;
    },

    /**
     * Gets a random target from the game. All arguments default to true.
     *
     * @param includePlayer1 If it should include `game.player1` in the list of targets.
     * @param includePlayer2 If it should include `game.player2` in the list of targets.
     * @param includePlayer1Board If it should include player1's board in the list of targets.
     * @param includePlayer2Board If it should include player2's board in the list of targets.
     */
    getRandomTarget(includePlayer1 = true, includePlayer2 = true, includePlayer1Board = true, includePlayer2Board = true): Target | undefined {
        const targets: Target[] = [];

        if (includePlayer1) {
            targets.push(game.player1);
        }

        if (includePlayer2) {
            targets.push(game.player2);
        }

        if (includePlayer1Board) {
            targets.push(...game.board[game.player1.id]);
        }

        if (includePlayer2Board) {
            targets.push(...game.board[game.player2.id]);
        }

        return game.lodash.sample(targets);
    },

    /**
     * Calculate the remaining board space for the given player.
     */
    getRemainingBoardSpace(plr: Player): number {
        return game.config.general.maxBoardSpace - game.board[plr.id].length;
    },

    /**
     * Calculate the remaining hand size for the given player.
     */
    getRemainingHandSize(plr: Player): number {
        return game.config.general.maxHandLength - plr.hand.length;
    },
};
