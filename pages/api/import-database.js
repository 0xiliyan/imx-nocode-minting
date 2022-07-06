import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import {updateConfig} from "../../helpers/utils";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return importDatabase(req, res);
    }
}

const importDatabase = async (req, res) => {
    try {
        const results = await connection.query(schema.sql);

        const newConfig = {...config};
        newConfig.databaseImported = true;
        updateConfig(newConfig);

        return res.status(200).json({result: true});
    } catch (error) {
        return res.status(500).json({result: false, message: error.message});
    }
}

