// Created by Hand (before the Card Creator Existed)

import assert from "node:assert";
import type { Blueprint } from "@Game/types.js";

export const blueprint: Blueprint = {
	// Look in `titan.ts` first.
	name: "Ability 2",
	text: "Heal 3 damage.",
	cost: 0,
	type: "Spell",
	classes: ["Neutral"],
	rarity: "Free",
	collectible: false,
	id: 80,

	spellSchool: "None",

	cast(owner, self) {
		// Heal 3 damage.

		owner.addHealth(3);
	},

	test(owner, self) {
		owner.health = owner.maxHealth - 5;
		self.activate("cast");

		assert.equal(owner.health, owner.maxHealth - 2);
	},
};
