import "dotenv/config";
import { Client, Interaction } from "discord.js";
import chalk from "chalk";

const listenerSlashCommands = async (client: Client, commands: Map<any, any>) => {

    await client.on("interactionCreate", async (interaction: Interaction) => {

        if ( !interaction.isCommand() ) return;

        const command = commands.get(interaction.commandName);

        if ( !command ) return;

        try {
            
            await command.execute(interaction, client);

        } catch ( err ) {
            
            console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while executing /" + interaction.commandName));
            console.log()
            console.log(chalk.grey("------------------------------"))
            console.log()
            console.log(err);
            console.log()
            console.log(chalk.grey("------------------------------"))

            return;

        }

    });

}

export default listenerSlashCommands;