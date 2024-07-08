// Created by the Vanilla Card Creator

// This is the Yogg-Saron, Unleashed Reign of Chaos card.

import assert from "node:assert";
import { Card } from "@Game/internal.js";
import type { Blueprint } from "@Game/types.js";

export const blueprint: Blueprint = {
	name: "Reign of Chaos",
	text: "Take control of an enemy minion.",
	cost: 0,
	type: "Spell",
	classes: ["Neutral"],
	rarity: "Free",
	collectible: false,
	id: 108,

	spellSchool: "None",

	cast(owner, self) {
		// Take control of an enemy minion.
		const card = game.interact.selectCardTarget(self.text, self, "enemy");
		if (!card) {
			return game.constants.refund;
		}

		card.takeControl(owner);
		return true;
	},

	test(owner, self) {
		// Get the opponent
		const opponent = owner.getOpponent();

		// Create a sheep and summon it on the opponent's side of the board
		const sheep = new Card(game.cardIds.sheep1, opponent);
		opponent.summon(sheep);

		// Check if the sheep's owner is the opponent, is on the opponent's side of the board, and not the friendly player's side of the board
		assert.equal(sheep.owner, opponent);
		assert.ok(opponent.board.includes(sheep));
		assert.ok(!owner.board.includes(sheep));

		// Activate cast and make the player choose the sheep
		owner.inputQueue = ["1"];
		self.activate("cast");

		// Check if the sheep's owner is the friendly player, is on this side of the board, and not the opponent's side of the board
		assert.equal(sheep.owner, owner);
		assert.ok(!opponent.board.includes(sheep));
		assert.ok(owner.board.includes(sheep));
	},
};
