import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return publishContract(req, res);
    }
}

const publishContract = async (req, res) => {
    // publish IXM contract
}
