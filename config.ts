import { type GameConfig } from '@Game/types.js';

export const config: GameConfig = {
    general: {
        // Debug mode enables debug commands, and hides redundant information.
        debug: true,

        // The editor that gets launched.
        editor: 'code',

        // If the game should warn you about being on a topic branch.
        topicBranchWarning: true,

        // How many cards can be on a player's board at once.
        maxBoardSpace: 7,

        // The maximum amount of cards that is allowed in a hand. Don't go under 4
        maxHandLength: 10,
    },

    decks: {
        // If the game should validate deck codes.
        validate: true,

        // The minimum amount of cards that is allowed in a deck
        minLength: 30,

        // The maximum amount of cards that is allowed in a deck
        maxLength: 30,

        // How many of one card is allowed in a deck.
        // For example, you are only allowed up to x2 Sheep in a deck
        maxOfOneCard: 2,

        // How many of one legendary card is allowed in a deck.
        // For example, you are only allowed x1 Brann Bronzebeard in a deck.
        maxOfOneLegendary: 1,
    },

    ai: {
        // If the starting player should be assigned an AI.
        player1: false,

        // If the player that starts with the coin should be assigned an AI.
        player2: true,

        // If the ai should look at the context of a card's description in order to judge more accurately.
        contextAnalysis: true,

        // Which attacking model should the ai use.
        // For example, 1 will use the legacy attacking model
        // Set to -1 to use the latest model.
        attackModel: -1,

        // How much score a card needs to be spared from mulliganing.
        mulliganThreshold: 3,

        // How much score a card needs to not be traded.
        tradeThreshold: 2,

        // How much the ai values stats.
        // For example, at 0.2, 1/1 stats is valued at 0.4
        // Another example, at 1, 1/1 stats is valued at 2
        statsBias: 0.2,

        // How much the ai dislikes mana cost.
        costBias: 0.75,

        // How much the ai values spells. This exists for equality with minions, since minions gets stats.
        // The formula is: spellValue * statsBias
        spellValue: 4,

        // How much the ai values keywords.
        keywordValue: 2,

        // How much the ai values abilities
        abilityValue: 1,

        // How much score a card needs for the ai to "protect" it.
        // Protecting for the ai means to not attack with that minion, unless the minion attacks the enemy hero directly.
        protectThreshold: 5,

        // How much score a card needs for the ai to "ignore" it.
        // Ignoring a minion for the ai means to not "waste resources" attacking that minion.
        ignoreThreshold: -1,

        // How much of an advantage the ai needs to be at in order to enter "risky mode".
        // While in risky mode, the ai ignores all minions on your board and tries to rush your face to kill you as fast as possible.
        riskThreshold: 10,

        sentiments: {
            // The ai's positive sentiments.
            positive: {
                // Any number with a plus in front of it.
                // For example, +1
                '\\x\\d+': 1,

                // Anything formed like this "d/d" where "d" is a number.
                // For example, 1/1
                '\\d+/\\d+': 1,

                heal: 0.5,
                give: 2,
                gain: 1,
                set: 1,
                restore: 0.5,
                attack: 0.5,
                health: 0.5,
                copy: 2,
                draw: 2,
                mana: 1,
                hand: 1,
                deck: 1,
                battlefield: 1,
                trigger: 3,
                twice: 2,
                double: 2,
                your: 1,
                maximum: 1,
                crystal: 1,
                add: 2,
                permanent: 3,
            },

            // The ai's negative sentiments
            negative: {
                // Any number with a minus in front of it.
                // For example, -1
                '-\\d+': 1,

                deal: 1,
                remove: 2,
                damage: 1,
                silence: 5,
                destroy: 9,
                kill: 3,
            },
        },
    },

    advanced: {
        // You need to type this as the first character(s) to run debug commands
        debugCommandPrefix: '/',

        // If this is true, the game will have a chance to add a DIY card to a player's hand.
        // This is to encourage players to make their own cards
        // DIY cards do not do anything by default, so this won't give any advantage.
        spawnInDiyCards: true,

        // The chance of a DIY card spawning every turn.
        // This is a number from 0 to 1
        diyCardSpawnChance: 1 / 100,

        // If this is true, the deckcreator will also show collectible cards.
        // These deckcodes will be rejected by the game as psuedo-valid if `config.decks.validate` is false.
        dcShowUncollectible: false,

        // If this is true, `getReadableCard` will only show the top level of a card.
        // This will prevent cards from referencing other cards in their description
        // however it will still show that card's name.
        // Enable this if you don't like cards showing other cards in their description.
        getReadableCardNoRecursion: false,

        // If this is true, `getReadableCard` will always show the full card in another card's description
        // instead of it only being in detail mode.
        getReadableCardAlwaysShowFullCard: false,

        // This is how many cards `getReadableCard` can display at once.
        // This is to prevent a card from referencing itself, which would cause an infinite loop.
        // I highly recommend keeping this value below 20.
        getReadableCardMaxDepth: 10,

        // These are the keys that will show up when running the history command.
        // Look in `src/types.ts` at the `EventKey` type for a list of valid keys.
        // Also, the log files override this list and instead shows every valid key
        whitelistedHistoryKeys: [
            'HealthRestored',
            'UnspentMana',
            'GainOverload',
            'GainHeroAttack',
            'TakeDamage',
            'PlayCard',
            'SummonMinion',
            'KillMinion',
            'DamageMinion',
            'TradeCard',
            'ForgeCard',
            'FreezeCard',
            'Titan',
            'AddCardToDeck',
            'AddCardToHand',
            'DrawCard',
            'Attack',
            'HeroPower',
            'TargetSelectionStarts',
            'TargetSelected',
            'CardEvent',
        ],

        // These keys will have their value hidden when running the history command unless you caused the event.
        // The log files override this list and shows the value regardless.
        hideValueHistoryKeys: [
            'DrawCard',
            'ForgeCard',
            'AddCardToHand',
            'AddCardToDeck',
        ],
    },

    info: {
        // DONT CHANGE ANY OF THESE VALUES UNLESS YOU KNOW WHAT YOU'RE DOING.

        // The version of the game.
        // =<2.0.0, this used 'huge.major.(minor/patch)' notation.
        // >2.0.0, this uses semver
        version: '2.0.0',

        // The branch that the version is on.
        // This can be "stable", "beta", "alpha" or "topic"
        branch: 'stable',

        // The build number of the game.
        build: 0,

        // The text that is displayed along this specific version/branch combination.
        versionText: 'Make the project use typescript instead of javascript',

        // Some stuff that should really be constants
        stableIntroText: 'This is the stable branch. This branch is older, but is more stable. I recommend you use this branch.',
        betaIntroText: 'This is the beta branch. This has more features, but is less stable. I would advise against using this branch if you can help it. The todo list is not final and can change.',
        alphaIntroText: 'This is the alpha branch. This is the bleeding edge of Hearthstone.js. I would highly advise against using this branch if you can help it. Expect many bugs and breaking changes.',
        topicIntroText: 'This is a topic (feature) branch. This branch exists to add one single feature, can be highly unstable, and will be deleted in the future once the feature is done. I HIGHLY RECOMMEND NOT USING THIS BRANCH FOR ANY REASON.',

        githubUrl: 'https://github.com/LunarTides/Hearthstone.js',
    },

    todo: {
        // A todo list

        // For example:
        // Add_Battlecry: { state: 'first pass', description: 'Description.' },
        // Two: { 'second pass', 'Another description.' },
        // Three: { 'not done", "A third description.' },
        // Four: { 'doing", "A fourth description.' },
        // Five: { 'done", "A fifth description.' },
    },
};
