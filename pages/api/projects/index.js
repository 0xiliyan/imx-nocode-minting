import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return storeProject(req, res);
    }
    else if (req.method === 'GET') {
        return getProjects(req, res);
    }
}

const storeProject = async (req, res) => {
    const result = await connection.query("INSERT INTO projects(name) VALUES(?)", [req.body.name]);

    return res.status(200).json(result);
}

const getProjects = async (req, res) => {
    const result = await connection.query("SELECT * FROM projects");
    return res.status(200).json(result);
}

