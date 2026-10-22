import { Events, Client, Message } from "discord.js";

export default {

    data: {
        event: Events.MessageCreate,
        once: false,
    },

    async execute(client: Client, message: Message) {

        console.log(message.content)

    }

}