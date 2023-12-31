/**
 * Card
 * @module Card
 */
import { randomUUID } from 'node:crypto';
import { type Player } from '../internal.js';
import { type Blueprint, type CardAbility, type CardClass, type CardKeyword, type CardRarity, type CardType, type CostType, type EnchantmentDefinition, type GameConfig, type Ability, type MinionTribe, type SpellSchool, type CardBackup } from '../types.js';

/**
 * Use this error type when throwing an error in a card
 */
export class CardError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CardError.prototype);
        this.name = 'CardError';
    }
}

export class Card {
    // All

    /**
     * The name of the card.
     *
     * Please do not change this in code.
     */
    name: string;

    /**
     * The card's description / text.
     *
     * Might include color tags like `Example [033Example 2[142`.
     * Use `stripAnsi()` to remove these.
     */
    text: string;

    /**
     * The cost of the card.
     */
    cost = 0;

    /**
     * This is the class that the card belongs to. E.g. "Warlock" or "Mage".
     */
    classes: CardClass[] = ['Neutral'];

    /**
     * This is the type of card, e.g. "Spell" or "Minion".
     */
    type: CardType = 'Undefined';

    /**
     * This is the rarity of the card. E.g. "Common" | "Rare" | etc...
     */
    rarity: CardRarity = 'Free';

    /**
     * The id tied to the blueprint of the card.
     * This differentiates cards from each other, but not cards with the same blueprint.
     * Use uuid for that.
     *
     * @example
     * const sheep = new Card(game.cardIds.sheep1, plr);
     * const anotherSheep = new Card(game.cardIds.sheep1, plr);
     *
     * const theCoin = new Card(game.cardIds.theCoin2, plr);
     *
     * assert.equal(sheep.id, anotherSheep.id);
     * assert.notEqual(sheep.id, theCoin.id);
     */
    id = -1;

    /**
     * If the card is collectible.
     * - Uncollectible cards cannot be added to a deck, and cannot be found in card pools unless explicitly stated otherwise.
     * - Uncollectible cards can mostly only be explicitly created by other collectible cards.
     */
    collectible = false;

    /**
     * The keywords that the card has. E.g. ["Taunt", "Divine Shield", etc...]
     */
    keywords: { [key in CardKeyword]?: any } = {};

    /**
     * The card's blueprint.
     * This is the baseline of the card
     */
    blueprint: Blueprint;

    // Minion / Weapon

    attack?: number;
    health?: number;

    /**
     * The tribe the card belongs to.
     */
    tribe?: MinionTribe;

    /**
     * The number of times a minion can attack in a turn;
     * - Default: 1
     * - With Windfury: 2
     * - With Mega-Windfury: 4
     */
    attackTimes?: number = 1;

    /**
     * If this is true, the card is exhausted and so can't attack this turn.
     *
     * Automatically gets set to true when the card attacks, and gets set to false at the end of the player's turn.
     */
    sleepy?: boolean = true;

    /**
     * The maximum health of the card.
     */
    maxHealth?: number;

    // Spell

    /**
     * If the card is a spell, this is the school of the spell. E.g. "Fire" or "Frost" or "Fel".
     */
    spellSchool?: SpellSchool;

    // Hero

    armor?: number;
    heropowerId?: number;
    heroPower?: Card;

    // Location

    /**
     * The durability of the location card
     */
    durability?: number;

    /**
     * The cooldown of the location card.
     */
    cooldown?: number = 2;

    // Not-null

    /**
     * What currency this card costs.
     * If this is "mana", the card costs `Player.mana`.
     * If this is "armor", the card costs `Player.armor`.
     * If this is "health", the card costs `Player.health`.
     * etc...
     *
     * This can be any value, as long as it is a defined _number_ in the `Player` class.
     */
    costType: CostType = 'mana';

    /**
     * Information stored in the card.
     * This information can be anything, and the card can access it at any point.
     *
     * I do not recommend changing this in any other context than in a card's blueprint, unless you know what you are doing.
     */
    storage: Record<string, any> = {};

    /**
     * The turn that the card was played / created.
     */
    turn: number;

    /**
     * The card's enchantments.
     * Formatted like this:
     *
     * ```json
     * [
     *     {
     *         "enchantment": "-1 cost",
     *         "owner": // someCard
     *     }
     * ]
     * ```
     */
    enchantments: EnchantmentDefinition[] = [];

