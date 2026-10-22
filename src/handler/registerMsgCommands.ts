import "dotenv/config";
import { Client, Events } from "discord.js";
import config from "../config";
import fs from "fs";
import chalk from "chalk";

import listenerMsgCommands from "./listenerMsgCommands";

const handlerRegisterMsgCommands = async (client: Client) => {

    if (!client.isReady()) {
        await new Promise((resolve) => client.once(Events.ClientReady, resolve));
    }
        
    const commands = new Map();
    
    for (const directory of fs.readdirSync("./src/commands")) {

        if ( directory == ".DS_Store" ) continue;
        if ( directory.startsWith("src") ) continue;
    
        for (const file of fs.readdirSync("./src/commands/" + directory).filter((f) => f.endsWith(".ts"))) {

            try {

                const module = await import(`../commands/${directory}/${file}`);
                const command = module.default;

                if (
                    typeof command.data?.toJSON === "function" &&
                    command.data.constructor.name === "SlashCommandBuilder"
                ) {
                    continue;
                }

                const commandPrefix = command.data.customPrefix || config.messageCommandPrefix;
                const commandKey = `${commandPrefix}${command.data.name}`;
                
                commands.set(commandKey, command);

                if ( config.guildId !== "" ) {

                    if (!client.user?.id) return;

                    await commands.set(commandKey, command);

                } else {

                    if (!client.user?.id) return;

                    await commands.set(commandKey, command);

                }

            } catch ( err ) {
                
                console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while registering a message command."));
                console.log()
                console.log(chalk.grey("------------------------------"))
                console.log()
                console.log(err);
                console.log()
                console.log(chalk.grey("------------------------------"))

            }

        }

    }

    if (  config.guildId !== "" ) {

        listenerMsgCommands(client, commands, true);

    } else {

        listenerMsgCommands(client, commands, false);

    }

}

export default handlerRegisterMsgCommands;