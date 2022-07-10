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
        const result = await connection.query("INSERT INTO collections(imx_collection_id, name, project_id, description, icon_url, metadata_api_url, collection_image_url, collection_size, mint_cost, max_mints_per_user) VALUES(?,?,?,?,?,?,?,?,?,?)",
            [collection.address, req.body.name, req.body.project_id, req.body.description, req.body.icon_url, req.body.metadata_api_url, req.body.collection_image_url, req.body.collection_size, req.body.mint_cost, req.body.max_mints_per_user]);

        return res.status(200).json({collection_id: result.insertId});
    } catch (error) {
        res.status(200).json({error});
    }

    return res.status(200).json(result);
}

const getCollections = async (req, res) => {
    const result = await connection.query(`
        SELECT collections.*, projects.name as project_name, projects.imx_project_id, projects.company_name, projects.contact_email, token_trackers.last_token_id 
        FROM collections JOIN projects on collections.project_id = projects.id 
        LEFT JOIN token_trackers ON collections.id = token_trackers.collection_id 
        ORDER BY collections.name ASC
    `);

    return res.status(200).json(result);
}

