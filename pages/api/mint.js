import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return mint(req, res);
    }
}

const mint = async (req, res) => {
    // @todo migrate code from old repository
}

