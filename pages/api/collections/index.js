import {connection} from "../../../helpers/db";
import {getImxSDK} from "../../../helpers/utils";
import config from "../../../config";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return storeCollection(req, res);
    }
    else if (req.method === 'GET') {
        return getCollections(req, res);
    }
}

const storeCollection = async (req, res) => {
    const {wallet, client} = getImxSDK();

    let collection;
    try {
        collection = await client.createCollection({
            name: req.body.name,
            project_id: req.body.project_id,
            description: req.body.description,
            icon_url: req.body.icon_url,
            metadata_api_url: req.body.metadata_api_url,
            collection_image_url: req.body.collection_image_url,
            contract_address: config.tokenContractAddress,
            owner_public_key: wallet.publicKey,
        });

        // persist to database
        const result = await connection.query("INSERT INTO collections(name) VALUES(?)", [req.body.name]);

        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: JSON.stringify(error, null, 2)});
    }

    return res.status(200).json(result);
}

const getCollections = async (req, res) => {
    const result = await connection.query("SELECT * FROM collections LEFT JOIN token_trackers ON token_trackers.collection_id = collections.id");
    return res.status(200).json(result);
}

