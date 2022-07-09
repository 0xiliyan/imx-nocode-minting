import {connection} from "../../../helpers/db";
import {getImxSDK} from "../../../helpers/utils";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return storeProject(req, res);
    }
    else if (req.method === 'GET') {
        return getProjects(req, res);
    }
}

const storeProject = async (req, res) => {
    const {provider, client} = await getImxSDK();

    let project;
    try {
        // create project at IMX
        project = await client.createProject({
            name: req.body.name,
            company_name: req.body.company_name,
            contact_email: req.body.contact_email,
        });

        // persist to database
        const result = await connection.query("INSERT INTO projects(imx_project_id, name, company_name, contact_email) VALUES(?,?,?,?)", [project.id, req.body.name, req.body.company_name, req.body.contact_email]);

        return res.status(200).json({
            project_id: result.insertId,
            imx_project_id: project.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: JSON.stringify(error, null, 2)});
    }
}

const getProjects = async (req, res) => {
    const result = await connection.query("SELECT * FROM projects");
    return res.status(200).json(result);
}

