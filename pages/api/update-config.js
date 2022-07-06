import fs from "fs";
import path from "path";
import {connection} from "../../helpers/db";
import config from "../../config";
import util from "util";
import {updateConfig} from "../../helpers/utils";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return saveConfig(req, res);
    }
}

/**
 * Update js config
 */
const saveConfig = async (req, res) => {
    const newConfig = req.body.config;
    updateConfig(newConfig);

    return res.status(200).json({result: true});
}
