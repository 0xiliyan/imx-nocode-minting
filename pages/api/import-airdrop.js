import fs from "fs";
import path from "path";
import {connection} from "../../helpers/db";
import * as csv from "fast-csv";
import { createRouter } from "next-connect";
import multer from 'multer';
import {ethers} from "ethers";

const upload = multer({
    storage: multer.diskStorage({
        destination: './storage/airdrops',
        filename: (req, file, cb) => cb(null, 'import.csv'),
    }),
});
const uploadMiddleware = upload.single('airdrop');

const apiRoute = createRouter();
apiRoute.use(uploadMiddleware).post(async (req, res) => {
    const processed = await importAirdrop(req, res);

    return res.json({processed});
});

// create a handler from router with custom
// onError and onNoMatch
export default apiRoute.handler({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
});

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

/**
 * Import mint jobs from a CSV file with the following format: wallet, tokens_allowed
 * Can be used for free mints in marketing campaigns, influencers, etc.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const importAirdrop = async (req, res) => {
    const collectionId = req.body.collection_id;
    const airdrops = await readCsv(path.resolve('storage/airdrops/import.csv'));

    airdrops.forEach(airdrop => {
        if (ethers.utils.isAddress(airdrop[0]) && !isNaN(airdrop[1])) {
            connection.query('INSERT INTO mints SET collection_id = ?, tx_hash = ?, wallet = ?, tokens_allowed = ?',
                [collectionId, 'airdrop', airdrop[0], airdrop[1]], (error, results, fields) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Wallet ${airdrop[0]} added to airdrop with tokens to mint: ${airdrop[1]}`);
                    }
                });
        }
    });

    return airdrops.length;
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
            console.log(`Parsed ${rowCount} rows`);
        });
    });
}
