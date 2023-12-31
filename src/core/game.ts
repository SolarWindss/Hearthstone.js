/**
 * Game
 * @module Game
 */
import _ from 'lodash';
import { Player, Card, Ai, functions, interact, eventManager } from '../internal.js';
import { type TickHookCallback, type Blueprint, type CardAbility, type CardKeyword, type EventKey, type GameAttackReturn, type GameConstants, type GamePlayCardReturn, type Target, type UnknownEventValue } from '../types.js';
import { config } from '../../config.js';
import { cardIds } from '../../cards/ids.js';

const cardCollections = {
    lackeys: [24, 25, 26, 27, 28],
    totems: [15, 16, 17, 18],
    classes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
};

export class Game {
    /**
     * Some general functions that can be used.
     *
     * This has a lot of abstraction, so don't be afraid to use them.
     * Look in here for more.
     */
    functions = functions;

    /**
     * The player that starts first.
     */
    player1: Player;

    /**
     * The player that starts with `The Coin`.
     */
    player2: Player;

    /**
     * The player whose turn it is.
     */
    player: Player;

    /**
     * The opponent of the player whose turn it is.
     *
     * Same as `game.player.getOpponent()`.
     */
    opponent: Player;

    /**
     * Events & History managment and tracker.
     */
    events = eventManager;

    /**
     * This has a lot of functions for interacting with the user.
     *
     * This is generally less useful than the `functions` object, since the majority of these functions are only used once in the source code.
     * However, some functions are still useful. For example, the `selectTarget` function.
     */
    interact = interact;

    /**
     * Some configuration for the game.
     *
     * Look in the `config` folder.
     */
    config = config;

    /**
     * All of the blueprints cards that have been implemented so far.
     * Don't use this if you don't know what you're doing.
     *
     * Use `functions.card.getAll()` instead.
     */
    blueprints: Blueprint[] = [];

    /**
     * All of the cards that have been implemented so far.
     *
     * Use `functions.card.getAll()` instead.
     */
    cards: Card[] = [];

    playCard = cards.play.play;
    summonMinion = cards.summon;

    attack = attack.attack;

    /**
     * The turn counter.
     *
     * This goes up at the beginning of each player's turn.
     *
     * This means that, for example, if `Player 1`'s turn is on turn 0, then when it's `Player 1`'s turn again, the turn counter is 2.
     *
     * Do
     * ```
     * game.functions.util.getTraditionalTurnCounter();
     * ```
     * for a more conventional turn counter.
     */
    turns = 0;

    /**
     * The board of the game.
     *
     * The 0th element is `game.player1`'s side of the board,
     * and the 1th element is `game.player2`'s side of the board.
     */
    board: Card[][] = [[], []];

    /**
     * The graveyard, a list of cards that have been killed.
     *
     * The 0th element is `game.player1`'s graveyard,
     * and the 1st element is `game.player2`'s graveyard.
     */
    graveyard: Card[][] = [[], []];

    /**
     * The event listeners that are attached to the game currently.
     */
    eventListeners: Record<number, TickHookCallback> = {};

    /**
     * If this is true, the game will not accept input from the user, and so the user can't interact with the game. This will most likely cause an infinite loop, unless both players are ai's.
     */
    noInput = false;

    /**
     * If this is true, the game will not output anything to the console.
     */
    noOutput = false;

    /**
     * If the game is currently running.
     *
     * If this is false, the game loop will end.
     */
    running = true;

    /**
     * Some constant values.
     */
    constants: GameConstants;

    /**
     * Cache for the game.
     */
    cache: Record<string, any> = {};

    cardCollections = cardCollections;
    lodash = _;
    cardIds = cardIds;

    constructor() {
        globalThis.game = this;
    }

    /**
     * Sets up the game by assigning players and initializing game state.
     *
     * @param player1 The first player.
     * @param player2 The second player.
     */
    setup(player1: Player, player2: Player): void {
        // Set this to player 1 temporarily, in order to never be null
        this.player1 = player1;
        this.player2 = player2;

        // Choose a random player to be player 1 and player 2
        if (this.lodash.random(0, 1)) {
            this.player1 = player1;
            this.player2 = player2;
        } else {
            this.player1 = player2;
            this.player2 = player1;
        }

        // Set the starting players
        this.player = this.player1;
        this.opponent = this.player2;

        // Set the player's ids
        this.player1.id = 0;
        this.player2.id = 1;

        // Some constants
        this.constants = {
            refund: -1,
        };
    }

