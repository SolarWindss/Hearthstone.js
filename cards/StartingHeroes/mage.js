// Created by the Custom Card Creator

/**
 * @type {import("../../src/types").Blueprint}
 */
module.exports = {
    name: "Mage Starting Hero",
    displayName: "Jaina Proudmoore",
    desc: "Mage starting hero",
    mana: 0,
    type: "Hero",
    class: "Mage",
    rarity: "Free",
    set: "Core",
    hpDesc: "Deal 1 damage.",
    uncollectible: true,
    id: 97,

    /**
     * @type {import("../../src/types").KeywordMethod}
     */
    heropower(plr, game, self) {
        game.suppressedEvents.push("CastSpellOnMinion");
        const target = game.interact.selectTarget("Deal 1 damage.", true);
        game.suppressedEvents.pop();

        if (!target) return -1;

        game.attack(1, target);
    }
}
