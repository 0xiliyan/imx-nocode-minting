import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return importTransactions(req, res);
    }
}

const importTransactions = async (req, res) => {
    // @todo migrate code from old repository
}