    /**
     * This overrides `game.config` for the card's owner while importing the card in a deck.
     *
     * # Examples
     * ```ts
     * card.deckSettings = {
     *     deck: {
     *         maxDeckLength: 40,
     *         minDeckLength: 40
     *     }
     * };
     * ```
     */
    deckSettings?: GameConfig;

    /**
     * The owner of the card.
     */
    plr: Player;

    /**
     * A list of backups of this card.
     *
     * The card backups don't include the methods so don't call any.
     */
    backups: Record<string | number, CardBackup> = {};

    /**
     * The card's uuid. Gets randomly generated when the card gets created.
     */
    uuid: string;

    // Could be null

    /**
     * The turn that the card was killed.
     *
     * Set to -1 if the card is not dead.
     */
    turnKilled?: number;

    /**
     * The turn that the card was frozen.
     *
     * Set to -1 if the card is not frozen.
     */
    turnFrozen?: number;

    /**
     * The runes of the card.
     */
    runes?: string;

    /**
     * The amount of turns stealth should last.
     *
     * Set to 0 if the card is does not have a stealth duration.
     */
    stealthDuration?: number = 0;

    /**
     * If the card can attack the hero.
     *
     * This will be set to true if the card is a spell and other card types, so verify the type of the card before using this.
     */
    canAttackHero?: boolean = true;

    /**
     * Placeholder key-value pairs.
     *
     * This should not be used directly, unless you know what you are doing.
     *
     * @example
     * this.placeholder = {
     *     "turn": game.turns,
     * }
     *
     * assert.equal(this.text, "The current turn is: {turn}");
     * // Eventually...
     * assert.equal(this.text, "The current turn is: 1");
     */
    placeholder?: Record<string, any> = {};

    /**
     * The abilities of the card (battlecry, deathrattle, etc...)
     */
    abilities: { [key in CardAbility]?: Ability[] } = {};

    /**
     * Create a card.
     *
     * @param name The name of the card
     * @param plr The card's owner.
     */
    constructor(id: number, plr: Player) {
        // Get the blueprint from the cards list
        const blueprint = game.blueprints.find(c => c.id === id);
        if (!blueprint) {
            throw new Error(`Could not find card with id "${id}"`);
        }

        // Set the blueprint (every thing that gets set before the `doBlueprint` call can be overriden by the blueprint)
        this.blueprint = blueprint;
        this.name = blueprint.name;

        // The turn the card was played
        this.turn = game.turns;

        // Redundant, makes the TypeScript compiler shut up
        this.type = this.blueprint.type;

        // Set maxHealth if the card is a minion or weapon
        this.maxHealth = this.blueprint.health;
        this.plr = plr;

        // Override the properties from the blueprint
        this.doBlueprint(false);

        // Properties after this point can't be overriden
        // Make a backup of "this" to be used when silencing this card
        if (!this.backups.init) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            this.backups.init = {} as CardBackup;
        }

        for (const entry of Object.entries(this)) {
            // HACK: Never usage
            this.backups.init[entry[0] as never] = entry[1] as never;
        }

        this.randomizeUUID();

        const placeholder = this.activate('placeholders');

        // This is a list of replacements.
        if (Array.isArray(placeholder)) {
            this.placeholder = placeholder[0] as Record<string, any>;
        }

        game.events.broadcast('CreateCard', this, this.plr);
        this.activate('create');

