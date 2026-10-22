import DotDB from "dotdatabase";

const database = {

    config: new DotDB("src/database/config.json")

}

export default database;