    /**
     * Ask the user a question and returns their answer
     *
     * @param prompt The question to ask
     * @param care If this is false, it overrides `game.noInput`. Only use this when debugging.
     *
     * @returns What the user answered
     */
    input(prompt = '', overrideNoInput = false, useInputQueue = true): string {
        return this.interact.gameLoop.input(prompt, overrideNoInput, useInputQueue);
    }

    /**
     * Pause the game until the user presses the enter key.
     * Use this instead of `input` if you don't care about the return value for clarity.
     *
     * @param [prompt="Press enter to continue..."] The prompt to show the user
     */
    pause(prompt = 'Press enter to continue...'): void {
        this.interact.gameLoop.input(prompt);
    }

    /**
     * Wrapper for console.log
     */
    log(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.interact.gameLoop.log(...data);
    }

    /**
     * Wrapper for console.error
     */
    logError(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.interact.gameLoop.logError(...data);
    }

    /**
     * Wrapper for console.warn
     */
    logWarn(...data: any): void {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.interact.gameLoop.logWarn(...data);
    }

    /**
     * Assigns an ai to the players if in the config.
     *
     * Unassigns the player's ai's if not in the config.
     *
     * @returns Success
     */
    doConfigAi(): boolean {
        for (const player of [this.player1, this.player2]) {
            // HACK: Use of never. Might not update correctly if the config format is changed
            if (!this.config.ai['player' + (player.id + 1) as never]) {
                player.ai = undefined;
                continue;
            }

            if (!player.ai) {
                player.ai = new Ai(player);
            }
        }

        return true;
    }

    /**
     * Broadcast event to event listeners
     *
     * @param key The name of the event (see `EventKey`)
     * @param value The value of the event
     *
     * @returns Return values of all the executed functions
     */
    triggerEventListeners(key: EventKey, value: UnknownEventValue, player: Player): void {
        for (const eventListener of Object.values(this.eventListeners)) {
            eventListener(key, value, player);
        }
    }

    // Start / End

    /**
     * Starts the game
     *
     * @returns Success
     */
    startGame(): boolean {
        const players = [];

        // Make players draw cards
        for (let i = 0; i < 2; i++) {
            // Set the player's hero to the default hero for the class
            const player = this.functions.util.getPlayerFromId(i);

            const success = player.setToStartingHero();
            if (!success) {
                throw new Error('File \'cards/StartingHeroes/' + player.heroClass.toLowerCase().replaceAll(' ', '_') + '.ts\' is either; Missing or Incorrect. Please copy the working \'cards/StartingHeroes/\' folder from the github repo to restore a working copy. Error Code: 12');
            }

            // Add quest cards to the players hands
            for (const card of player.deck) {
                if (!card.text.includes('Quest: ') && !card.text.includes('Questline: ')) {
                    continue;
                }

                const unsuppress = this.functions.event.suppress('AddCardToHand');
                player.addToHand(card);
                unsuppress();

                player.deck.splice(player.deck.indexOf(card), 1);
            }

            // Draw 3-4 cards
            const amountOfCards = (player.id === 0) ? 3 : 4;
            while (player.hand.length < amountOfCards) {
                const unsuppress = this.functions.event.suppress('DrawCard');
                player.drawCard();
                unsuppress();
            }

            for (const card of player.deck) {
                card.activate('startofgame');
            }

            for (const card of player.hand) {
                card.activate('startofgame');
            }

            players.push(player);
        }

        this.player1 = players[0];
        this.player2 = players[1];

        this.player1.emptyMana = 1;
        this.player1.mana = 1;

        // The id of The Coin is 2
        const coin = new Card(this.cardIds.theCoin2, this.player2);

        const unsuppress = this.functions.event.suppress('AddCardToHand');
        this.player2.addToHand(coin);
        unsuppress();

        this.turns += 1;

        return true;
    }

    /**
     * Ends the game and declares `winner` as the winner
     *
     * @param winner The winner
     *
     * @returns Success
     */
    endGame(winner: Player): boolean {
        if (!winner) {
            return false;
        }

        this.interact.info.watermark();
        console.log();

        // Do this to bypass 'Press enter to continue' prompt when showing history
        const history = this.interact.gameLoop.handleCmds('history', { echo: false });
        console.log(history);

        this.input(`Player ${winner.name} wins!\n`);

        this.running = false;

        // Create log file
        this.functions.util.createLogFile();

        return true;
    }

