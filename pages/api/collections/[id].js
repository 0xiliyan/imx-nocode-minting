import {connection} from "../../../helpers/db";
import {getImxSDK} from "../../../helpers/utils";
import config from "../../../config";

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
    const result = await connection.query("SELECT collections.*, token_trackers.last_token_id FROM collections LEFT JOIN token_trackers ON token_trackers.collection_id = collections.id WHERE collections.id = ?",
        [req.query.id]
    );
    return res.status(200).json(result[0]);
}

const updateCollection = async (req, res) => {
    const {wallet, client} = await getImxSDK();

    let collection;
    try {
        collection = await client.updateCollection(req.body.imx_collection_id,{
            name: req.body.name,
            description: req.body.description,
            icon_url: req.body.icon_url,
            metadata_api_url: req.body.metadata_api_url,
            collection_image_url: req.body.collection_image_url,
        });

        // persist to database
        const result = await connection.query("UPDATE collections SET ? WHERE id = ?",
            [{
                name: req.body.name,
                description: req.body.description,
                icon_url: req.body.icon_url,
                metadata_api_url: req.body.metadata_api_url,
                collection_image_url: req.body.collection_image_url,
                collection_size: req.body.collection_size,
                mint_cost: parseFloat(req.body.mint_cost),
                max_mints_per_user: req.body.max_mints_per_user ? req.body.max_mints_per_user : null,
                mint_deposit_address: req.body.mint_deposit_address,
                mint_deposit_layer: req.body.mint_deposit_layer,
                royalty_receiver_address: req.body.royalty_receiver_address,
                royalty_percentage: parseFloat(req.body.royalty_percentage),
            }, req.query.id]);

        return res.status(200).json({collection_id: req.query.id});
    } catch (error) {
        res.status(200).json({error});
    }
}

const deleteCollection = async (req, res) => {
    const result = await connection.query("DELETE FROM collections WHERE id = ?", [req.query.id]);
    return res.status(204).json(result);
}

