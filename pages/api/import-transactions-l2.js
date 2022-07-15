import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import axios from "axios";
import {sleep} from "../../helpers/utils";
import {ethers} from "ethers";

export default function handler(req, res) {
    if (req.method === 'POST') {
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
    const collectionId = req.body.collection_id;
    const result = await connection.query("SELECT * FROM collections WHERE id = ?",
        [collectionId]
    );
    const collection = result[0];

    let cursor = '';
    let remaining = 1;

    while (remaining > 0) {
        const url = `https://api.${config.appNetwork == 'ropsten' ? 'ropsten.' : ''}x.immutable.com/v1/transfers?receiver=${collection.mint_deposit_address}&status=success&token_type=ETH&cursor=${cursor}`;
        const {data} = await axios.get(url);
        const transactions = data.result;

        transactions.forEach(async (transaction) => {
            const etherValue = parseFloat(ethers.utils.formatEther(transaction.token.data.quantity));
            const tokensAllowed = etherValue / collection.mint_cost;

            // at least one token is allowed to be minted
            if (tokensAllowed >= 1) {
                await connection.query('INSERT INTO mints SET collection_id = ?, tx_hash = ?, wallet = ?, tokens_allowed = ?, tx_ether_value = ?',
                    [collectionId, transaction.transaction_id, transaction.user, tokensAllowed, etherValue], (error, results, fields) => {
                        if (error) {
                            // console.log(error);
                        } else {
                            console.log(`Transfer from wallet ${transaction.user} for ${etherValue} has been imported. IMX Transaction hash: ${transaction.transaction_id}`);
                        }
                });
            }
        });

        // cursor for next page
        cursor = data.cursor;
        remaining = data.remaining;
    } // while we have new pages to fetch

    return res.status(200).json({result: true});
}

