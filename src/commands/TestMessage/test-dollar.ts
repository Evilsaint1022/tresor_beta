import { Message, Client } from "discord.js";

export default {

    data: {
        name: "test",
        description: "Test command with $ prefix",
        customPrefix: "$"
    },

    async execute( message: Message, client: Client, args: string[] ) {

        await message.reply({ content: "Test command executed with $ prefix!" });

    }

}