    /**
     * Ends the players turn and starts the opponents turn
     *
     * @returns Success
     */
    endTurn(): boolean {
        // Kill all minions with 0 or less health
        this.killMinions();

        // Update events
        this.events.broadcast('EndTurn', this.turns, this.player);

        const { player, opponent } = this;

        for (const card of this.board[player.id]) {
            card.ready();
        }

        // Trigger unspent mana
        if (player.mana > 0) {
            this.events.broadcast('UnspentMana', player.mana, player);
        }

        // Remove echo cards
        player.hand = player.hand.filter(c => !c.hasKeyword('Echo'));
        player.canAttack = true;

        // Turn starts
        this.turns++;

        // Mana stuff
        opponent.addEmptyMana(1);
        opponent.mana = opponent.emptyMana - opponent.overload;
        opponent.overload = 0;
        opponent.attack = 0;

        // Weapon stuff
        if (opponent.weapon && opponent.weapon.attack! > 0) {
            opponent.attack = opponent.weapon.attack!;
            opponent.weapon.resetAttackTimes();
        }

        // Chance to spawn in a diy card
        if (this.lodash.random(0, 1, true) <= config.advanced.diyCardSpawnChance && config.advanced.spawnInDiyCards) {
            this.interact.card.spawnInDiyCard(opponent);
        }

        // Minion start of turn
        for (const card of this.board[opponent.id]) {
            // Dormant
            const dormant = card.getKeyword('Dormant') as number | undefined;

            if (dormant) {
                if (this.turns <= dormant) {
                    continue;
                }

                // Remove dormant
                card.remKeyword('Dormant');
                card.sleepy = true;

                if (Object.keys(card.backups.init.keywords).includes('Immune')) {
                    card.addKeyword('Immune');
                }

                card.turn = this.turns;

                // HACK: If the battlecry use a function that depends on `game.player`
                this.player = opponent;
                card.activate('battlecry');
                this.player = player;

                continue;
            }

            card.canAttackHero = true;
            if (this.turns > (card.turnFrozen ?? -1) + 1) {
                card.remKeyword('Frozen');
            }

            card.ready();

            // Stealth duration
            if (card.stealthDuration && card.stealthDuration > 0 && this.turns > card.stealthDuration) {
                card.stealthDuration = 0;
                card.remKeyword('Stealth');
            }

            // Location cooldown
            if (card.type === 'Location' && card.cooldown && card.cooldown > 0) {
                card.cooldown--;
            }
        }

        // Draw card
        opponent.drawCard();

        opponent.canUseHeroPower = true;

        this.events.broadcast('StartTurn', this.turns, opponent);

        this.player = opponent;
        this.opponent = player;

        return true;
    }

    // Interacting with minions

    /**
     * Kill all minions with 0 or less health
     *
     * @returns The amount of minions killed
     */
    killMinions(): number {
        let amount = 0;

        for (let p = 0; p < 2; p++) {
            const player = this.functions.util.getPlayerFromId(p);

            const spared: Card[] = [];
            const shouldSpare = (card: Card) => (card.health ?? 0) > 0 || ((card.durability ?? 0) > 0);

            for (const card of this.board[p]) {
                if (shouldSpare(card)) {
                    continue;
                }

                card.activate('deathrattle');
            }

            for (const card of this.board[p]) {
                // Add minions with more than 0 health to n.
                if (shouldSpare(card)) {
                    spared.push(card);
                    continue;
                }

                // Calmly tell the minion that it is going to die
                card.activate('remove');
                this.events.broadcast('KillMinion', card, this.player);

                card.turnKilled = this.turns;
                amount++;

                player.corpses++;
                this.graveyard[p].push(card);

                if (!card.hasKeyword('Reborn')) {
                    continue;
                }

                // Reborn
                const minion = card.imperfectCopy();
                minion.remKeyword('Reborn');

                // Reduce the minion's health to 1, keep the minion's attack the same
                minion.setStats(minion.attack, 1);

                const unsuppress = this.functions.event.suppress('SummonMinion');
                this.summonMinion(minion, player);
                unsuppress();

                // Activate the minion's passive
                // We're doing this because otherwise, the passive won't be activated this turn
                // Normally when we summon a minion, it will be activated immediately, since the `PlayCard` event gets triggered immediately after playing the card
                // but this is not the case here, since we are directly summoning the minion, and we told it to not broadcast the event.
                // The `reborn` string is passed in order for the card to know why the passive was triggered. The card can explicitly look for the `reborn` string
                // in its passive.
                // So it looks like this:
                // minion.activate(key, reason, minion);
                minion.activate('passive', 'reborn', card, this.player);

                spared.push(minion);
            }

            this.board[p] = spared;
        }

        return amount;
    }

