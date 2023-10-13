/**
 * Card
 * @module Card
 */
import {v4 as uuidv4} from 'uuid';
import {type Player} from '../internal.js';
import {type Blueprint, type CardAbility, type CardClass, type CardKeyword, type CardRarity, type CardType, type CostType, type EnchantmentDefinition, type GameConfig, type Ability, type MinionTribe, type SpellSchool, type CardBackup} from '../types.js';

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
     * This is the name of the card, it must be unique.
     * Please do not change this
     */
    name: string;

    /**
     * This is used instead of the name when displaying the card, this does not have to be unique.
     */
    displayName: string;

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
     * const sheep = new Card("Sheep", plr);
     * const anotherSheep = new Card("Sheep", plr);
     *
     * const theCoin = new Card("The Coin", plr);
     *
     * assert.equal(sheep.id, anotherSheep.id);
     * assert.notEqual(sheep.id, theCoin.id);
     */
    id = -1;

    /**
     * If the card is uncollectible.
     * - Uncollectible cards cannot be added to a deck, and cannot be found in card pools[1].
     * - Uncollectible cards can mostly only be explicitly created by other collectible cards.
     *
     * [1] Unless explicitly stated otherwise
     */
    uncollectible = false;

    /**
     * The keywords that the card has. E.g. ["Taunt", "Divine Shield", etc...]
     */
    keywords: {[key in CardKeyword]?: any} = {};

    /**
     * The card's blueprint.
     * This is the baseline of the card
     *
     * Properties of this blueprint are set in this class.
     * For example, if the blueprint has a property called "foo", and it is set to 1, then the card will get a property called "foo", with value 1
     */
    blueprint: Blueprint;

    // Minion / Weapon

    stats?: [number, number];

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

    /**
     * The description of the hero power.
     */
    hpText = 'PLACEHOLDER';

    /**
     * The cost of the hero power.
     */
    hpCost?: number = 2;

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
     * A list of abilities that can only be used if the `condition` ability returns true.
     */
    conditioned?: CardAbility[];

    /**
     * The abilities of the card (battlecry, deathrattle, etc...)
     */
    abilities: {[key in CardAbility]?: Ability[]} = {};

    /**
     * Create a card.
     *
     * @param name The name of the card
     * @param plr The card's owner.
     */
    constructor(name: string, plr: Player) {
        // Get the blueprint from the cards list
        const blueprint = game.blueprints.find(c => c.name === name);
        if (!blueprint) {
            throw new Error(`Could not find card with name ${name}`);
        }

        // Set the blueprint (every thing that gets set before the `doBlueprint` call can be overriden by the blueprint)
        this.blueprint = blueprint;
        this.name = name;

        // The display name is equal to the unique name, unless manually overriden by the blueprint when calling the `doBlueprint` function.
        this.displayName = name;

        // The turn the card was played
        this.turn = game.turns;

        // Redundant, makes the TypeScript compiler shut up
        this.type = this.blueprint.type;

        // Set maxHealth if the card is a minion or weapon
        this.maxHealth = this.blueprint.stats?.at(1);

        // Override the properties from the blueprint
        this.doBlueprint(false);

        // Properties after this point can't be overriden
        this.plr = plr;

        // Make a backup of "this" to be used when silencing this card
        if (!this.backups.init) {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            this.backups.init = {} as CardBackup;
        }

        for (const i of Object.entries(this)) {
            // HACK: Never usage
            this.backups.init[i[0] as never] = i[1] as never;
        }

        this.randomizeUuid();

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
    randomizeUuid() {
        this.uuid = uuidv4();
    }

    /**
     * Sets fields based on the blueprint of the card.
     *
     * @param activate If it should trigger the card's `create` ability.
     */
    doBlueprint(activate = true): void {
        // Reset the blueprint
        this.blueprint = game.blueprints.find(c => c.name === this.name) ?? this.blueprint;

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
        Do: this.abilities.cast = [{ plr.gainMana(1) }]
                                  ^                   ^
                                  This is in an array so we can add multiple events on casts
        */
        for (const i of Object.entries(this.blueprint)) {
            const [key, value] = i;

            if (typeof value === 'function') {
                this.abilities[key as CardAbility] = [value];
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                this[key as keyof this] = JSON.parse(JSON.stringify(i[1]));
            }
        }

        // Set maxHealth if the card is a minion or weapon
        this.maxHealth = this.blueprint.stats?.at(1);

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

        this.abilities[ability]?.push(callback);

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
    getKeyword(keyword: CardKeyword): undefined | unknown {
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
     * Returns the card's attack
     *
     * Returns -1 if the card does not have attack
     */
    getAttack(): number {
        return this.stats?.at(0) ?? 1001;
    }

    /**
     * Returns the card's health
     *
     * Returns -1 if the card does not have health
     */
    getHealth(): number {
        return this.stats?.at(1) ?? 1001;
    }

    /**
     * Sets the card's attack and health.
     *
     * @param attack The attack to set
     * @param health The health to set
     * @param changeMaxHealth If the card's max health should be reset to it's current health if the health increases from running this function.
     *
     * @returns Success
     */
    setStats(attack?: number, health?: number, changeMaxHealth = true): boolean {
        if (!this.stats) {
            return false;
        }

        if (attack === undefined) {
            attack = this.getAttack();
        }

        if (health === undefined) {
            health = this.getHealth();
        }

        this.stats = [attack, health];

        if (changeMaxHealth && health > (this.maxHealth ?? -1)) {
            this.maxHealth = health;
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
        if (!this.stats) {
            return false;
        }

        this.addAttack(attack);
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
        if (!this.stats) {
            return false;
        }

        this.remAttack(attack);
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
        if (!this.stats) {
            return false;
        }

        const before = this.getHealth();
        this.setStats(this.getAttack(), this.getHealth() + amount, !restore);

        if (!restore) {
            this.resetMaxHealth(true);
            return true;
        }

        // Restore health

        if (this.maxHealth && this.getHealth() > this.maxHealth) {
            // Too much health

            // Overheal keyword
            this.activate('overheal');

            if (this.getHealth() > before) {
                game.events.broadcast('HealthRestored', this.maxHealth, this.plr);
            }

            this.stats[1] = this.maxHealth ?? -1;
        } else if (this.getHealth() > before) {
            game.events.broadcast('HealthRestored', this.getHealth(), this.plr);
        }

        return true;
    }

    /**
     * Adds `amount` to the card's attack
     *
     * @param amount The attack to add
     *
     * @returns Success
     */
    addAttack(amount: number): boolean {
        if (!this.stats) {
            return false;
        }

        this.setStats(this.getAttack() + amount, this.getHealth());

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
        if (!this.stats) {
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

        this.setStats(this.getAttack(), this.getHealth() - amount);
        game.events.broadcast('DamageMinion', [this, amount], this.plr);

        if (this.type === 'Weapon' && this.getHealth() <= 0) {
            this.plr.destroyWeapon();
        }

        return true;
    }

    /**
     * Removes `amount` from the card's attack
     *
     * @param amount The attack to remove
     *
     * @returns Success
     */
    remAttack(amount: number): boolean {
        if (!this.stats) {
            return false;
        }

        this.setStats(this.getAttack() - amount, this.getHealth());

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
        if (!this.stats) {
            return false;
        }

        if (!this.maxHealth) {
            return false;
        }

        if (check && this.getHealth() <= this.maxHealth) {
            return false;
        }

        this.maxHealth = this.getHealth();
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
     * Create a backup of the card.
     *
     * @returns The key of the backup. You can use it by doing `card.backups[key]`
     */
    createBackup(): number {
        const key = Object.keys(this.backups).length;

        for (const i of Object.entries(this)) {
            // HACK: Never usage
            this.backups[key][i[0] as never] = i[1] as never;
        }

        return key;
    }

    /**
     * Restore a backup of the card.
     *
     * @param backup The backup to restore. It is recommended to supply a backup from `card.backups`.
     *
     * @returns Success
     */
    restoreBackup(backup: CardBackup): boolean {
        for (const att of Object.keys(backup)) {
            // HACK: Never usage
            this[att as never] = backup[att as keyof Card] as never;
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
        this.setStats(this.getAttack(), 0);
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

        for (const att of Object.keys(this)) {
            // Check if a backup exists for the attribute. If it does; restore it.
            // HACK: Never usage
            if (this.backups.init[att as never]) {
                this[att as never] = this.backups.init[att as never];
            } else if (this.blueprint[att as never]) {
                // Check if the attribute if defined in the blueprint. If it is; restore it.
                // HACK: Never usage
                this[att as never] = this.blueprint[att as never];
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

        for (const func of ability) {
            if (returnValue === game.constants.refund) {
                continue;
            }

            // Check if the method is conditioned
            if (this.conditioned && this.conditioned.includes(name)) {
                const r = this.activate('condition');
                if (!(Array.isArray(r)) || r[0] === false) {
                    continue;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
            const r = func(this.plr, this, ...args);
            if (Array.isArray(returnValue)) {
                returnValue.push(r);
            }

            // Deathrattle isn't cancellable
            if (r !== game.constants.refund || name === 'deathrattle') {
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
        const clearedTextAlt = '<bright:green>Condition cleared!</bright:green>';

        // Remove the (Condition cleared!) from the description
        this.text = this.text?.replace(clearedText, '');
        this.text = this.text?.replace(clearedTextAlt, '');

        // Check if the condition is met
        const condition = this.activate('condition');
        if (!(Array.isArray(condition)) || condition[0] === false) {
            return false;
        }

        // Add the (Condition cleared!) to the description
        this.text += this.text ? clearedText : clearedTextAlt;

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
    getEnchantmentInfo(enchantment: string): {key: string; val: string; op: string} {
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

        return {key, val: value, op};
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
        const whitelistedVars = new Set(['maxHealth', 'cost']);

        let vars = Object.entries(this);
        // Filter for only numbers
        vars = vars.filter(c => typeof (c[1]) === 'number');

        // Filter for vars in the whitelist
        vars = vars.filter(c => whitelistedVars.has(c[0]));

        // Get keys
        const keys: string[] = [];

        // Get a list of enchantments
        const enchantments = this.enchantments.map(enchantment => enchantment.enchantment);
        for (const enchantment of enchantments) {
            const info = this.getEnchantmentInfo(enchantment);
            const {key} = info;

            keys.push(key);
        }

        // Only reset the variables if the variable name is in the enchantments list
        vars = vars.filter(c => keys.includes(c[0]));
        for (const ent of vars) {
            const [key] = ent;

            // Apply backup if it exists, otherwise keep it the same.
            if (this.backups.init ? [key] : false) {
                // HACK: Never usage
                this[key as never] = this.backups.init[key as never];
            }
        }

        for (const enchantmentObject of this.enchantments) {
            const {enchantment} = enchantmentObject;

            // Seperate the keys and values
            const info = this.getEnchantmentInfo(enchantment);
            const [_key, value, op] = Object.values(info);

            const key = _key as keyof this;

            const numberValue = game.lodash.parseInt(value);
            if (typeof this[key] !== 'number') {
                continue;
            }

            switch (op) {
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
            this.enchantments.unshift({enchantment, owner});
        } else {
            this.enchantments.push({enchantment, owner});
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
     * Replaces the placeholders (`{0}`) with a more technical format that the rest of the game can understand.
     *
     * @example
     * card.text = "The current turn count is {0}";
     * card.placeholders = [(plr, self) => {
     *     const turns = Math.ceil(game.turns / 2);
     *
     *     return {0: turns};
     * }];
     * card.replacePlaceholders();
     *
     * // The `{ph:0}` tags are replaced when displaying cards.
     * assert.equal(card.text, "The current turn count is {ph:0} placeholder {/ph}");
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
        } // Maybe throw an error?

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const placeholder = temporaryPlaceholder[0];
        if (!(placeholder instanceof Object)) {
            return false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.placeholder = placeholder;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        for (const p of Object.entries(placeholder)) {
            const [key, _] = p;
            const replacement = `{ph:${key}} placeholder {/ph}`;

            this.text = this.text?.replace(new RegExp(`{ph:${key}} .*? {/ph}`, 'g'), replacement);
            this.text = this.text?.replaceAll(`{${key}}`, replacement);
        }

        return true;
    }

    /**
     * Return a perfect copy of this card. This will perfectly clone the card. This happens when, for example, a card gets temporarily removed from the board using card.destroy, then put back on the board.
     *
     * @example
     * const cloned = card.perfectCopy();
     * const cloned2 = game.functions.cloneCard(card);
     *
     * // This will actually fail since they're slightly different, but you get the point
     * assert.equal(cloned, cloned2);
     *
     * @returns A perfect copy of this card.
     */
    perfectCopy(): this {
        const clone = game.lodash.clone(this);

        clone.randomizeUuid();
        clone.sleepy = true;
        clone.turn = game.turns;

        return clone;
    }

    /**
     * Return an imperfect copy of this card. This happens when, for example, a card gets shuffled into your deck in vanilla Hearthstone.
     *
     * @example
     * const cloned = card.imperfectCopy();
     * const cloned2 = new Card(card.name, card.plr);
     *
     * // This will actually fail since they're slightly different, but you get the point
     * assert.equal(cloned, cloned2);
     *
     * @returns An imperfect copy of this card.
     */
    imperfectCopy(): Card {
        return new Card(this.name, this.plr);
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

        if (this.uncollectible) {
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
        game.interact.info.printAll(game.player);

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
                const c = game.lodash.sample(possibleCards);
                if (!c) {
                    throw new Error('null when randomly choosing adapt option');
                }

                values.push(c);
                game.functions.util.remove(possibleCards, c);
            }
        }

        let p = `\n${prompt}\n[\n`;

        for (const [i, v] of values.entries()) {
            // Check for a TypeError and ignore it
            try {
                p += `${i + 1}: ${v[0]}; ${v[1]},\n`;
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
                this.addAbility('deathrattle', (plr, self) => {
                    game.summonMinion(new Card('Plant', plr), plr);
                    game.summonMinion(new Card('Plant', plr), plr);
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
}
