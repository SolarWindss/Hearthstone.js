import { Axios } from "axios";
import { writeFile } from "fs";
import { createGame } from "../../src/internal.js";

const { game, player1, player2 } = createGame();

new Axios({}).get("https://api.hearthstonejson.com/v1/latest/enUS/cards.json")
    .then(res => {
        let data = JSON.parse(res.data);
        let oldLength = data.length;
        data = game.functions.filterVanillaCards(data, false, false, true);

        writeFile(game.functions.dirname() + "../card_creator/vanilla/.ignore.cards.json", JSON.stringify(data), err => {
            if (err) throw err;
        });
        console.log(`Found ${oldLength} cards!\nFiltered away ${oldLength - data.length} cards!\nSuccessfully imported ${data.length} cards!`);
    });