    /**
     * Creates a card from the blueprint of an id.
     *
     * @param id The id of the blueprint. Use `game.cardIds`
     * @param owner The owner of the card
     *
     * @returns The card
     */
    createCard(id: number, owner: Player): Card {
        return new Card(id, owner);
    }
}

/**
 * Creates a new game instance, initializes players, sets up the game, imports all cards, and configures AI.
 *
 * @return An object containing the game instance, player 1, and player 2.
 */
export function createGame() {
    const game = new Game();
    const player1 = new Player('Player 1');
    const player2 = new Player('Player 2');
    game.setup(player1, player2);
    game.functions.card.importAll();
    game.doConfigAi();

    return { game, player1, player2 };
}

const attack = {
    /**
     * Makes a minion or hero attack another minion or hero
     *
     * @param attacker attacker | Amount of damage to deal
     * @param target The target
     *
     * @returns Success | Errorcode
     */
    attack(attacker: Target | number | string, target: Target): GameAttackReturn {
        game.killMinions();

        let returnValue: GameAttackReturn;

        if (target instanceof Card && target.hasKeyword('Immune')) {
            return 'immune';
        }

        if (target instanceof Player && target.immune) {
            return 'immune';
        }

        // Attacker is a number
        if (typeof attacker === 'string' || typeof attacker === 'number') {
            returnValue = attack._attackerIsNum(attacker, target);
            game.killMinions();
            return returnValue;
        }

        // The attacker is a card or player
        if (attacker instanceof Card && attacker.hasKeyword('Frozen')) {
            return 'frozen';
        }

        if (attacker instanceof Player && attacker.frozen) {
            return 'frozen';
        }

        // Check if there is a minion with taunt
        const taunts = game.board[game.opponent.id].filter(m => m.hasKeyword('Taunt'));
        if (taunts.length > 0) {
            // If the target is a card and has taunt, you are allowed to attack it
            if (target instanceof Card && target.hasKeyword('Taunt')) {
                // Allow the attack since the target also has taunt
            } else {
                return 'taunt';
            }
        }

        if (attacker instanceof Player) {
            // Attacker is a player
            returnValue = attack._attackerIsPlayer(attacker, target);
        } else if (attacker instanceof Card) {
            // Attacker is a minion
            returnValue = attack._attackerIsCard(attacker, target);
        } else {
            // Otherwise
            return 'invalid';
        }

        game.killMinions();
        return returnValue;
    },

    // Attacker is a number
    _attackerIsNum(attacker: number | string, target: Target): GameAttackReturn {
        // Attacker is a number
        // Spell damage
        const damage = attack._spellDamage(attacker, target);

        if (target instanceof Player) {
            target.remHealth(damage);
            return true;
        }

        if (target.hasKeyword('Divine Shield')) {
            target.remKeyword('Divine Shield');
            return 'divineshield';
        }

        target.remStats(0, damage);

        // Remove frenzy
        attack._doFrenzy(target);

        return true;
    },

    // Attacker is a player
    _attackerIsPlayer(attacker: Player, target: Target): GameAttackReturn {
        if (attacker.attack <= 0) {
            return 'plrnoattack';
        }

        if (!attacker.canAttack) {
            return 'plrhasattacked';
        }

        // Target is a player
        if (target instanceof Player) {
            return attack._attackerIsPlayerAndTargetIsPlayer(attacker, target);
        }

        // Target is a card
        if (target instanceof Card) {
            return attack._attackerIsPlayerAndTargetIsCard(attacker, target);
        }

        // Otherwise
        return 'invalid';
    },

    // Attacker is a player and target is a player
    _attackerIsPlayerAndTargetIsPlayer(attacker: Player, target: Player): GameAttackReturn {
        // Get the attacker's attack damage, and attack the target with it
        attack.attack(attacker.attack, target);
        game.events.broadcast('Attack', [attacker, target], attacker);

        // The attacker can't attack anymore this turn.
        attacker.canAttack = false;
        attack._removeDurabilityFromWeapon(attacker, target);

        return true;
    },

    // Attacker is a player and target is a card
    _attackerIsPlayerAndTargetIsCard(attacker: Player, target: Card): GameAttackReturn {
        // If the target has stealth, the attacker can't attack it
        if (target.hasKeyword('Stealth')) {
            return 'stealth';
        }

        // The attacker should damage the target
        game.attack(attacker.attack, target);
        game.attack(target.attack!, attacker);
        game.events.broadcast('Attack', [attacker, target], attacker);

        game.killMinions();

        // The attacker can't attack anymore this turn.
        attacker.canAttack = false;

        // Remove frenzy
        attack._doFrenzy(target);

        game.killMinions();
        attack._removeDurabilityFromWeapon(attacker, target);

        return true;
    },

    // Attacker is a card
    _attackerIsCard(attacker: Card, target: Target): GameAttackReturn {
        if (attacker.hasKeyword('Dormant')) {
            return 'dormant';
        }

        if (attacker.hasKeyword('Titan')) {
            return 'titan';
        }

        if (attacker.attackTimes && attacker.attackTimes <= 0) {
            return 'hasattacked';
        }

        if (attacker.sleepy) {
            return 'sleepy';
        }

        if (attacker.attack! <= 0) {
            return 'noattack';
        }

        // Target is a player
        if (target instanceof Player) {
            return attack._attackerIsCardAndTargetIsPlayer(attacker, target);
        }

        // Target is a minion
        if (target instanceof Card) {
            return attack._attackerIsCardAndTargetIsCard(attacker, target);
        }

        // Otherwise
        return 'invalid';
    },

    // Attacker is a card and target is a player
    _attackerIsCardAndTargetIsPlayer(attacker: Card, target: Player): GameAttackReturn {
        if (!attacker.canAttackHero) {
            return 'cantattackhero';
        }

        // If attacker has stealth, remove it
        if (attacker.hasKeyword('Stealth')) {
            attacker.remKeyword('Stealth');
        }

        // If attacker has lifesteal, heal it's owner
        attack._doLifesteal(attacker);

        // Deal damage
        attack.attack(attacker.attack!, target);

        // Remember this attack
        attacker.decAttack();
        game.events.broadcast('Attack', [attacker, target], attacker.plr);

        return true;
    },

    // Attacker is a card and target is a card
    _attackerIsCardAndTargetIsCard(attacker: Card, target: Card): GameAttackReturn {
        if (target.hasKeyword('Stealth')) {
            return 'stealth';
        }

        attack._attackerIsCardAndTargetIsCardDoAttacker(attacker, target);
        attack._attackerIsCardAndTargetIsCardDoTarget(attacker, target);

        game.events.broadcast('Attack', [attacker, target], attacker.plr);

        return true;
    },
    _attackerIsCardAndTargetIsCardDoAttacker(attacker: Card, target: Card): GameAttackReturn {
        // Cleave
        attack._cleave(attacker, target);

        attacker.decAttack();
        attacker.remKeyword('Stealth');

        const shouldDamage = attack._cardAttackHelper(attacker);
        if (!shouldDamage) {
            return true;
        }

        attack.attack(target.attack!, attacker);

        // Remove frenzy
        attack._doFrenzy(attacker);

        // If the target has poison, kill the attacker
        attack._doPoison(target, attacker);

        return true;
    },
    _attackerIsCardAndTargetIsCardDoTarget(attacker: Card, target: Card): GameAttackReturn {
        const shouldDamage = attack._cardAttackHelper(target);
        if (!shouldDamage) {
            return true;
        }

        attack.attack(attacker.attack!, target);

        attack._doLifesteal(attacker);
        attack._doPoison(attacker, target);

        // Remove frenzy
        attack._doFrenzy(target);
        if (target.health! < 0) {
            attacker.activate('overkill');
        }

        if (target.health! === 0) {
            attacker.activate('honorablekill');
        }

        return true;
    },

    // Helper functions
    _cardAttackHelper(card: Card): boolean {
        if (card.hasKeyword('Immune')) {
            return false;
        }

        if (card.hasKeyword('Divine Shield')) {
            card.remKeyword('Divine Shield');
            return false;
        }

        return true;
    },

    _cleave(attacker: Card, target: Card): void {
        if (!attacker.hasKeyword('Cleave')) {
            return;
        }

        const board = game.board[target.plr.id];
        const index = board.indexOf(target);

        const below = board[index - 1];
        const above = board[index + 1];

        // If there is a card below the target, also deal damage to it.
        if (below) {
            game.attack(attacker.attack!, below);
        }

        // If there is a card above the target, also deal damage to it.
        if (above) {
            game.attack(attacker.attack!, above);
        }
    },

    _doFrenzy(card: Card): void {
        if (card.health! <= 0) {
            return;
        }

        // The card has more than 0 health
        if (card.activate('frenzy') !== -1) {
            card.abilities.frenzy = undefined;
        }
    },

    _doPoison(poisonCard: Card, other: Card): void {
        if (!poisonCard.hasKeyword('Poisonous')) {
            return;
        }

        // The attacker has poison
        other.kill();
    },

    _doLifesteal(attacker: Card): void {
        if (!attacker.hasKeyword('Lifesteal')) {
            return;
        }

        // The attacker has lifesteal
        attacker.plr.addHealth(attacker.attack!);
    },

    _spellDamage(attacker: number | string, target: Target): number {
        if (typeof attacker !== 'string') {
            return attacker;
        }

        // The attacker is a string but not spelldamage syntax
        const spellDamageRegex = /\$(\d+)/;
        const match = spellDamageRegex.exec(attacker);

        if (!match) {
            throw new TypeError('Non-spelldamage string passed into attack.');
        }

        let dmg = game.lodash.parseInt(match[1]);
        dmg += game.player.spellDamage;

        game.events.broadcast('SpellDealsDamage', [target, dmg], game.player);
        return dmg;
    },

    _removeDurabilityFromWeapon(attacker: Player, target: Target): void {
        const { weapon } = attacker;
        if (!weapon) {
            return;
        }

        // If the weapon would be part of the attack, remove 1 durability
        if (weapon.attackTimes && weapon.attackTimes > 0 && weapon.attack) {
            weapon.attackTimes -= 1;
            weapon.remStats(0, 1);

            if (target instanceof Card) {
                attack._doPoison(weapon, target);
            }
        }

        game.killMinions();
    },
};

