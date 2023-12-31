// Created by Hand

import { type Blueprint, type EventValue } from '@Game/types.js';
import { type Card } from '../../../src/core/card.js';

export const blueprint: Blueprint = {
    name: 'DIY 3',
    text: '<b>This is a DIY card, it does not work by default.</b> Choose a minion to kill.',
    cost: 0,
    type: 'Spell',
    classes: ['Neutral'],
    rarity: 'Free',
    collectible: false,
    id: 63,

    spellSchool: 'None',

    cast(plr, self) {
        // Choose a minion to kill.

        // Try to:
        // 1. Ask the user which minion to kill.
        // 2. Kill that minion

        /**
         * Put all your code inside this function please.
         */
        function solution() {
            // Put all your code inside this function please.

        }

        // DON'T CHANGE ANYTHING BELOW THIS LINE
        // Also there are some spoilers about the solution in the verification process down below
        // so if you don't want to see it, don't scroll down

        // Testing your solution.
        // TODO: All this code is bad. Please fix it. #330
        let target = self;
        let correctParameters = false;
        let potentiallyCancelled = false;

        // Make sure the parameters are correct
        game.functions.event.addListener('TargetSelectionStarts', _unknownValue => {
            const value = _unknownValue as EventValue<'TargetSelectionStarts'>;

            // Don't check for `prompt` since there is no correct prompt
            const [prompt, card, forceSide, forceClass, flags] = value;

            correctParameters = (
                card === self
                && forceSide === 'any'
                && forceClass === 'minion'
                && flags.length === 0
            );

            // The `TargetSelectionStarts` event fired. This means that the card has a chance of being cancelled.
            potentiallyCancelled = true;

            return 'destroy';
        }, 1);

        // Find the target
        game.functions.event.addListener('TargetSelected', _unknownValue => {
            const value = _unknownValue as EventValue<'TargetSelected'>;

            if (value[0] !== self) {
                return false;
            }

            // At this point we know that the card wasn't cancelled, since the `TargetSelected` event doesn't fire if the card is cancelled
            target = value[1] as Card;
            potentiallyCancelled = false;

            return 'destroy';
        }, 1);

        solution();

        // This only happens if the `TargetSelectionStarts` event fired, but not `TargetSelected`.
        // That only happens if the card was cancelled after the `TargetSelectionStarts` event fired
        if (potentiallyCancelled) {
            game.pause('You cancelled the card. The verification process depends on a minion actually being killed. Try again.\n');
            return game.constants.refund;
        }

        const solved = (
            target !== self
            && Boolean(target.health)
            && target.health! <= 0
            && correctParameters
            && game.graveyard.some(p => p.includes(target))
        );

        game.interact.verifyDiySolution(solved, self);

        return true;
    },
};
