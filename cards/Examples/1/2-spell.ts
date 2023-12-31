// Created by Hand

import { type Blueprint } from '@Game/types.js';

export const blueprint: Blueprint = {
    // If a field doesn't get a comment to itself, it has already been explained in a previous example card.
    name: 'Spell Example',
    text: 'Just an example card (Does nothing)',
    cost: 1,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 30,

    // The school of the spell.
    spellSchool: 'Shadow',
};
