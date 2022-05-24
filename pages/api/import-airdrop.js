import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return importAirdrop(req, res);
    }
}

const importAirdrop = async (req, res) => {
    // @todo migrate code from old repository
}

