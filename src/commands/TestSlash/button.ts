import { ChatInputCommandInteraction, Client, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, MessageFlags } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("testbutton")
        .setDescription("Sends a test button"),

    async execute(interaction: ChatInputCommandInteraction, client: Client) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("test_button:name=" + interaction.user.displayName)
                .setLabel("Test Button")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: "Click the button below!",
            components: [row],
            flags: [MessageFlags.Ephemeral]
        });
    }
};