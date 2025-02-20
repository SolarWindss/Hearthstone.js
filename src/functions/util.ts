import childProcess from "node:child_process";
import { createHash } from "node:crypto";
// It only confines these functions to the Hearthstone.js directory. Look in the fs wrapper functions in this file to confirm.
import fs from "node:fs";
import os from "node:os";
import { dirname as pathDirname } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import type { GameConfig, Target } from "@Game/types.js";
import date from "date-and-time";

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
		let longestBrick: [string, number] = ["", Number.NEGATIVE_INFINITY];

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

			let strbuilder = "";
			const difference =
				longestBrick[1] - game.functions.color.stripAll(splitBrick[0]).length;

			strbuilder += splitBrick[0];
			strbuilder += " ".repeat(difference);
			strbuilder += sep;
			strbuilder += game.lodash.tail(splitBrick).join(sep);

			wall.push(strbuilder);
		}

		return wall;
	},

	/**
	 * Imports the config and sets it to `game.config`.
	 *
	 * @returns Success
	 */
	importConfig(): boolean {
		delete require.cache[require.resolve("../../config.ts")];

		game.config = require("../../config.ts").config as GameConfig;

		if (
			game.isEventActive("anniversary") &&
			game.config.general.locale === "en_US"
		) {
			game.config.general.locale = "anniversary";
		}

		return true;
	},

	/**
	 * Create a (crash)log file
	 *
	 * @param error If this is set, create a crash log. If this is not set, create a normal log file.
	 *
	 * @returns Success
	 */
	async createLogFile(error?: Error): Promise<boolean> {
		// Create a (crash-)log file
		if (!this.fs("exists", "/logs")) {
			this.fs("mkdir", "/logs");
		}

		const now = new Date();
		const dateString = date.format(now, "DD/MM/YYYY HH:mm:ss");

		// 01.01.23-23.59.59
		const dateStringFileFriendly = date.format(now, "DD.MM.YY-HH.mm.ss");

		// Grab the history of the game
		let history = await game.functions.interact.processCommand("history", {
			echo: false,
			debug: true,
		});

		if (typeof history !== "string") {
			throw new TypeError("createLogFile history did not return a string.");
		}

		// Strip the color codes from the history
		history = game.functions.color.stripAll(history);

		/*
		 * AI log
		 * Do this so it can actually run '/ai'
		 */
		game.config.general.debug = true;
		const aiHistory = await game.functions.interact.processCommand("/ai", {
			echo: false,
		});

		const name = error ? "Crash Log" : "Log";

		let errorContent = "";

		if (error) {
			errorContent = `
Error:
${error.stack}
`;
		}

		const debugLogContent = `-- Log --\n${game.debugLog.join("\n")}\n-- Log --\n`;
		const historyContent = `\n-- History --${history}-- History --\n`;
		const aiContent = `\n-- AI Logs --\n${aiHistory}-- AI Logs --\n`;

		const config = JSON.stringify(game.config, null, 2);
		const configContent = `\n-- Config --\n${config}\n-- Config --`;

		let mainContent = debugLogContent + historyContent;
		if (game.config.ai.player1 || game.config.ai.player2) {
			mainContent += aiContent;
		}

		mainContent += configContent;
		mainContent += errorContent;

		let osName: string = process.platform;

		if (osName === "linux") {
			// Get the operating system name from /etc/os-release
			const osRelease = this.runCommand("cat /etc/os-release");
			osName = osRelease.split('PRETTY_NAME="')[1].split('"\n')[0];

			// Also add information from uname
			const uname = this.runCommand("uname -srvmo");
			osName += ` (${uname.trim()})`;
		} else if (osName === "win32") {
			osName = `Windows ${os.release()}`;
		}

		let content = `Hearthstone.js ${name}
Date: ${dateString}
Version: ${game.functions.info.versionString(4)}
Operating System: ${osName}
Log File Version: 3

${mainContent}
`;

		let filename = "log";
		if (error) {
			filename = "crashlog";
		}

		filename = `${filename}-${dateStringFileFriendly}.txt`;

		// Add a sha256 checksum to the content
		const checksum = createHash("sha256").update(content).digest("hex");
		content += `\n${checksum}  ${filename}`;

		this.fs("write", `/logs/${filename}`, content);

		if (!error) {
			return true;
		}

		console.log(
			"\n<red>The game crashed!\nCrash report created in 'logs/%s'\nPlease create a bug report at:\n%s/issues</red>",
			filename,
			game.config.info.githubUrl,
		);

		await game.pause();

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
		if (!this.fs("exists", path)) {
			throw new Error("File does not exist");
		}

		let content = (this.fs("read", path) as string).trim();
		const contentSplit = content.split("\n");
		const fileName = path.split("/").pop();

		// Verify checksum
		content = game.lodash.initial(contentSplit).join("\n");
		const checksum = `${createHash("sha256").update(content).digest("hex")}  ${fileName}`;

		const matchingChecksum = checksum === game.lodash.last(contentSplit);
		if (!matchingChecksum) {
			throw new Error("Invalid checksum");
		}

		// Checksum matches
		const [watermark, date, version, os, logVersion] = contentSplit.map(
			(l) => l.split(": ")[1],
		);

		const history = content.split("-- History --")[1].trim();
		const ai = content.split("-- AI Logs --")[1].trim();
		const config = content.split("-- Config --")[1].trim();

		const headerObject = {
			watermark,
			date,
			version: game.lodash.parseInt(version),
			os,
			logVersion: game.lodash.parseInt(logVersion),
		};

		return { header: headerObject, history, ai, config };
	},

	/**
	 * Runs a command and returns the result.
	 *
	 * This function is slow, so think about saving the output of this to `game.cache` if you intend to run this multiple times.
	 *
	 * @throws If the command times out or has a non-zero exit code
	 */
	runCommand(cmd: string): string {
		return childProcess.execSync(cmd).toString();
	},

	/**
	 * Tries to compile the project
	 *
	 * @returns If the compilation was successful
	 */
	tryCompile(): boolean {
		try {
			this.runCommand("bunx tsc");
			return true;
		} catch (error) {
			// Status 2 means compiler error
			if (error.status === 2) {
				return false;
			}

			throw error;
		}
	},

	/**
	 * Open the provided link in the users browser.
	 *
	 * This uses the "open" command in Mac, the "start" command in Windows, and the "xdg-open" command in Linux
	 */
	openInBrowser(link: string) {
		const start =
			process.platform === "darwin"
				? "open"
				: process.platform === "win32"
					? "start"
					: "xdg-open";

		game.functions.util.runCommand(`${start} ${link}`);
	},

	/**
	 * Returns a more traditional turn counter format.
	 *
	 * `game.turns` increments at the end of every player's turn.
	 * This only increments at the end of the second player's turn.
	 */
	getTraditionalTurnCounter(): number {
		return Math.ceil(game.turn / 2);
	},

	/**
	 * Returns a language map based on the game's locale.
	 *
	 * @param refresh Whether to refresh the cache
	 * @returns The language map
	 */
	getLanguageMap(refresh = false): Record<string, string> {
		if (!this.fs("exists", `/locale/${game.config.general.locale}.json`)) {
			return {};
		}

		return JSON.parse(
			this.fs("read", `/locale/${game.config.general.locale}.json`, {
				invalidateCache: refresh,
			}) as string,
		);
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
	// biome-ignore lint/suspicious/noExplicitAny: I need to access "invalidateCache" in the args so they can't be unknown.
	fs(callback: keyof typeof fs, path: string, ...args: any[]): unknown {
		const actualPath = this.restrictPath(path);
		let actualCallback = callback;

		if (actualCallback.endsWith("Sync")) {
			actualCallback = callback.replace("Sync", "") as keyof typeof fs;
		}

		if (actualCallback === "write") {
			actualCallback = "writeFile";
		}

		if (actualCallback === "read") {
			actualCallback = "readFile";
		}

		const callbackFunction = fs[`${actualCallback}Sync` as keyof typeof fs];
		if (typeof callbackFunction !== "function") {
			throw new TypeError(`Invalid fs function: ${actualCallback}Sync`);
		}

		// Cache files when they are read
		if (actualCallback === "readFile") {
			if (!game.cache.files) {
				game.cache.files = {};
			}

			const cached = game.cache.files[actualPath] as string | undefined;

			if (args[0]?.invalidateCache && cached) {
				delete game.cache.files[actualPath];
			} else if (cached) {
				return cached;
			}

			const content = fs.readFileSync(actualPath, { encoding: "utf8" });
			game.cache.files[actualPath] = content;
			return content;
		}

		return (
			callbackFunction as (actualPath: string, ...args: unknown[]) => unknown
		)(actualPath, ...args);
	},

	/**
	 * Calls `callback` on all cards in the cards folder.
	 *
	 * @param path By default, this is the cards folder (not in dist)
	 * @param extension The extension to look for in cards. By default, this is ".ts"
	 */
	searchCardsFolder(
		callback: (path: string, content: string, file: fs.Dirent) => void,
		path = "/cards",
		extension = ".ts",
	): void {
		const actualPath = this.restrictPath(path);

		for (const file of this.fs("readdir", actualPath, {
			withFileTypes: true,
		}) as fs.Dirent[]) {
			const fullPath = `${actualPath}/${file.name}`;

			if (file.name === "ids.ts") {
				continue;
			}

			if (file.name.endsWith(extension)) {
				// It is an actual card.
				const data = this.fs("read", fullPath) as string;

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
		let newPath = path.replaceAll("\\", "/");
		newPath = newPath.replaceAll(this.dirname(), "");

		// Prevent '..' usage
		newPath = newPath.replaceAll("../", "");
		newPath = newPath.replaceAll("..", "");

		// Remove "~/", "./", or "/" from the start of the path
		newPath = newPath.replace(/^[~.]?\//, "");

		// The path doesn't begin with a "/", so we add one in
		newPath = `${this.dirname()}/${newPath}`;

		return newPath;
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
		let dirname = pathDirname(fileURLToPath(import.meta.url)).replaceAll(
			"\\",
			"/",
		);

		dirname = dirname.split("/src")[0];
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
	getRandomTarget(
		includePlayer1 = true,
		includePlayer2 = true,
		includePlayer1Board = true,
		includePlayer2Board = true,
	): Target | undefined {
		const targets: Target[] = [];

		if (includePlayer1) {
			targets.push(game.player1);
		}

		if (includePlayer2) {
			targets.push(game.player2);
		}

		if (includePlayer1Board) {
			targets.push(...game.player1.board);
		}

		if (includePlayer2Board) {
			targets.push(...game.player2.board);
		}

		return game.lodash.sample(targets);
	},

	/**
	 * Parses the given arguments for the eval command and returns the code to evaluate
	 */
	async parseEvalArgs(args: string[]): Promise<string> {
		if (args.length <= 0) {
			await game.pause("<red>Too few arguments.</red>\n");
			return args.join(" ");
		}

		let log = false;

		if (args[0] === "log") {
			log = true;
			args.shift();
		}

		let code = args.join(" ");

		// Allow for stuff like `/eval @Player1.addToHand(@00ff00.perfectCopy());`
		code = code.replaceAll("@Player", "game.player");

		let trueLog = false;

		const uuidRegex = /@\w+/g;
		for (const match of code.matchAll(uuidRegex)) {
			const uuid = match[0].slice(1);

			// HACK: Do this or logging doesn't work.
			if (log) {
				code = code.replace(
					`@${uuid}`,
					`let __card = Card.fromUUID("${uuid}");if (!__card) throw new Error("Card with uuid \\"${uuid}\\" not found");console.log(__card`,
				);

				log = false;
				trueLog = true;
			} else {
				code = code.replace(
					`@${uuid}`,
					`let __card = Card.fromUUID("${uuid}");if (!__card) throw new Error("Card with uuid \\"${uuid}\\" not found");__card`,
				);
			}
		}

		/*
		 * Allow for stuff like `/eval h#c#1.addAttack(b#o#2.attack)`;
		 * ^^ This adds the second card on the opponent's side of the board's attack to the card at index 1 in the current player's hand
		 */
		const indexBasedRegex = /([hbdg])#([co])#(\d+)/g;
		for (const match of code.matchAll(indexBasedRegex)) {
			let [line, where, side, index] = match;

			switch (where) {
				case "h": {
					where = "game.player[x].hand";
					break;
				}

				case "d": {
					where = "game.player[x].deck";
					break;
				}

				case "b": {
					where = "game.player[x].board";
					break;
				}

				case "g": {
					where = "game.player[x].graveyard";
					break;
				}

				// No default
			}

			side =
				side === "c"
					? (game.player.id + 1).toString()
					: (game.opponent.id + 1).toString();

			where = where.replaceAll("[x]", side);

			code = code.replace(line, `${where}[${index} - 1]`);
		}

		if (log) {
			if (code.at(-1) === ";") {
				code = code.slice(0, -1);
			}

			code = `console.log(${code});await game.pause();`;
		}

		if (trueLog) {
			if (code.at(-1) === ";") {
				code = code.slice(0, -1);
			}

			code = `${code});await game.pause();`;
		}

		return `(async () => { ${code} })()`;
	},
};
