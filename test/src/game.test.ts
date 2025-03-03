import { describe, expect, test } from "bun:test";
import { createGame, Game } from "@Game/game.js";

/*
 * Need to create a game in case the functions need it
 * This is a pretty big performance hit.
 */
await createGame();

describe("src/game", () => {
	test.todo("input", async () => {
		expect(false).toEqual(true);
	});

	test.todo("pause", async () => {
		expect(false).toEqual(true);
	});

	test.todo("doConfigAi", async () => {
		expect(false).toEqual(true);
	});

	test.todo("triggerEventListeners", async () => {
		expect(false).toEqual(true);
	});

	test.todo("startGame", async () => {
		expect(false).toEqual(true);
	});

	test.todo("endGame", async () => {
		expect(false).toEqual(true);
	});

	test.todo("endTurn", async () => {
		expect(false).toEqual(true);
	});

	test.todo("killCardsOnBoard", async () => {
		expect(false).toEqual(true);
	});

	test.todo("createGame", async () => {
		expect(false).toEqual(true);
	});

	test.todo("attack", async () => {
		expect(false).toEqual(true);
	});

	test.todo("play", async () => {
		expect(false).toEqual(true);
	});

	test.todo("summon", async () => {
		expect(false).toEqual(true);
	});
});
