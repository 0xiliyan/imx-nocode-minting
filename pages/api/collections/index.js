import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return storeCollection(req, res);
    }
    else if (req.method === 'GET') {
        return getCollections(req, res);
    }
}

const storeCollection = async (req, res) => {
    const result = await connection.query("INSERT INTO collections(name) VALUES(?)", [req.body.name]);

    return res.status(200).json(result);
}

const getCollections = async (req, res) => {
    const result = await connection.query("SELECT * FROM collections LEFT JOIN token_trackers ON token_trackers.collection_id = collections.id");
    return res.status(200).json(result);
}

