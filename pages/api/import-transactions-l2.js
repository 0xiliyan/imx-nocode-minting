import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import axios from "axios";
import {sleep} from "../../helpers/utils";
import {ethers} from "ethers";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return importTransactionsL2(req, res);
    }
}

/**
 * Import payment transactions from IMX L2
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const importTransactionsL2 = async (req, res) => {
    const projectId = req.query.collection_id;
    let cursor = '';
    let remaining = 1;

    while (true) {
        console.log('Looking for transactions to import ...');

        while (remaining > 0) {
            const {data} = await axios.get(`https://api.ropsten.x.immutable.com/v1/transfers?receiver=${config.minterAddress}&status=success&token_type=ETH&cursor=${cursor}`);
            const transactions = data.result;

            transactions.forEach(async (transaction) => {
                const etherValue = parseFloat(ethers.utils.formatEther(transaction.token.data.quantity));
                const tokensAllowed = etherValue / config.mintCost;

                await connection.query('INSERT INTO mints SET project_id = ?, tx_hash = ?, wallet = ?, tokens_allowed = ?, tx_ether_value = ?',
                    [projectId, transaction.transaction_id, transaction.user, tokensAllowed, etherValue], (error, results, fields) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(`Transfer from wallet ${transaction.user} for ${etherValue} has been imported. IMX Transaction has: ${transaction.transaction_id}`);
                        }
                    });
            });

            // cursor for next page
            cursor = data.cursor;
            remaining = data.remaining;
        } // while we have new pages to fetch

        console.log('Waiting before poll ...');
        await sleep(60000);
    }

    return res.status(200).json({result: true});
}

