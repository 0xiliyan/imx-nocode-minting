import fs from "fs";
import path from "path";
import {connection} from "../../helpers/db";
import config from "../../config";
import csv from "fast-csv";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return importAirdrop(req, res);
    }
}

/**
 * Import mint jobs from a CSV file with the following format: wallet, tokens_allowed
 * Can be used for free mints in marketing campaigns, influencers, etc.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const importAirdrop = async (req, res) => {
    const projectId = req.query.project_id;
    const airdrops = await readCsv(path.resolve('storage/airdrop.csv'));

    airdrops.forEach(airdrop => {
        connection.query('INSERT INTO mints SET project_id = ?, tx_hash = ?, wallet = ?, tokens_allowed = ?',
            [projectId, 'airdrop', airdrop[0], airdrop[1]], (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`Wallet ${airdrop[0]} added to airdrop with tokens to mint: ${airdrop[1]}`);
                }
            });
    });
}

const readCsv = (filepath) => {
    return new Promise((resolve, reject) => {
        let airdrops = [];

        fs.createReadStream(filepath)
        .pipe(csv.parse({ headers: false }))
        .on('error', error => reject)
        .on('data', row => {
            airdrops.push(row);
        })
        .on('end', rowCount => {
            resolve(airdrops);
            console.log(`Parsed ${rowCount} rows`)
        });
    });
}
