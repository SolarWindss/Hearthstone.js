// Created by Hand

import { Blueprint } from "@Game/types.js";

export const blueprint: Blueprint = {
    name: "Combined Example 2",
    stats: [5, 3],
    text: "Colossal +2. Dormant. Corrupt.",
    cost: 0,
    type: "Minion",
    tribe: "None",
    classes: ["Neutral"],
    rarity: "Legendary",
    uncollectible: true,
    id: 48,

    create(plr, self) {
        self.runes = "BBB";
        self.colossal = ["Combined Example 2 Left Arm", "", "Combined Example 2 Right Arm"];
        self.corrupt = "Combined Example 2 Corrupted";
        self.dormant = 2;
    }
}
