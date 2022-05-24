import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return importDatabase(req, res);
    }
}

const importDatabase = async (req, res) => {
    try {
        const results = await connection.query(schema.sql);
        return res.status(200).json({result: true});
    } catch (error) {
        return res.status(500).json({result: false, message: error.message});
    }
}

