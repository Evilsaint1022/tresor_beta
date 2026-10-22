import { Client, Interaction } from "discord.js";
import chalk from "chalk";

const listenerComponents = async (client: Client, components: Map<string, any>) => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isMessageComponent() && !interaction.isModalSubmit()) return;

        const cId = interaction.customId.split(":")[0]
        
        const componentHandler = components.get(cId);
        
        if (!componentHandler) {
            return;
        }

        if ( interaction.customId.split(":").length >= 3 ) {
            return;
        }
        
        let componentArgs: Record<string, string> = {};
        const componentArgsString = interaction.customId.split(":")[1]

        if (componentArgsString) {
            const componentArgPairs = componentArgsString.includes("_")
                ? componentArgsString.split("_")
                : [componentArgsString];

            for (const argPair of componentArgPairs) {
                const [argKey, argVal] = argPair.split("=");
                if (argKey && argVal !== undefined) {
                    componentArgs[argKey] = argVal;
                }
            }
        }

        try {
            await componentHandler.execute(interaction, client, componentArgs);
        } catch (err) {
            console.log(chalk.red.bold("[🌿]") + " " + chalk.red(`Error executing component handler for customId: ${interaction.customId}`));
            console.log();
            console.log(chalk.grey("------------------------------"));
            console.log();
            console.log(err);
            console.log();
            console.log(chalk.grey("------------------------------"));

            if (interaction.isRepliable()) {
                try {
                    await interaction.reply({ content: "There was an error while executing this component interaction!", ephemeral: true });
                } catch (replyError) {
                    console.log(chalk.red.bold("[🌿]") + " " + chalk.red("Failed to send error reply to interaction."));
                    console.log(replyError);
                }
            }
        }

    }

    );
};

export default listenerComponents;
