import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return getMints(req, res);
    }
}

const getMints = async (req, res) => {
    let result;

    if (req.query.type == 'minted') {
        result = await connection.query(`SELECT * FROM mints
            WHERE collection_id = ? AND tokens_minted >= tokens_allowed
            AND wallet LIKE ${connection.escape('%' + req.query.search.trim() + '%')}
            ORDER BY created_at DESC`,
            [req.query.collection_id]
        );
    }
    else if (req.query.type == 'not_minted') {
        result = await connection.query(`SELECT * FROM mints
            WHERE collection_id = ? AND tokens_minted < tokens_allowed
            AND wallet LIKE ${connection.escape('%' + req.query.search.trim() + '%')}
            ORDER BY created_at DESC`,
            [req.query.collection_id]
        );
    }

    return res.status(200).json(result);
}

