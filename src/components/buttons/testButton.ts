import { ButtonInteraction, Client, MessageFlags } from "discord.js";

export default {

    customId: "test_button",

    async execute(interaction: ButtonInteraction, client: Client, args: Record<string, string>) {
        await interaction.reply({ content: "Test button clicked! Name: " + args.name, flags: [MessageFlags.Ephemeral] });
    },

};
