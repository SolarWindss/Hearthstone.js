module.exports = {
    name: "Hero Example",
    desc: "Battlecry: Restore your hero to full health.",
    mana: 1,
    type: "Hero",
    class: "Neutral",
    rarity: "Free",
    hpDesc: "Restore 2 Health to your hero.", // The hero power's description
    hpCost: 2, // How much mana the hero power costs to use.
    uncollectible: true,

    battlecry(plr, game, self) {
        plr.addHealth(9999); // Heal this card's owner by 9999.
    },

    heropower(plr, game, self) {
        // This gets triggered when the player uses their hero power.

        plr.addHealth(2);
    }
}
