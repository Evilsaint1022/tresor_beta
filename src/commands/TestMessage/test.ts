import { Message, Client } from "discord.js";

export default {

    data: {
        name: "test",
        description: "Test command",
    },

    async execute( message: Message, client: Client, args: string[] ) {

        await message.reply({ content: "Test command executed!" });

    }

}