const playCard = {
    /**
     * Play a card
     *
     * @param card The card to play
     * @param player The card's owner
     */
    play(card: Card, player: Player): GamePlayCardReturn {
        game.killMinions();

        // Forge
        const forge = playCard._forge(card, player);
        if (forge !== 'invalid') {
            return forge;
        }

        // Trade
        const trade = playCard._trade(card, player);
        if (trade !== 'invalid') {
            return trade;
        }

        // Cost
        if (player[card.costType] < card.cost) {
            return 'cost';
        }

        // Condition
        if (!playCard._condition(card, player)) {
            return 'refund';
        }

        // Charge you for the card
        player[card.costType] -= card.cost;
        game.functions.util.remove(player.hand, card);

        // Counter
        if (playCard._countered(card, player)) {
            return 'counter';
        }

        // If the board has max capacity, and the card played is a minion or location card, prevent it.
        if (!playCard._hasCapacity(card, player)) {
            return 'space';
        }

        // Broadcast `PlayCardUnsafe` event without adding it to the history
        game.events.broadcast('PlayCardUnsafe', card, player, false);

        // Finale
        if (player[card.costType] === 0) {
            card.activate('finale');
        }

        // Store the result of the type-specific code
        let result: GamePlayCardReturn = true;

        // Type specific code
        // HACK: Use of never
        const typeFunction: (card: Card, player: Player) => GamePlayCardReturn = playCard.typeSpecific[card.type as never];
        if (!typeFunction) {
            throw new TypeError('Cannot handle playing card of type: ' + card.type);
        }

        result = typeFunction(card, player);

        // Refund
        if (result === 'refund') {
            return result;
        }

        // Add the `PlayCardUnsafe` event to the history, now that it's safe to do so
        game.events.addHistory('PlayCardUnsafe', card, player);

        // Echo
        playCard._echo(card, player);

        // Combo
        playCard._combo(card, player);

        // Broadcast `PlayCard` event
        game.events.broadcast('PlayCard', card, player);

        playCard._corrupt(card, player);
        game.killMinions();

        return result;
    },

    // Card type specific code
    typeSpecific: {
        Minion(card: Card, player: Player): GamePlayCardReturn {
            // Magnetize
            if (playCard._magnetize(card, player)) {
                return 'magnetize';
            }

            if (!card.hasKeyword('Dormant') && card.activate('battlecry') === -1) {
                return 'refund';
            }

            const unsuppress = game.functions.event.suppress('SummonMinion');
            const returnValue = cards.summon(card, player);
            unsuppress();

            return returnValue;
        },

        Spell(card: Card, player: Player): GamePlayCardReturn {
            if (card.activate('cast') === -1) {
                return 'refund';
            }

            // Twinspell functionality
            if (card.hasKeyword('Twinspell')) {
                card.remKeyword('Twinspell');
                card.text = card.text.split('Twinspell')[0].trim();

                player.addToHand(card);
            }

            // Spellburst functionality
            for (const card of game.board[player.id]) {
                card.activate('spellburst');
                card.abilities.spellburst = undefined;
            }

            return true;
        },

        Weapon(card: Card, player: Player): GamePlayCardReturn {
            if (card.activate('battlecry') === -1) {
                return 'refund';
            }

            player.setWeapon(card);
            return true;
        },

        Hero(card: Card, player: Player): GamePlayCardReturn {
            if (card.activate('battlecry') === -1) {
                return 'refund';
            }

            player.setHero(card);
            return true;
        },

        Location(card: Card, player: Player): GamePlayCardReturn {
            card.setStats(0, card.health);
            card.addKeyword('Immune');
            card.cooldown = 0;

            const unsuppress = game.functions.event.suppress('SummonMinion');
            const returnValue = cards.summon(card, player);
            unsuppress();

            return returnValue;
        },

        Heropower(card: Card, player: Player): GamePlayCardReturn {
            // A hero power card shouldn't really be played, but oh well.
            player.hero.heropowerId = card.id;
            player.hero.heroPower = card;

            return true;
        },
    },

    _trade(card: Card, player: Player): GamePlayCardReturn {
        if (!card.hasKeyword('Tradeable')) {
            return 'invalid';
        }

        let q;

        if (player.ai) {
            q = player.ai.trade(card);
        } else {
            game.interact.info.showGame(player);
            q = game.interact.yesNoQuestion('Would you like to trade ' + card.colorFromRarity() + ' for a random card in your deck?', player);
        }

        if (!q) {
            return 'invalid';
        }

        if (player.mana < 1) {
            return 'cost';
        }

        if (player.hand.length >= config.general.maxHandLength) {
            return 'space';
        }

        if (player.deck.length <= 0) {
            return 'space';
        }

        player.mana -= 1;

        game.functions.util.remove(player.hand, card);
        player.drawCard();
        player.shuffleIntoDeck(card);

        game.events.broadcast('TradeCard', card, player);

        return true;
    },

    _forge(card: Card, player: Player): GamePlayCardReturn {
        const forgeId = card.getKeyword('Forge') as number | undefined;

        if (!forgeId) {
            return 'invalid';
        }

        let q;

        if (player.ai) {
            q = player.ai.forge(card);
        } else {
            game.interact.info.showGame(player);
            q = game.interact.yesNoQuestion('Would you like to forge ' + card.colorFromRarity() + '?', player);
        }

        if (!q) {
            return 'invalid';
        }

        if (player.mana < 2) {
            return 'cost';
        }

        player.mana -= 2;

        game.functions.util.remove(player.hand, card);
        const forged = new Card(forgeId, player);
        player.addToHand(forged);

        game.events.broadcast('ForgeCard', card, player);

        return true;
    },

    _hasCapacity(card: Card, player: Player): boolean {
        // If the board has max capacity, and the card played is a minion or location card, prevent it.
        if (game.board[player.id].length < game.config.general.maxBoardSpace || !card.canBeOnBoard()) {
            return true;
        }

        // Refund
        const unsuppress = game.functions.event.suppress('AddCardToHand');
        player.addToHand(card);
        unsuppress();

        if (card.costType === 'mana') {
            player.refreshMana(card.cost);
        } else {
            player[card.costType] += card.cost;
        }

        return false;
    },

    _condition(card: Card, player: Player): boolean {
        const condition = card.activate('condition');
        if (!(Array.isArray(condition))) {
            return true;
        }

        // This is if the condition is cleared
        const cleared = condition[0] as boolean;
        if (cleared) {
            return true;
        }

        // Warn the user that the condition is not fulfilled
        const warnMessage = '<yellow>WARNING: This card\'s condition is not fulfilled. Are you sure you want to play this card?</yellow>';

        game.interact.info.showGame(player);
        const warn = game.interact.yesNoQuestion(warnMessage, player);

        if (!warn) {
            return false;
        }

        return true;
    },

    _countered(card: Card, player: Player): boolean {
        const opponent = player.getOpponent();

        // Check if the card is countered
        if (opponent.counter && opponent.counter.includes(card.type)) {
            game.functions.util.remove(opponent.counter, card.type);
            return true;
        }

        return false;
    },

    _echo(card: Card, player: Player): boolean {
        if (!card.hasKeyword('Echo')) {
            return false;
        }

        // Create an exact copy of the card played
        const echo = card.perfectCopy();
        echo.addKeyword('Echo');

        player.addToHand(echo);
        return true;
    },

    _combo(card: Card, player: Player): boolean {
        if (!game.events.events.PlayCard) {
            return false;
        }

        // Get the player's PlayCard event history
        const stat = game.events.events.PlayCard[player.id];
        if (stat.length <= 0) {
            return false;
        }

        // Get the latest event
        const latest = game.lodash.last(stat);
        const latestCard = latest?.[0] as Card;

        // If the previous card played was played on the same turn as this one, activate combo
        if (latestCard.turn === game.turns) {
            card.activate('combo');
        }

        return true;
    },

    _corrupt(card: Card, player: Player): boolean {
        for (const toCorrupt of player.hand) {
            const corruptId = toCorrupt.getKeyword('Corrupt') as number | undefined;
            if (!corruptId || card.cost <= toCorrupt.cost) {
                continue;
            }

            // Corrupt that card
            const corrupted = new Card(corruptId, player);

            game.functions.util.remove(player.hand, toCorrupt);

            const unsuppress = game.functions.event.suppress('AddCardToHand');
            player.addToHand(corrupted);
            unsuppress();
        }

        return true;
    },

    _magnetize(card: Card, player: Player): boolean {
        const board = game.board[player.id];

        if (!card.hasKeyword('Magnetic') || board.length <= 0) {
            return false;
        }

        // Find the mechs on the board
        const mechs = board.filter(m => m.tribe?.includes('Mech'));
        if (mechs.length <= 0) {
            return false;
        }

        // I'm using while loops to prevent a million indents
        const mech = game.interact.selectCardTarget('Which minion do you want this card to Magnetize to:', undefined, 'friendly');
        if (!mech) {
            return false;
        }

        if (!mech.tribe?.includes('Mech')) {
            console.log('That minion is not a Mech.');
            return playCard._magnetize(card, player);
        }

        mech.addStats(card.attack, card.health);

        for (const entry of Object.entries(card.keywords)) {
            mech.addKeyword(entry[0] as CardKeyword, entry[1]);
        }

        if (mech.maxHealth && card.maxHealth) {
            mech.maxHealth += card.maxHealth;
        }

        // Transfer the abilities over.
        for (const entry of Object.entries(card.abilities)) {
            const [key, value] = entry;

            for (const ability of value) {
                mech.addAbility(key as CardAbility, ability);
            }
        }

        // Echo
        playCard._echo(card, player);

        // Corrupt
        playCard._corrupt(card, player);

        return true;
    },
};

