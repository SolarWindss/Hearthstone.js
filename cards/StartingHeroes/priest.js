module.exports = {
    name: "Priest Starting Hero",
    displayName: "Anduin Wrynn",
    desc: "Priest starting hero",
    mana: 0,
    class: "Priest",
    rarity: "Free",
    set: "Core",

    heropower(plr, game, self) {
        let target = game.functions.selectTarget("Restore 2 health.", "dontupdate");
        if (!target) return -1;

        target.addHealth(2, true);
    }
}
