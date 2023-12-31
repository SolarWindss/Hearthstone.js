import { type EventKey, type EventListenerCallback, type TickHookCallback } from '@Game/types.js';

export const eventFunctions = {
    /**
     * Add an event listener.
     *
     * @param key The event to listen for. If this is an empty string, it will listen for any event.
     * @param callback The code that will be ran if the event listener gets triggered.
     * @param lifespan How many times the event listener will trigger and call "callback" before self-destructing. Set this to -1 to make it last forever, or until it is manually destroyed using "callback".
     *
     * @returns If you call this function, it will destroy the event listener.
     */
    addListener(key: EventKey | '', callback: EventListenerCallback, lifespan = 1): () => boolean {
        let times = 0;

        const id = game.events.eventListeners;
        let alive = true;

        /**
         * Destroys the eventlistener and removes it from the game event listeners.
         *
         * @returns Returns true if the object was successfully destroyed, false otherwise.
         */
        const destroy = () => {
            if (!alive) {
                return false;
            }

            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete game.eventListeners[id];

            alive = false;
            return true;
        };

        game.eventListeners[id] = (_key, _unknownValue, eventPlayer) => {
            // Validate key. If key is empty, match any key.
            if (key !== '' && _key !== key) {
                return;
            }

            const message = callback(_unknownValue, eventPlayer);
            times++;

            switch (message) {
                case 'destroy': {
                    destroy();
                    break;
                }

                case 'reset': {
                    times = 0;
                    break;
                }

                case false: {
                    times--;
                    break;
                }

                case true: {
                    break;
                }

                default: {
                    break;
                }
            }

            if (times === lifespan) {
                destroy();
            }
        };

        game.events.eventListeners++;

        return destroy;
    },

    /**
     * Hooks a callback function to the tick event.
     *
     * @param callback The callback function to be hooked.
     *
     * @returns A function that, when called, will remove the hook from the tick event.
     */
    hookToTick(callback: TickHookCallback): () => void {
        game.events.tickHooks.push(callback);

        const unhook = () => {
            game.functions.util.remove(game.events.tickHooks, callback);
        };

        return unhook;
    },

    /**
     * Suppresses the specified event key by adding it to the list of suppressed events.
     *
     * @param key The event key to be suppressed.
     *
     * @returns A function that undoes the suppression.
     */
    suppress(key: EventKey): () => boolean {
        game.events.suppressed.push(key);

        /**
         * Unsuppresses the event key.
         */
        const unsuppress = () => game.functions.util.remove(game.events.suppressed, key);

        return unsuppress;
    },

    /**
     * Ignores suppression for the specified event key.
     *
     * @param key The event key to be forced.
     *
     * @returns A function that undoes this.
     */
    ignoreSuppression(key: EventKey): () => boolean {
        game.events.forced.push(key);

        /**
         * Stops ignoring suppressions for that key
         */
        const undo = () => game.functions.util.remove(game.events.suppressed, key);

        return undo;
    },
};
