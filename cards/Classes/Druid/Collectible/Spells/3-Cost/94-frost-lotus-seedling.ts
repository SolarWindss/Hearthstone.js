// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Frost Lotus Seedling',
    text: '{placeholder}',
    cost: 3,
    type: 'Spell',
    classes: ['Druid'],
    rarity: 'Rare',
    collectible: true,
    id: 94,

    spellSchool: 'Nature',

    create(plr, self) {
        // Initialize storage
        self.storage.blossom = 0;
        self.storage.blossomed = false;
    },

    passive(plr, self, key, _unknownValue, eventPlayer) {
        // Increment blossom counter at the end of the owner's turn
        if (!(key === 'EndTurn' && eventPlayer === plr)) {
            return;
        }

        self.storage.blossom++;

        if (self.storage.blossom >= 3) {
            self.storage.blossomed = true;
        }
    },

    cast(plr, self) {
        // Draw {1|2} card{|s}. Gain {5|10} Armor.{ (Blossoms in 3 turns.)|}
        //       ^ ^ Left side is if not blossomed, right side if blossomed
        const { blossomed } = self.storage;

        plr.drawCard();
        if (blossomed) {
            plr.drawCard();
        }

        plr.addArmor(blossomed ? 10 : 5);
    },

    condition(plr, self) {
        return Boolean(self.storage.blossomed);
    },

    placeholders(plr, self) {
        const placeholder = self.storage.blossomed ? 'Draw 2 cards. Gain 10 Armor.' : `Draw 1 card. Gain 5 Armor. <i>(Blossoms in ${3 - self.storage.blossom} turns.)</i>`;

        return { placeholder };
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
