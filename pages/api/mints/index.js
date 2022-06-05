import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return getMints(req, res);
    }
}

const getMints = async (req, res) => {
    const result = await connection.query("SELECT * FROM mints WHERE collection_id = ?", [req.query.collection_id]);
    return res.status(200).json(result);
}

