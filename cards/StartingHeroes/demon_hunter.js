module.exports = {
    name: "Demon Hunter Starting Hero",
    displayName: "Illidan Stormrage",
    desc: "Demon hunter starting hero",
    mana: 0,
    class: "Demon Hunter",
    rarity: "Free",
    set: "Core",
    hpCost: 1,

    heropower(plr, game, self) {
        plr.addAttack(1);
    }
}
