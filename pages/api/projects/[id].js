import {connection} from "../../../helpers/db";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return getProject(req, res);
    }
    if (req.method === 'PUT') {
        return updateProject(req, res);
    }
    if (req.method === 'DELETE') {
        return deleteProject(req, res);
    }
}

const getProject = async (req, res) => {
    const result = await connection.query("SELECT * FROM projects WHERE id = ?",
        [req.query.id]
    );
    return res.status(200).json(result);
}

const updateProject = async (req, res) => {
    const result = await connection.query("UPDATE projects SET ? WHERE id = ?", [req.body, req.query.id]);

    return res.status(200).json(result);
}

const updateProject = async (req, res) => {
    const result = await connection.query("DELETE FROM projects WHERE id = ?", [req.query.id]);
    return res.status(204).json(result);
}

