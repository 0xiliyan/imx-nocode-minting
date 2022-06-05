import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return getCollection(req, res);
    }
    if (req.method === 'PUT') {
        return updateCollection(req, res);
    }
    if (req.method === 'DELETE') {
        return deleteCollection(req, res);
    }
}

const getCollection = async (req, res) => {
    const result = await connection.query("SELECT * FROM collections LEFT JOIN token_trackers ON token_trackers.collection_id = collections.id WHERE collections.id = ?",
        [req.query.id]
    );
    return res.status(200).json(result);
}

const updateCollection = async (req, res) => {
    const result = await connection.query("UPDATE collections SET ? WHERE id = ?", [req.body, req.query.id]);

    return res.status(200).json(result);
}

const deleteCollection = async (req, res) => {
    const result = await connection.query("DELETE FROM collections WHERE id = ?", [req.query.id]);
    return res.status(204).json(result);
}

