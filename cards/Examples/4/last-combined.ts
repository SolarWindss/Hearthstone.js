// Created by Hand

import { type Blueprint, type EventValue } from '@Game/types.js';

// This is the big one
export const blueprint: Blueprint = {
    name: 'Combined Example 4',
    text: 'Quest: Play 3 cards. Reward: Reduce the cost of the next 10 Minions you play by 1.',
    cost: 1,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Legendary',
    collectible: false,
    id: 60,

    spellSchool: 'None',

    cast(plr, self) {
        plr.addQuest('Quest', self, 'PlayCard', 3, (_unknownValue, done) => {
            const value = _unknownValue as EventValue<'PlayCard'>;

            if (value === self) {
                return false;
            }

            if (!done) {
                return true;
            }

            // The quest is done.
            // Add the `-1 cost` enchantment constantly
            const unhook = game.functions.event.hookToTick(() => {
                // Only add the enchantment to minions
                for (const minion of plr.hand.filter(card => card.type === 'Minion')) {
                    if (minion.enchantmentExists('-1 cost', self)) {
                        continue;
                    }

                    minion.addEnchantment('-1 cost', self);
                }
            });

            // Add an event listener to check if you've played 10 cards
            let amount = 0;

            game.functions.event.addListener('PlayCard', (_unknownValue, eventPlayer) => {
                const value = _unknownValue as EventValue<'PlayCard'>;

                // Only continue if the player that triggered the event is this card's owner and the played card is a minion.
                if (!(eventPlayer === plr && value.type === 'Minion')) {
                    return false;
                }

                // Every time YOU play a MINION, increment `amount` by 1.
                amount++;

                // If `amount` is less than 10, don't do anything. Return true since it was a success
                if (amount < 10) {
                    return true;
                }

                // You have now played 10 minions

                // Destroy the tick hook
                unhook();

                // Reverse the enchantment
                // You might be able to just do `for (const minion of plr.hand)` instead, since `removeEnchantment` only removes enchantments if it's there.
                for (const minion of plr.hand.filter(c => c.type === 'Minion')) {
                    minion.removeEnchantment('-1 cost', self);
                }

                // Destroy this event listener so it doesn't run again
                return 'destroy';
            }, -1); // The event listener shouldn't destruct on its own, and should only be manually destroyed.

            // The quest event was a success. The game will remove this quest from the player.
            return true;
        });
    },

    test(plr, self) {
        // TODO: Add proper tests. #325
        return true;
    },
};
