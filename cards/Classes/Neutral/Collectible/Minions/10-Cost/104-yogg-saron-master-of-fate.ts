// Created by the Vanilla Card Creator

import assert from 'node:assert';
import { type Blueprint } from '@Game/types.js';
import { Card } from '../../../../../../src/core/card.js';

export const blueprint: Blueprint = {
    name: 'Yogg-Saron, Master of Fate',
    text: '<b>Battlecry:</b> If you\'ve cast 10 spells this game, spin the Wheel of Yogg-Saron.{left}',
    cost: 10,
    type: 'Minion',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: true,
    id: 104,

    attack: 7,
    health: 5,
    tribe: 'None',

    // eslint-disable-next-line complexity
    battlecry(plr, self) {
        // If you've cast 10 spells this game, spin the Wheel of Yogg-Saron. ({amount} left!)
        if (!self.condition()) {
            return;
        }

        const choices = ['Curse of Flesh', 'Devouring Hunger', 'Hand of Fate', 'Mindflayer Goggles', 'Mysterybox', 'Rod of Roasting'];
        const choice = game.lodash.sample(choices);
        if (!choice) {
            throw new Error('No choice found');
        }

        game.events.broadcast('CardEvent', [self, choice], plr);

        const minionPool = game.functions.card.getAll().filter(card => card.type === 'Minion');
        const spellPool = game.functions.card.getAll().filter(card => card.type === 'Spell');

        switch (choice) {
            case 'Curse of Flesh': {
                // Fill the board with random minions, then give yours Rush.
                for (let id = 0; id < 2; id++) {
                    const player = game.functions.util.getPlayerFromId(id);

                    // Subtract to account for yogg-saron being on the board
                    const remaining = game.functions.util.getRemainingBoardSpace(player) - (player === plr ? 1 : 0);

                    for (let index = 0; index < remaining; index++) {
                        const card = game.lodash.sample(minionPool)?.imperfectCopy();
                        if (!card) {
                            continue;
                        }

                        if (player === plr) {
                            card.addKeyword('Rush');
                        }

                        game.summonMinion(card, player);
                    }
                }

                break;
            }

            case 'Devouring Hunger': {
                // Destroy all other minions. Gain their Attack and Health.
                for (const side of game.board) {
                    for (const card of side) {
                        if (card === self) {
                            continue;
                        }

                        card.kill();
                        self.addStats(card.attack, card.health);
                    }
                }

                break;
            }

            case 'Hand of Fate': {
                // Fill your hand with random spells. They cost (0) this turn.
                const remaining = game.functions.util.getRemainingHandSize(plr);

                for (let index = 0; index < remaining; index++) {
                    const card = game.lodash.sample(spellPool)?.imperfectCopy();
                    if (!card) {
                        continue;
                    }

                    card.addEnchantment('cost = 0', self);
                    plr.addToHand(card);
                }

                game.functions.event.addListener('EndTurn', () => {
                    for (const card of plr.hand) {
                        card.removeEnchantment('cost = 0', self);
                    }

                    return 'destroy';
                });

                break;
            }

            case 'Mindflayer Goggles': {
                // Take control of three random enemy minions.
                for (let index = 0; index < 3; index++) {
                    const card = game.lodash.sample(game.board[plr.getOpponent().id]);
                    if (!card) {
                        continue;
                    }

                    card.takeControl(plr);
                }

                break;
            }

            case 'Mysterybox': {
                // Cast a random spell for every spell you've cast this game (targets chosen randomly).
                const oldYogg = game.createCard(game.cardIds.yoggSaronHopesEnd103, plr);
                oldYogg.activate('battlecry');

                break;
            }

            case 'Rod of Roasting': {
                // Cast 'Pyroblast' randomly until a hero dies.
                const rod = game.createCard(game.cardIds.pyroblast105, plr);

                while (game.player1.health > 0 && game.player2.health > 0) {
                    plr.forceTarget = game.functions.util.getRandomTarget();
                    rod.activate('cast');
                }

                plr.forceTarget = undefined;

                break;
            }

            // No default
        }
    },

    placeholders(plr, self) {
        const amount = game.events.events.PlayCard?.[plr.id].filter(object => object[0] instanceof Card && object[0].type === 'Spell').length;
        if (!amount) {
            return { left: ' <i>(10 left!)</i>' };
        }

        if (amount >= 10) {
            return { left: '' };
        }

        return { left: ` <i>(${10 - amount} left!)</i>` };
    },

    condition(plr, self) {
        const amount = game.events.events.PlayCard?.[plr.id].filter(object => object[0] instanceof Card && object[0].type === 'Spell').length;
        if (!amount) {
            return false;
        }

        return amount >= 10;
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
