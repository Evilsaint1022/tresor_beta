import "dotenv/config";
import { Client, Events } from "discord.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

import listenerComponents from "./listenerComponents";

const handlerRegisterComponents = async (client: Client) => {
    if (!client.isReady()) {
        await new Promise((resolve) => client.once(Events.ClientReady, resolve));
    }

    const components = new Map<string, any>();
    const componentsBaseDir = path.join("./src/components");

    for ( const typeDir of fs.readdirSync(componentsBaseDir) ) {

        if ( typeDir == ".DS_Store" ) continue;
        if ( typeDir.startsWith("src") ) continue;
        
        const typeDirPath = path.join(componentsBaseDir, typeDir);
        if (!fs.statSync(typeDirPath).isDirectory()) continue;

        for ( const componentFile of fs.readdirSync(typeDirPath).filter(file => file.endsWith(".js") || file.endsWith(".ts")) ) { // e.g., componentFile = "testButton.ts"
            try {
                const importPath = `../components/${typeDir}/${componentFile}`;
                const module = await import(importPath);
                const component = module.default;

                if (component && typeof component.customId === 'string' && typeof component.execute === 'function') {
                    components.set(component.customId, component);
                } else {
                    console.log(chalk.yellow.bold("[🌿]") + " " + chalk.yellow(`Skipping component file due to missing customId or execute function: ${componentFile}`));
                }
            } catch (err) {
                console.log(chalk.red.bold("[🌿]") + " " + chalk.red(`Error registering component from file: ${componentFile}`));
                console.log();
                console.log(chalk.grey("------------------------------"));
                console.log(err);
                console.log();
                console.log(chalk.grey("------------------------------"));
            }
        }
    }

    listenerComponents(client, components);
};

export default handlerRegisterComponents;
