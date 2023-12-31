import process from 'node:process';
import { type Player } from '@Game/internal.js';

export const infoInteract = {
    /**
     * Prints the "watermark" border
     */
    watermark(): void {
        game.interact.cls();

        const { info } = game.config;
        const versionDetail = game.player.detailedView || game.config.general.debug ? 4 : 3;

        const watermark = `HEARTHSTONE.JS V${game.functions.info.version(versionDetail)}`;
        const border = '-'.repeat(watermark.length + 2);

        console.log(`|${border}|`);
        console.log(`| ${watermark} |`);
        console.log(`|${border}|`);

        if (info.branch === 'topic' && game.config.general.topicBranchWarning) {
            console.log('\n<yellow>WARNING: YOU ARE ON A TOPIC BRANCH. THIS VERSION IS NOT READY.</yellow>');
        }
    },

    /**
     * Prints some license info
     *
     * @param disappear If this is true, "This will disappear once you end your turn" will show up.
     */
    license(disappear = true): void {
        if (game.config.general.debug) {
            return;
        }

        const { info } = game.config;

        game.interact.cls();

        const version = `Hearthstone.js V${game.functions.info.version(2)} | Copyright (C) 2022 | LunarTides`;
        console.log('|'.repeat(version.length + 8));
        console.log(`||| ${version} |||`);
        console.log('|||     This program is licensed under the GPL-3.0 license.  ' + ' '.repeat(info.branch.length) + '|||');
        if (disappear) {
            console.log('|||         This will disappear once you end your turn.      ' + ' '.repeat(info.branch.length) + '|||');
        }

        console.log('|'.repeat(version.length + 8));
    },

    /**
     * Shows `status...`, calls `callback`, then adds 'OK' or 'FAIL' to the end of that line depending on the result the callback
     *
     * @param status The status to show.
     * @param callback The callback to call.
     *
     * @returns The return value of the callback.
     */
    withStatus(status: string, callback: () => boolean): boolean {
        process.stdout.write(`${status}...`);
        const success = callback();

        const message = (success) ? 'OK' : 'FAIL';
        process.stdout.write(`\r\u001B[K${status}...${message}\n`);

        return success;
    },

    /**
     * Prints all the information you need to understand the game state
     *
     * @param plr The player
     */
    showGame(plr: Player): void {
        this.watermark();
        console.log();

        if (game.turns <= 2 && !game.config.general.debug) {
            this.license();
            console.log();
        }

        this.printPlayerStats(plr);
        console.log();
        this.printBoard(plr);
        console.log();
        this.printHand(plr);
    },

    /**
     * Prints the player stats.
     */
    printPlayerStats(currentPlayer: Player): void {
        let finished = '';

        const doStat = (callback: (player: Player) => string) => {
            const player = callback(currentPlayer);
            const opponent = callback(currentPlayer.getOpponent());

            if (!player && !opponent) {
                return;
            }

            if (!player) {
                finished += `${opponent.split(':')[0]}: <italic gray>Nothing</italic gray> | ${opponent}`;
            } else if (opponent) {
                finished += `${player} | ${opponent}`;
            } else {
                finished += `${player} | ${player.split(':')[0]}: <italic gray>Nothing</italic gray>`;
            }

            finished += '\n';
        };

        const wallify = (text: string) => {
            const textSplit = game.lodash.initial(text.split('\n'));

            // Wallify the ':' in the first half
            const firstHalf = textSplit.map(line => line.split('|')[0]);
            const firstHalfWall = game.functions.util.createWall(firstHalf, ':');

            // Wallify the ':' in the second half
            const secondHalf = textSplit.map(line => line.split('|')[1]);
            const secondHalfWall = game.functions.util.createWall(secondHalf, ':');

            // Combine the two halves
            const newText = firstHalfWall.map((line, index) => line + '|' + secondHalfWall[index]);

            // Wallify the '|' in the final result
            const wall = game.functions.util.createWall(newText, '|');

            return wall.join('\n');
        };

        const colorIf = game.functions.color.if;
        const detail = (noDetail: string, detail: string) => currentPlayer.detailedView ? detail : noDetail;

        // Mana
        doStat(player => `Mana: <cyan>${player.mana}</cyan> / <cyan>${player.emptyMana}</cyan>`);

        // Health
        doStat(player => `Health: <red>${player.health}</red> <gray>[${player.armor}]</gray> / <red>${player.maxHealth}</red>`);

        // Deck Size
        doStat(player => `Deck Size: <yellow>${player.deck.length}</yellow> & <yellow>${player.hand.length}</yellow>`);

        // Hero Power
        doStat(player => {
            const heroPowerCost = colorIf(player.canUseHeroPower, 'cyan', `{${player.hero.heroPower!.cost}}`);

            return `Hero Power: ${heroPowerCost} ${player.hero.name}`;
        });

        // Weapon
        doStat(player => {
            if (!player.weapon) {
                return '';
            }

            return `Weapon: ${detail(player.weapon.colorFromRarity(), game.interact.card.getReadable(player.weapon))}`;
        });

        // TODO: Add quests, secrets, etc...

        // Attack
        doStat(player => {
            // If the player doesn't have any attack, don't show the attack.
            if (player.attack <= 0) {
                return '';
            }

            return `Attack: <bright:green>${player.attack}</bright:green>`;
        });

        // Corpses
        doStat(player => {
            if (player.corpses <= 0 || !player.canUseCorpses()) {
                return '';
            }

            return `Corpses: <gray>${player.corpses}</gray>`;
        });

        console.log(wallify(finished));
    },

    /**
     * Prints the board for a specific player.
     */
    printBoard(plr: Player): void {
        for (const [playerIndex, side] of game.board.entries()) {
            const player = game.functions.util.getPlayerFromId(playerIndex);
            const sideMessage = plr === player ? '----- Board (You) ------' : '--- Board (Opponent) ---';
            console.log(sideMessage);

            if (side.length === 0) {
                console.log('<gray>Empty</gray>');
                continue;
            }

            for (const [index, card] of side.entries()) {
                console.log(game.interact.card.getReadable(card, index + 1));
            }
        }

        console.log('------------------------');
    },

    /**
     * Prints the hand of the specified player.
     */
    printHand(plr: Player): void {
        console.log(`--- ${plr.name} (${plr.heroClass})'s Hand ---`);
        // Add the help message
        console.log('([index] <cyan>{Cost}</cyan> <b>Name</b> <bright:green>[attack / health]</bright:green> <yellow>(type)</yellow>)\n');

        for (const [index, card] of plr.hand.entries()) {
            console.log(game.interact.card.getReadable(card, index + 1));
        }
    },
};
