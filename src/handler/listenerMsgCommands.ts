import "dotenv/config";
import { Client, Message } from "discord.js";
import chalk from "chalk";
import config from "../config";

const listenerMsgCommands = async (client: Client, commands: Map<any, any>, guildOnly: boolean) => {

    client.on("messageCreate", async (message: Message) => {

        if (message.author.bot) return;

        if ( guildOnly ) {

            if ( message.guild?.id !== config.guildId ) return;

        }

        if ( message.content.startsWith(config.messageCommandPrefix) ) {

            const commandName = message.content.slice(config.messageCommandPrefix.length).split(" ")[0];
            const commandKey = `${config.messageCommandPrefix}${commandName}`;
            const command = commands.get(commandKey);

            if ( !command ) return;

            try {

                await command.execute(message, client, message.content.split(" ").slice(1));

            } catch ( err ) {

                console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while executing " + message.content.split(" ")[0]));
                console.log()
                console.log(chalk.grey("------------------------------"))
                console.log()
                console.log(err);
                console.log()
                console.log(chalk.grey("------------------------------"))

                return;

            }

            return;

        };

        for (const [commandKey, cmd] of commands.entries()) {

            if (cmd.data.customPrefix && message.content.startsWith(cmd.data.customPrefix)) {
                const commandName = message.content.slice(cmd.data.customPrefix.length).split(" ")[0];
                
                if (commandKey === `${cmd.data.customPrefix}${commandName}`) {
                    try {
                        await cmd.execute( message, client, message.content.slice(cmd.data.customPrefix.length).trim().split(" ") );
                    } catch (err) {
                        console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while executing " + message.content.split(" ")[0]));
                        console.log();
                        console.log(chalk.grey("------------------------------"));
                        console.log();
                        console.log(err);
                        console.log();
                        console.log(chalk.grey("------------------------------"));
                    }
                    return;
                }
            }
        }

    });

}

export default listenerMsgCommands;