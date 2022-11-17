const { Game } = require("./game");
const { Player } = require("./other");

// Customization (You can change these)
const debug = true; // Enables commands like /give, /eval and /debug. Disables naming players.
                    // Enable for debugging, disable for actual play.
const maxDeckLength = 30;
const maxBoardSpace = 7;
const AIMulliganThreshold = 8; // If you don't know what this is, keep it at it's default value.
const AISpellValue = 4;
const AIKeywordValue = 2.5;

const P1AI = false; // Set this to "true" to make the starting player an ai
const P2AI = false; // Set this to "true" to make the player with the coin an ai
// -----------------------------------

let player1 = new Player("Player 1");
let player2 = new Player("Player 2");
let game = new Game(player1, player2);

if (!debug) {
    const input = require("readline-sync").question; // Python input

    game.interact.printName();

    player1.name = input("Player 1, what is your name? ");
    player2.name = input("Player 2, what is your name? ");
}

game.setConstants(debug, maxDeckLength, maxBoardSpace, AIMulliganThreshold, AISpellValue, AIKeywordValue);
game.functions.importCards(__dirname + '/../cards');

// Ask the players for deck codes.
game.interact.deckCode(player1);
game.interact.deckCode(player2);

game.player1.is_ai = P1AI;
game.player2.is_ai = P2AI;

game.startGame();

game.interact.mulligan(player1);
game.interact.mulligan(player2);

while (true) game.interact.doTurn();
