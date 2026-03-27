/**
 * TODO: Add your triggers here
 *
 * This is a placeholder file to initialize the triggers directory.
 * You can delete this file once you add your own triggers.
 */
import { Trigger } from "@botpress/runtime";

export default new Trigger({
        name: "startDev",
        description: "Handles start of of bot",
        events: ["bot.started"],
        handler: async ({ event }) => {
                console.log("Trigger!");
        },

});
