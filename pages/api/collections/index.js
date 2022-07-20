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
    const {wallet, client} = await getImxSDK();

    let collection;
    let result;

    try {
        collection = await client.createCollection({
            name: req.body.name,
            project_id: req.body.imx_project_id,
            description: req.body.description,
            icon_url: req.body.icon_url,
            metadata_api_url: req.body.metadata_api_url,
            collection_image_url: req.body.collection_image_url,
            contract_address: config.tokenContractAddress,
            owner_public_key: wallet.publicKey,
        });

        // persist to database
        result = await connection.query("INSERT INTO collections(app_network, imx_collection_id, contract_owner_address, contract_owner_private_key, name, project_id, description, icon_url, metadata_api_url, collection_image_url, collection_size, mint_cost, max_mints_per_user, mint_deposit_address, mint_deposit_layer, royalty_receiver_address, royalty_percentage) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [config.appNetwork, collection.address, config.minterAddress, config.minterPrivateKey, req.body.name, req.body.project_id, req.body.description, req.body.icon_url, req.body.metadata_api_url, req.body.collection_image_url, req.body.collection_size, parseFloat(req.body.mint_cost), req.body.max_mints_per_user, req.body.mint_deposit_address, req.body.mint_deposit_layer, req.body.royalty_receiver_address, req.body.royalty_percentage ? parseFloat(req.body.royalty_percentage) : null]);

        // create token_trackers record for this collection
        return res.status(200).json({collection_id: result.insertId});
    } catch (error) {
        res.status(200).json({error});
    }

    return res.status(200).json(result);
}

const getCollections = async (req, res) => {
    const result = await connection.query(`
        SELECT collections.*, projects.name as project_name, projects.imx_project_id, projects.company_name, projects.contact_email
        FROM collections JOIN projects on collections.project_id = projects.id 
        WHERE app_network = ?
        ORDER BY collections.name ASC
    `, [config.appNetwork]);

    return res.status(200).json(result);
}

