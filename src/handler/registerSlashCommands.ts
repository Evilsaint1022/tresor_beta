import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Client, Events, Routes } from "discord.js";
import config from "../config";
import fs from "fs";
import chalk from "chalk";

import listenerSlashCommands from "./listenerSlashCommands";

// REST ----------------------------------------------------------------------------

const restApi = new REST({ version: "10" }).setToken(process.env.CLIENT_TOKEN as string);

// Register slash commands ---------------------------------------------------------

const handlerRegisterSlashCommands = async (client: Client) => {

    if (!client.isReady()) {
        await new Promise((resolve) => client.once(Events.ClientReady, resolve));
    }

    const commands = new Map();
    const slashCommandsData = [];

    for (const directory of fs.readdirSync("./src/commands")) {

        if ( directory == ".DS_Store" ) continue;
        if ( directory.startsWith("src") ) continue;

        for (const file of fs.readdirSync("./src/commands/" + directory).filter((f) => f.endsWith(".ts"))) {

            try {

                const module = await import(`../commands/${directory}/${file}`);
                const command = module.default;

                if (
                    typeof command.data?.toJSON !== "function" ||
                    command.data.constructor.name !== "SlashCommandBuilder"
                ) {
                    continue;
                }

                commands.set(command.data.name, command);
                slashCommandsData.push(command.data);

            } catch (err) {

                console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while processing a slash command."));
                console.log();
                console.log(chalk.grey("------------------------------"));
                console.log();
                console.log(err);
                console.log();
                console.log(chalk.grey("------------------------------"));

            }

        }

    }

    try {

        if (!client.user?.id) return;

        if (config.guildId !== "") {

            await restApi.put(
                Routes.applicationGuildCommands(client.user.id, config.guildId),
                { body: slashCommandsData }
            );

        } else {

            await restApi.put(
                Routes.applicationCommands(client.user.id),
                { body: slashCommandsData }
            );

        }

    } catch (err) {

        console.log(chalk.red.bold("[🌿]") + " " + chalk.red("There was an error while registering slash commands."));
        console.log();
        console.log(chalk.grey("------------------------------"));
        console.log();
        console.log(err);
        console.log();
        console.log(chalk.grey("------------------------------"));

    }

    listenerSlashCommands(client, commands);

};

export default handlerRegisterSlashCommands;