const cards = {
    play: playCard,

    /**
     * Summon a minion.
     * Broadcasts the `SummonMinion` event
     *
     * @param minion The minion to summon
     * @param player The player who gets the minion
     * @param colossal If the minion has colossal, summon the other minions.
     *
     * @returns The minion summoned
     */
    summon(minion: Card, player: Player, colossal = true): true | 'space' | 'colossal' | 'invalid' {
        // If the board has max capacity, and the card played is a minion or location card, prevent it.
        if (game.board[player.id].length >= game.config.general.maxBoardSpace) {
            return 'space';
        }

        game.events.broadcast('SummonMinion', minion, player);

        player.spellDamage = 0;

        if (minion.hasKeyword('Charge') || minion.hasKeyword('Titan')) {
            minion.sleepy = false;
        }

        if (minion.hasKeyword('Rush')) {
            minion.sleepy = false;
            minion.canAttackHero = false;
        }

        const dormant = minion.getKeyword('Dormant') as number | undefined;

        const colossalMinionIds = minion.getKeyword('Colossal') as number[] | undefined;
        if (colossalMinionIds && colossal) {
            // Minion.colossal is a string array.
            // example: ["Left Arm", "", "Right Arm"]
            // the "" gets replaced with the main minion

            for (const cardId of colossalMinionIds) {
                const unsuppress = game.functions.event.suppress('SummonMinion');

                if (cardId <= 0) {
                    game.summonMinion(minion, player, false);
                    unsuppress();
                    continue;
                }

                const card = new Card(cardId, player);

                if (dormant) {
                    card.addKeyword('Dormant', dormant);
                }

                game.summonMinion(card, player);
                unsuppress();
            }

            return 'colossal';
        }

        if (dormant) {
            // Oh no... Why is this not documented?
            minion.setKeyword('Dormant', dormant + game.turns);
            minion.addKeyword('Immune');
            minion.sleepy = false;
        }

        game.board[player.id].push(minion);

        for (const card of game.board[player.id]) {
            for (const key of Object.keys(card.keywords)) {
                if (key.startsWith('Spell Damage +')) {
                    player.spellDamage += game.lodash.parseInt(key.split('+')[1]);
                }
            }
        }

        return true;
    },
};
