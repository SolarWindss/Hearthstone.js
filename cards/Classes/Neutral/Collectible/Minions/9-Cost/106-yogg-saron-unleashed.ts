// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint, type EventValue } from '@Game/types.js';

export const blueprint: Blueprint = {
    name: 'Yogg-Saron, Unleashed',
    text: '<b>Titan</b> After this uses an ability, cast two random spells.',
    cost: 9,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: true,
    id: 106,

    attack: 7,
    health: 5,
    tribe: 'None',

    create(plr, self) {
        // Add additional fields here
        self.addKeyword('Titan', [game.cardIds.induceInsanity107, game.cardIds.reignOfChaos108, game.cardIds.tentacleSwarm109]);
    },

    passive(plr, self, key, _unknownValue) {
        // After this uses an ability, cast two random spells

        // Only proceed if the correct event key was broadcast
        if (key !== 'Titan') {
            return;
        }

        // Here we cast the value to the correct type.
        // Do not use the '_unknownValue' variable after this.
        const value = _unknownValue as EventValue<typeof key>;

        if (value[0] !== self) {
            return;
        }

        const pool = game.functions.card.getAll().filter(card => card.type === 'Spell');

        for (let i = 0; i < 2; i++) {
            const card = game.lodash.sample(pool)?.imperfectCopy();
            if (!card) {
                continue;
            }

            card.activate('cast');
        }
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
