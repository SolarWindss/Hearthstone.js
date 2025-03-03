import { describe, expect, test } from "bun:test";
import { Player } from "@Game/player.js";
import {
	Ability,
	Event,
	EventListenerMessage,
	GamePlayCardReturn,
} from "@Game/types.js";
import { Card } from "@Game/card.js";

describe("src/player", () => {
	test("fromID - static", async () => {
		expect(Player.fromID(0)).toEqual(game.player1);
		expect(Player.fromID(1)).toEqual(game.player2);
		// This is so that Player.fromID always returns Player instead of Player | undefined
		expect(Player.fromID(2)).toEqual(game.player2);
	});

	test("getOpponent", async () => {
		expect(game.player1.getOpponent()).toEqual(game.player2);
		expect(game.player2.getOpponent()).toEqual(game.player1);
	});

	test("refreshMana", async () => {
		const player = new Player();

		expect(player.mana).toBe(0);

		expect(player.refreshMana(10)).toBe(true);
		expect(player.mana).toBe(0);
		expect(player.emptyMana).toBe(0);

		player.mana = 0;

		expect(player.refreshMana(5, player.maxMana)).toBe(false);
		expect(player.mana).toBe(5);
		expect(player.emptyMana).toBe(0);

		player.mana = 0;
		player.emptyMana = 10;

		expect(player.refreshMana(10)).toBe(false);
		expect(player.mana).toBe(10);

		player.mana = 5;

		expect(player.refreshMana(10)).toBe(true);
		expect(player.mana).toBe(10);
	});

	test("addEmptyMana", async () => {
		const player = new Player();

		expect(player.emptyMana).toBe(0);

		expect(player.addEmptyMana(1)).toBe(false);
		expect(player.emptyMana).toBe(1);

		expect(player.addEmptyMana(5)).toBe(false);
		expect(player.emptyMana).toBe(6);

		expect(player.addEmptyMana(9)).toBe(true);
		expect(player.emptyMana).toBe(10);
	});

	test("addMana", async () => {
		const player = new Player();

		expect(player.mana).toBe(0);
		expect(player.emptyMana).toBe(0);

		expect(player.addMana(2)).toBe(false);
		expect(player.mana).toBe(2);
		expect(player.emptyMana).toBe(2);

		expect(player.addMana(5)).toBe(false);
		expect(player.mana).toBe(7);
		expect(player.emptyMana).toBe(7);

		expect(player.addMana(5)).toBe(true);
		expect(player.mana).toBe(10);
		expect(player.emptyMana).toBe(10);

		player.mana = 2;

		expect(player.addMana(5)).toBe(true);
		expect(player.mana).toBe(7);
		expect(player.emptyMana).toBe(10);

		player.emptyMana = 2;

		expect(player.addMana(5)).toBe(true);
		expect(player.mana).toBe(10);
		expect(player.emptyMana).toBe(7);
	});

	test("addOverload", async () => {
		const player = new Player();

		game.event.addListener(Event.GainOverload, async (value, eventPlayer) => {
			expect(eventPlayer).toBe(player);
			expect(value).toBe(1);
			return EventListenerMessage.Destroy;
		});

		expect(player.overload).toBe(0);
		player.addOverload(1);

		expect(player.overload).toBe(1);
	});

	test("setWeapon", async () => {
		const player = new Player();

		let deathrattleTriggered = false;

		expect(player.weapon).toBeUndefined();

		const weapon = await Card.create(game.cardIds.wickedKnife22, player);
		weapon.addAbility(Ability.Deathrattle, async (owner, self) => {
			deathrattleTriggered = true;
		});

		expect(await player.setWeapon(weapon)).toBe(true);

		expect(player.weapon).not.toBeUndefined();
		expect(player.attack).toBe(weapon.attack ?? 0);

		expect(deathrattleTriggered).toBe(false);

		const weapon2 = await weapon.imperfectCopy();
		weapon2.attack = 5;

		expect(await player.setWeapon(weapon2)).toBe(true);

		expect(player.weapon).not.toBeUndefined();
		expect(player.attack).toBe(5);

		expect(deathrattleTriggered).toBe(true);
	});

	test("destroyWeapon", async () => {
		const player = new Player();

		let deathrattleTriggered = false;

		expect(player.weapon).toBeUndefined();
		expect(await player.destroyWeapon()).toBe(false);

		const weapon = await Card.create(game.cardIds.wickedKnife22, player);
		weapon.addAbility(Ability.Deathrattle, async (owner, self) => {
			deathrattleTriggered = true;
		});

		expect(await player.setWeapon(weapon)).toBe(true);

		expect(player.weapon).not.toBeUndefined();
		expect(player.attack).toBe(weapon.attack ?? 0);

		expect(await player.destroyWeapon()).toBe(true);
		expect(player.weapon).toBeUndefined();
		expect(player.attack).toBe(0);

		expect(deathrattleTriggered).toBe(true);
	});

	test("addArmor", async () => {
		const player = new Player();

		expect(player.armor).toBe(0);

		expect(player.addArmor(1)).toBe(true);
		expect(player.armor).toBe(1);

		expect(player.addArmor(4)).toBe(true);
		expect(player.armor).toBe(5);

		expect(player.addArmor(100)).toBe(true);
		expect(player.armor).toBe(105);
	});

	test("addAttack", async () => {
		const player = new Player();

		game.event.addListener(Event.GainHeroAttack, async (value, eventPlayer) => {
			expect(eventPlayer).toBe(player);
			expect(value).toBe(1);
			return EventListenerMessage.Destroy;
		});

		expect(player.attack).toBe(0);
		player.addAttack(1);

		expect(player.attack).toBe(1);
	});

	test("addHealth", async () => {
		const player = new Player();

		expect(player.health).toBe(player.maxHealth);
		player.addHealth(1);

		expect(player.health).toBe(player.maxHealth);

		player.health = player.maxHealth - 10;
		player.addHealth(1);
		expect(player.health).toBe(player.maxHealth - 10 + 1);
	});

	test("remHealth", async () => {
		const player = new Player();
		let times = 0;
		let fatalDamageTriggered = false;

		const destroy = game.event.addListener(
			Event.TakeDamage,
			async (value, eventPlayer) => {
				expect(value).toBe(1);
				times++;
				return EventListenerMessage.Success;
			},
			-1,
		);

		game.event.addListener(Event.FatalDamage, async (value, eventPlayer) => {
			expect(value).toBeUndefined();
			fatalDamageTriggered = true;
			player.health = 1;
			return EventListenerMessage.Destroy;
		});

		expect(player.health).toBe(player.maxHealth);
		expect(player.armor).toBe(0);
		expect(await player.remHealth(1)).toBe(true);

		expect(player.health).toBe(player.maxHealth - 1);
		// TODO: This fails for some reason.
		expect(times).toBe(1);

		player.armor = 5;
		expect(await player.remHealth(3)).toBe(true);

		expect(player.health).toBe(player.maxHealth - 1);
		expect(player.armor).toBe(2);
		expect(times).toBe(1);

		expect(await player.remHealth(3)).toBe(true);

		expect(player.health).toBe(player.maxHealth - 2);
		expect(player.armor).toBe(0);
		expect(times).toBe(2);

		expect(await player.remHealth(9999)).toBe(true);
		expect(player.health).toBe(1);
		expect(times).toBe(3);
		expect(fatalDamageTriggered).toBe(true);

		player.health = player.maxHealth;
		player.immune = true;

		expect(await player.remHealth(1)).toBe(true);
		expect(player.health).toBe(player.maxHealth);

		destroy();
	});

	test.todo("shuffleDeck", async () => {
		expect(false).toEqual(true);
	});

	test.todo("shuffleIntoDeck", async () => {
		expect(false).toEqual(true);
	});

	test.todo("addToBottomOfDeck", async () => {
		expect(false).toEqual(true);
	});

	test.todo("drawCards", async () => {
		expect(false).toEqual(true);
	});

	test.todo("drawSpecific", async () => {
		expect(false).toEqual(true);
	});

	test.todo("addToHand", async () => {
		expect(false).toEqual(true);
	});

	test.todo("setHero", async () => {
		expect(false).toEqual(true);
	});

	test.todo("setToStartingHero", async () => {
		expect(false).toEqual(true);
	});

	test.todo("heroPower", async () => {
		expect(false).toEqual(true);
	});

	test.todo("tradeCorpses", async () => {
		expect(false).toEqual(true);
	});

	test.todo("canUseCorpses", async () => {
		expect(false).toEqual(true);
	});

	test.todo("canUseRunes", async () => {
		expect(false).toEqual(true);
	});

	test.todo("canBeAttacked", async () => {
		expect(false).toEqual(true);
	});

	test.todo("canUseHeroPower", async () => {
		expect(false).toEqual(true);
	});

	test.todo("isAlive", async () => {
		expect(false).toEqual(true);
	});

	test.todo("getRemainingBoardSpace", async () => {
		expect(false).toEqual(true);
	});

	test.todo("getRemainingHandSpace", async () => {
		expect(false).toEqual(true);
	});

	test.todo("testRunes", async () => {
		expect(false).toEqual(true);
	});

	test.todo("mulligan", async () => {
		expect(false).toEqual(true);
	});

	test.todo("createJade", async () => {
		expect(false).toEqual(true);
	});

	test.todo("discard", async () => {
		expect(false).toEqual(true);
	});

	test.todo("doTargets", async () => {
		expect(false).toEqual(true);
	});

	test.todo("highlander", async () => {
		expect(false).toEqual(true);
	});

	test.todo("progressQuest", async () => {
		expect(false).toEqual(true);
	});

	test.todo("addQuest", async () => {
		expect(false).toEqual(true);
	});

	test.todo("invoke", async () => {
		expect(false).toEqual(true);
	});

	test.todo("recruit", async () => {
		expect(false).toEqual(true);
	});

	test.todo("joust", async () => {
		expect(false).toEqual(true);
	});

	test.todo("summon", async () => {
		expect(false).toEqual(true);
	});

	test.todo("attackTarget", async () => {
		expect(false).toEqual(true);
	});

	test.todo("spawnInDIYCard", async () => {
		expect(false).toEqual(true);
	});
});