        this.replacePlaceholders();
    }

    /**
     * Randomizes the uuid for this card to prevent cards from being "linked"
     */
    randomizeUUID(): void {
        this.uuid = randomUUID();
    }

    /**
     * Sets fields based on the blueprint of the card.
     *
     * @param activate If it should trigger the card's `create` ability.
     */
    doBlueprint(activate = true): void {
        // Reset the blueprint
        this.blueprint = game.blueprints.find(c => c.id === this.id) ?? this.blueprint;

        /*
        Go through all blueprint variables and
        set them in the card object
        Example:
        Blueprint: { name: "Sheep", stats: [1, 1], test: true }
                                                   ^^^^^^^^^^
        Do: this.test = true

        Function Example:
        Blueprint: { name: "The Coin", cost: 0, cast(plr, self): { plr.refreshMana(1, plr.maxMana) } }
                                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        Do: this.abilities.cast = [{ plr.addMana(1) }]
                                  ^                  ^
                                  This is in an array so we can add multiple events on casts
        */
        for (const entry of Object.entries(this.blueprint)) {
            const [key, value] = entry;

            if (typeof value === 'function') {
                this.abilities[key as CardAbility] = [value];
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this[key as keyof this] = JSON.parse(JSON.stringify(entry[1]));
            }
        }

        // Set maxHealth if the card is a minion or weapon
        this.maxHealth = this.blueprint.health;

        if (this.heropowerId) {
            this.heroPower = new Card(this.heropowerId, this.plr);
        }

        this.text = game.functions.color.fromTags(this.text || '');
        if (activate) {
            this.activate('create');
        }
    }

    /**
     * Adds an ability to the card
     *
     * @param ability The name of the ability
     * @param callback The callback function to add to the ability
     *
     * @returns Success
     */
    addAbility(ability: CardAbility, callback: Ability): boolean {
        if (!this.abilities[ability]) {
            this.abilities[ability] = [];
        }

        this.abilities[ability]!.push(callback);

        // Just in case we want this function to ever fail, we make it return success.
        return true;
    }

    // Keywords

    hasKeyword(keyword: CardKeyword): boolean {
        return Object.keys(this.keywords).includes(keyword);
    }

    /**
     * Adds a keyword to the card
     *
     * @param keyword The keyword to add
     *
     * @returns Success
     */
    addKeyword(keyword: CardKeyword, info?: any): boolean {
        if (this.hasKeyword(keyword)) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.keywords[keyword] = info;

        if (keyword === 'Charge') {
            this.sleepy = false;
        } else if (keyword === 'Rush') {
            this.sleepy = false;
            this.canAttackHero = false;
        }

        return true;
    }

    /**
     * Adds a keyword to the card
     *
     * @param keyword The keyword to add
     *
     * @returns Success
     */
    remKeyword(keyword: CardKeyword): boolean {
        if (!this.hasKeyword(keyword)) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.keywords[keyword];

        return true;
    }

    /**
     * Gets the information stored in a keyword
     *
     * @returns The info
     */
    getKeyword(keyword: CardKeyword): unknown | false {
        if (!this.hasKeyword(keyword)) {
            return false;
        }

        return this.keywords[keyword];
    }

    /**
     * Sets the information stored in a keyword. RETURNS FALSE IF THIS CARD DOESN'T ALREADY HAVE THIS KEYWORD.
     *
     * @returns Success
     */
    setKeyword(keyword: CardKeyword, info: any): boolean {
        if (!this.hasKeyword(keyword)) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.keywords[keyword] = info;

        return true;
    }

    /**
     * Freeze the card.
     * Broadcasts the `FreezeCard` event.
     *
     * @returns Success
     */
    freeze(): boolean {
        this.turnFrozen = game.turns;
        this.addKeyword('Frozen');

        game.events.broadcast('FreezeCard', this, this.plr);

        return true;
    }

    /**
     * Mark a card as having attacked once, and if it runs out of attacks this turn, exhaust it.
     *
     * @returns Success
     */
    decAttack(): boolean {
        if (!this.attackTimes) {
            return false;
        }

        this.attackTimes--;

        const shouldExhaust = (this.attackTimes <= 0);
        if (shouldExhaust) {
            this.sleepy = true;
        }

        return true;
    }

    /**
     * Makes this minion ready for attack
     *
     * @returns Success
     */
    ready(): boolean {
        this.sleepy = false;
        this.resetAttackTimes();

        return true;
    }

    // Change stats

    /**
     * Sets the card's attack and health.
     *
     * @param attack The attack to set
     * @param health The health to set
     * @param changeMaxHealth If the card's max health should be reset to it's current health if the health increases from running this function.
     *
     * @returns Success
     */
    setStats(attack: number | undefined = this.attack, health: number | undefined = this.health, changeMaxHealth = true): boolean {
        if (this.attack === undefined || this.health === undefined) {
            return false;
        }

        this.attack = attack;
        this.health = health;

        if (changeMaxHealth) {
            this.resetMaxHealth(false);
        }

        return true;
    }

    /**
     * Adds `attack` and `health` to the card.
     *
     * @param attack The attack to add
     * @param health The health to add
     *
     * @returns Success
     */
    addStats(attack = 0, health = 0): boolean {
        if (this.attack === undefined || this.health === undefined) {
            return false;
        }

        this.attack += attack;
        this.addHealth(health, false);

        return true;
    }

    /**
     * Removes `attack` and `health` from the card.
     *
     * @param attack The attack to remove
     * @param health The health to remove
     *
     * @returns Success
     */
    remStats(attack = 0, health = 0): boolean {
        if (this.attack === undefined || this.health === undefined) {
            return false;
        }

        this.attack -= attack;
        this.remHealth(health);

        return true;
    }

    /**
     * Adds `amount` to the card's health
     *
     * @param amount The health to add
     * @param restore Should reset health to it's max health if it goes over it's max health
     *
     * @returns Success
     */
    addHealth(amount: number, restore = true): boolean {
        if (this.health === undefined) {
            return false;
        }

        const before = this.health;
        this.health += amount;

        if (!restore) {
            this.resetMaxHealth(true);
            return true;
        }

        // Restore health

        if (this.maxHealth && this.health > this.maxHealth) {
            // Too much health

            // Overheal keyword
            this.activate('overheal');

            this.health = this.maxHealth ?? -1;

            if (this.health > before) {
                game.events.broadcast('HealthRestored', this.maxHealth, this.plr);
            }
        } else if (this.health > before) {
            game.events.broadcast('HealthRestored', this.health, this.plr);
        }

        return true;
    }

    /**
     * Damages a card.
     *
     * Doesn't damage the card if it is a location card, is immune, or has Stealth.
     *
     * @param amount The health to remove
     *
     * @returns Success
     */
    remHealth(amount: number): boolean {
        if (this.health === undefined) {
            return false;
        }

        // Don't allow location cards to be damaged
        if (this.type === 'Location') {
            return false;
        }

        if (this.hasKeyword('Stealth')) {
            return false;
        }

        if (this.hasKeyword('Immune')) {
            return true;
        }

        this.setStats(this.attack, this.health - amount);
        game.events.broadcast('DamageMinion', [this, amount], this.plr);

        if (this.type === 'Weapon' && this.health <= 0) {
            this.plr.destroyWeapon();
        }

        return true;
    }

    /**
     * Sets the max health of the card to it's current health. If check is true it only sets the max health if the current health is above it.
     *
     * @param check Prevent lowering it's max health
     *
     * @returns If it reset the card's max health.
     */
    resetMaxHealth(check = false): boolean {
        if (this.health === undefined) {
            return false;
        }

        if (!this.maxHealth) {
            return false;
        }

        if (check && this.health <= this.maxHealth) {
            return false;
        }

        this.maxHealth = this.health;
        return true;
    }

    // Set other

    /**
     * Sets stealth to only last `duration` amount of turns
     *
     * @param duration The amount of turns stealth should last
     *
     * @returns Success.
     */
    setStealthDuration(duration: number): boolean {
        this.stealthDuration = game.turns + duration;

        return true;
    }

    /**
     * Sets the attack times of a card to;
     * 1 if doesn't have windfury,
     * 2 if it does,
     * 4 if it has mega-windfury.
     *
     * @returns Success
     */
    resetAttackTimes(): boolean {
        this.attackTimes = 1;

        if (this.hasKeyword('Windfury')) {
            this.attackTimes = 2;
        }

        if (this.hasKeyword('Mega-Windfury')) {
            this.attackTimes = 4;
        }

        return true;
    }

    /**
     * Returns if the card can attack.
     */
    canAttack(): boolean {
        if (this.type === 'Weapon') {
            return this.attackTimes! > 0;
        }

        if (this.type !== 'Minion') {
            return false;
        }

        if (this.getKeyword('Titan') as number[] | false) {
            // The card still has titan cards
            return false;
        }

        const booleans = !this.sleepy && !this.hasKeyword('Frozen') && !this.hasKeyword('Dormant');
        const numbers = (this.attack ?? 0) > 0 && this.attackTimes! > 0;

        return booleans && numbers;
    }

    /**
     * Create a backup of the card.
     *
     * @returns The key of the backup. You can use it by doing `card.backups[key]`
     */
    createBackup(): number {
        const index = Object.keys(this.backups).length;

        for (const entry of Object.entries(this)) {
            // HACK: Never usage
            this.backups[index][entry[0] as never] = entry[1] as never;
        }

        return index;
    }

    /**
     * Restore a backup of the card.
     *
     * @param backup The backup to restore. It is recommended to supply a backup from `card.backups`.
     *
     * @returns Success
     */
    restoreBackup(backup: CardBackup): boolean {
        for (const key of Object.keys(backup)) {
            // HACK: Never usage
            this[key as never] = backup[key as keyof Card] as never;
        }

        return true;
    }

    /**
     * Bounces the card to the `plr`'s hand.
     *
     * @param plr
     */
    bounce(plr?: Player): boolean {
        if (!plr) {
            plr = this.plr;
        }

        this.plr = plr;
        plr.addToHand(this.perfectCopy());
        this.destroy();
        return true;
    }

    // Doom buttons

    /**
     * Kills the card.
     *
     * @returns Success
     */
    kill(): boolean {
        this.setStats(this.attack, 0);
        game.killMinions();

        return true;
    }

    /**
     * Silences the card.
     *
     * @returns Success
     */
    silence(): boolean {
        // Tell the minion to undo it's passive.
        // The false tells the minion that this is the last time it will call remove
        // so it should finish whatever it is doing.
        this.activate('remove');

        for (const key of Object.keys(this)) {
            // Check if a backup exists for the attribute. If it does; restore it.
            // HACK: Never usage
            if (this.backups.init[key as never]) {
                this[key as never] = this.backups.init[key as never];
            } else if (this.blueprint[key as never]) {
                // Check if the attribute if defined in the blueprint. If it is; restore it.
                // HACK: Never usage
                this[key as never] = this.blueprint[key as never];
            }
        }

        this.text = '';
        this.keywords = {};

        // Remove active enchantments.
        this.applyEnchantments();
        return true;
    }

    /**
     * Silences, then kills the card.
     *
     * @returns Success
     */
    destroy(): boolean {
        this.silence();
        this.kill();

        return true;
    }

    // Handling functions

    /**
     * Activates an ability
     *
     * @param name The method to activate
     * @param args Pass these args to the method
     *
     * @returns All the return values of the method keywords
     */
    activate(name: CardAbility, ...args: any): any[] | -1 | false {
        // This activates a function
        // Example: activate("cast")
        // Do: this.cast.forEach(castFunc => castFunc(plr, card))
        // Returns a list of the return values from all the function calls
        const ability: Ability[] | undefined = this.abilities[name];

        // If the card has the function
        if (!ability) {
            return false;
        }

        let returnValue: any[] | -1 = [];

        for (const callback of ability) {
            if (returnValue === game.constants.refund) {
                continue;
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
            const result = callback(this.plr, this, ...args);
            if (Array.isArray(returnValue)) {
                returnValue.push(result);
            }

            // Deathrattle isn't cancellable
            if (result !== game.constants.refund || name === 'deathrattle') {
                continue;
            }

            // If the return value is -1, meaning "refund", refund the card and stop the for loop
            game.events.broadcast('CancelCard', [this, name], this.plr);

            returnValue = game.constants.refund;

            // These abilities shouldn't "refund" the card, just stop execution.
            if (['use', 'heropower'].includes(name)) {
                continue;
            }

            const unsuppress = game.functions.event.suppress('AddCardToHand');
            this.plr.addToHand(this);
            unsuppress();

            this.plr[this.costType] += this.cost;

            // Return from the for loop
        }

        return returnValue;
    }

    /**
     * Returns manathirst for `m`
     *
     * @param m The mana to test
     */
    manathirst(m: number): boolean {
        return this.plr.emptyMana >= m;
    }

    /**
     * Checks if the condition is met, and if it is, adds `(Condition cleared!)` to the description
     *
     * @returns If the condition is met
     */
    condition(): boolean {
        const clearedText = ' <bright:green>(Condition cleared!)</bright:green>';
        const clearedTextAlternative = '<bright:green>Condition cleared!</bright:green>';

        // Remove the (Condition cleared!) from the description
        this.text = this.text.replace(clearedText, '');
        this.text = this.text.replace(clearedTextAlternative, '');

        // Check if the condition is met
        const condition = this.activate('condition');
        if (!(Array.isArray(condition)) || condition[0] === false) {
            return false;
        }

        // Add the (Condition cleared!) to the description
        this.text += this.text ? clearedText : clearedTextAlternative;

        return true;
    }

    /**
     * Get information from an enchantment.
     *
     * @param enchantment The enchantment string
     *
     * @example
     * const info = getEnchantmentInfo("cost = 1");
     * assert.equal(info, {"key": "cost", "val": "1", "op": "="});
     *
     * @returns The info
     */
    getEnchantmentInfo(enchantment: string): { key: string; val: string; op: string } {
        const equalsRegex = /\w+ = \w+/;
        const otherRegex = /[-+*/^]\d+ \w+/;

        const opEquals = equalsRegex.test(enchantment);
        const opOther = otherRegex.test(enchantment);

        let key = 'undefined';
        let value = 'undefined';
        let op = '=';

        if (opEquals) {
            [key, value] = enchantment.split(' = ');
        } else if (opOther) {
            [value, key] = enchantment.split(' ');
            value = value.slice(1);

            op = enchantment[0];
        }

        return { key, val: value, op };
    }

    /**
     * Runs through this card's enchantments list and applies each enchantment in order.
     *
     * @returns Success
     */
    applyEnchantments(): boolean {
        // Don't waste resources if this card doesn't have any enchantments, this gets called every tick after all.
        if (this.enchantments.length <= 0) {
            return false;
        }

        // Apply baseline for int values.
        const allowedKeys = new Set(['maxHealth', 'cost']);

        let entries = Object.entries(this);
        // Filter for only numbers
        entries = entries.filter(c => typeof (c[1]) === 'number');

        // Filter for vars in the whitelist
        entries = entries.filter(c => allowedKeys.has(c[0]));

        // Get a list of enchantments
        const enchantments = this.enchantments.map(enchantment => enchantment.enchantment);

        // Get keys
        const keys = new Set(enchantments.map(enchantment => this.getEnchantmentInfo(enchantment).key));

        // Only reset the variables if the variable name is in the enchantments list
        entries = entries.filter(c => keys.has(c[0]));
        for (const entry of entries) {
            const [key] = entry;

            // Apply backup if it exists, otherwise keep it the same.
            if (this.backups.init ? [key] : false) {
                // HACK: Never usage
                this[key as never] = this.backups.init[key as never];
            }
        }

        for (const enchantmentObject of this.enchantments) {
            const { enchantment } = enchantmentObject;

            // Seperate the keys and values
            const info = this.getEnchantmentInfo(enchantment);
            const [anyKey, value, operation] = Object.values(info);

            const key = anyKey as keyof this;

            const numberValue = game.lodash.parseInt(value);
            if (typeof this[key] !== 'number') {
                continue;
            }

            switch (operation) {
                case '=': {
                    (this[key] as number) = numberValue;
                    break;
                }

                case '+': {
                    (this[key] as number) += numberValue;
                    break;
                }

                case '-': {
                    (this[key] as number) -= numberValue;
                    break;
                }

                case '*': {
                    (this[key] as number) *= numberValue;
                    break;
                }

                case '/': {
                    (this[key] as number) /= numberValue;
                    break;
                }

                case '^': {
                    (this[key] as number) = (this[key] as number) ** numberValue;
                    break;
                }

                default: {
                    break;
                }
            }
        }

        return true;
    }

    /**
     * Add an enchantment to the card. The enchantments look something like this: `cost = 1`, `+1 cost`, `-1 cost`.
     *
     * @param enchantment The enchantment string
     * @param owner The creator of the enchantment. This will allow removing or looking up enchantment later.
     *
     * @returns Success
     */
    addEnchantment(enchantment: string, owner: Card): boolean {
        const info = this.getEnchantmentInfo(enchantment);

        // Add the enchantment to the beginning of the list, equal enchantments should apply first
        if (info.op === '=') {
            this.enchantments.unshift({ enchantment, owner });
        } else {
            this.enchantments.push({ enchantment, owner });
        }

        this.applyEnchantments();

        return true;
    }

    /**
     * Checks if an enchantment exists.
     *
     * @param enchantment The enchantment to look for.
     * @param card The owner of the enchantment. This needs to be correct to find the right enchantment.
     * @see {@link addEnchantment} for more info about `card`.
     *
     * @returns If the enchantment exists
     */
    enchantmentExists(enchantment: string, card: Card): boolean {
        return this.enchantments.some(c => c.enchantment === enchantment && c.owner === card);
    }

    /**
     * Removes an enchantment
     *
     * @param enchantmentString The enchantment to remove
     * @param card The owner of the enchantment.
     * @see {@link enchantmentExists} for more info about `card`.
     * @param update Keep this enabled unless you know what you're doing.
     *
     * @returns Success
     */
    removeEnchantment(enchantmentString: string, card: Card, update = true): boolean {
        const enchantment = this.enchantments.find(c => c.enchantment === enchantmentString && c.owner === card);
        if (!enchantment) {
            return false;
        }

        const index = this.enchantments.indexOf(enchantment);
        if (index === -1) {
            return false;
        }

        this.enchantments.splice(index, 1);

        if (!update) {
            this.applyEnchantments();
            return true;
        }

        // Update is enabled
        const info = this.getEnchantmentInfo(enchantmentString);
        const newEnchantment = `+0 ${info.key}`;

        // This will cause the variable to be reset since it is in the enchantments list.
        this.addEnchantment(newEnchantment, this);
        this.removeEnchantment(newEnchantment, this, false);

        return true;
    }

    /**
     * Replaces the placeholders (`{placeholder}`) with a more technical format that the rest of the game can understand.
     *
     * @example
     * card.text = "The current turn count is {turns}";
     * card.placeholders = [(plr, self) => {
     *     const turns = game.functions.util.getTraditionalTurnCounter();
     *
     *     return { turns };
     * }];
     * card.replacePlaceholders();
     *
     * // The `{ph:turns}` tag is replaced when displaying the card.
     * assert.equal(card.text, "The current turn count is {ph:turns}");
     *
     * @returns Success
     */
    replacePlaceholders(): boolean {
        if (!this.abilities.placeholders) {
            return false;
        }

        const temporaryPlaceholder = this.activate('placeholders');
        if (!(Array.isArray(temporaryPlaceholder))) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const placeholder = temporaryPlaceholder[0];
        if (!(placeholder instanceof Object)) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.placeholder = placeholder;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        for (const placeholderObject of Object.entries(placeholder)) {
            const [key] = placeholderObject;
            this.text = this.text.replaceAll(`{${key}}`, `{ph:${key}}`);
        }

        return true;
    }

    /**
     * Return a perfect copy of this card. This will perfectly clone the card. This happens when, for example, a card gets temporarily removed from the board using card.destroy, then put back on the board.
     *
     * @example
     * const cloned = card.perfectCopy();
     *
     * // This will actually fail since they're slightly different, but you get the point
     * assert.equal(cloned, card);
     *
     * @returns A perfect copy of this card.
     */
    perfectCopy(): this {
        const clone = game.lodash.clone(this);

        clone.randomizeUUID();
        clone.sleepy = true;
        clone.turn = game.turns;

        return clone;
    }

    /**
     * Return an imperfect copy of this card. This happens when, for example, a card gets shuffled into your deck in vanilla Hearthstone.
     *
     * @example
     * const cloned = card.imperfectCopy();
     * const cloned2 = new Card(card.id, card.plr);
     *
     * // This will actually fail since they're slightly different, but you get the point
     * assert.equal(cloned, cloned2);
     *
     * @returns An imperfect copy of this card.
     */
    imperfectCopy(): Card {
        return new Card(this.id, this.plr);
    }

    /**
     * Returns if the card specified has the ability to appear on the board.
     */
    canBeOnBoard(): boolean {
        return this.type === 'Minion' || this.type === 'Location';
    }

    /**
     * Checks if this card is a valid card to put into its players deck
     *
     * @returns Success | Errorcode
     */
    validateForDeck(): true | 'class' | 'uncollectible' | 'runes' {
        if (!this.classes.includes(this.plr.heroClass)) {
            // If it is a neutral card, it is valid
            if (this.classes.includes('Neutral')) {
                // Valid
            } else {
                return 'class';
            }
        }

        if (!this.collectible) {
            return 'uncollectible';
        }

        // Runes
        if (this.runes && !this.plr.testRunes(this.runes)) {
            return 'runes';
        }

        return true;
    }

    /**
     * Asks the user a `prompt` and show 3 choices for the player to choose, and do something to the minion based on the choice.
     *
     * @param prompt The prompt to ask the user
     * @param _values DON'T TOUCH THIS UNLESS YOU KNOW WHAT YOU'RE DOING
     *
     * @returns An array with the name of the adapt(s) chosen, or -1 if the user cancelled.
     */
    adapt(prompt = 'Choose One:', _values: string[][] = []): string | -1 {
        game.interact.info.showGame(game.player);

        const possibleCards = [
            ['Crackling Shield', 'Divine Shield'],
            ['Flaming Claws', '+3 Attack'],
            ['Living Spores', 'Deathrattle: Summon two 1/1 Plants.'],
            ['Lightning Speed', 'Windfury'],
            ['Liquid Membrane', 'Can\'t be targeted by spells or Hero Powers.'],
            ['Massive', 'Taunt'],
            ['Volcanic Might', '+1/+1'],
            ['Rocky Carapace', '+3 Health'],
            ['Shrouding Mist', 'Stealth until your next turn.'],
            ['Poison Spit', 'Poisonous'],
        ];
        const values = _values;

        if (values.length === 0) {
            for (let i = 0; i < 3; i++) {
                const card = game.lodash.sample(possibleCards);
                if (!card) {
                    throw new Error('undefined when randomly choosing adapt option');
                }

                values.push(card);
                game.functions.util.remove(possibleCards, card);
            }
        }

        let p = `\n${prompt}\n[\n`;

        for (const [index, value] of values.entries()) {
            // Check for a TypeError and ignore it
            try {
                p += `${index + 1}: ${value[0]}; ${value[1]},\n`;
            } catch {}
        }

        p = p.slice(0, -2);
        p += '\n] ';

        let choice = game.input(p);
        if (!game.lodash.parseInt(choice)) {
            game.pause('<red>Invalid choice!</red>\n');
            return this.adapt(prompt, values);
        }

        if (game.lodash.parseInt(choice) > 3) {
            return this.adapt(prompt, values);
        }

        choice = values[game.lodash.parseInt(choice) - 1][0];

        switch (choice) {
            case 'Crackling Shield': {
                this.addKeyword('Divine Shield');
                break;
            }

            case 'Flaming Claws': {
                this.addStats(3, 0);
                break;
            }

            case 'Living Spores': {
                this.addAbility('deathrattle', (plr, _) => {
                    game.summonMinion(new Card(game.cardIds.plant3, plr), plr);
                    game.summonMinion(new Card(game.cardIds.plant3, plr), plr);
                });
                break;
            }

            case 'Lightning Speed': {
                this.addKeyword('Windfury');
                break;
            }

            case 'Liquid Membrane': {
                this.addKeyword('Elusive');
                break;
            }

            case 'Massive': {
                this.addKeyword('Taunt');
                break;
            }

            case 'Volcanic Might': {
                this.addStats(1, 1);
                break;
            }

            case 'Rocky Carapace': {
                this.addStats(0, 3);
                break;
            }

            case 'Shrouding Mist': {
                this.addKeyword('Stealth');
                this.setStealthDuration(1);
                break;
            }

            case 'Poison Spit': {
                this.addKeyword('Poisonous');
                break;
            }

            default: {
                break;
            }
        }

        return choice;
    }

    /**
     * Bumps the invoke count for a card.
     *
     * @param storageName The name where the info is stored. I recommend "invokeCount". You can get that information from `card.storage[storageName]` afterwards.
     */
    galakrondBump(storageName: string): void {
        if (!this.storage[storageName]) {
            this.storage[storageName] = 0;
        }

        if (this.storage[storageName] >= 3) {
            this.storage[storageName] = 3;
        }

        this.storage[storageName]++;
    }

    /**
     * Decrements the infuse count by 1.
     * Activates the card's infuse ability if the infuse count is 0.
     *
     * @returns Success
     */
    tryInfuse(): boolean {
        const infuse = this.getKeyword('Infuse') as number | undefined;
        if (!infuse || infuse <= 0) {
            return false;
        }

        const newInfuse = infuse - 1;

        this.setKeyword('Infuse', newInfuse);
        if (newInfuse > 0) {
            return false;
        }

        this.activate('infuse');
        return true;
    }

    /**
     * @param text The text to add the the color to. Defaults to this card's name
     */
    colorFromRarity(text = this.name): string {
        return game.functions.color.fromRarity(text, this.rarity);
    }

    /**
     * Returns a colored version of the card's UUID.
     *
     * @param length How many characters of the UUID to return
     */
    coloredUUID(length = 7): string {
        return game.functions.color.fromTags(`<#${this.uuid.slice(0, 6)}>${this.uuid.slice(0, length)}</#>`);
    }

    /**
     * Takes control of the card by changing its owner.
     *
     * @param newOwner The new owner of the card.
     */
    takeControl(newOwner: Player): void {
        game.functions.util.remove(game.board[this.plr.id], this);

        this.plr = newOwner;
        game.summonMinion(this, newOwner);
    }
}
