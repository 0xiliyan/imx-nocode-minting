import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import axios from "axios";
import ethers from "ethers";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return importTransactions(req, res);
    }
}

/**
 * Import payment transactions from ETH Mainnet using Etherscan API
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const importTransactions = async (req, res) => {
    const etherscanApi = config.appNetwork === 'mainnet' ? config.etherscanApi : config.etherscanApiRopsten;

    // poll etherscan API for new transactions
    while (true) {
        console.log('Looking for transactions to import ...');

        await axios.get(`${etherscanApi}?module=account&action=txlist&address=${config.mintDepositAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${config.etherscanApiKey}`)
        .then(response => {
            if (response.data.status == '1') {
                response.data.result.forEach(async (tx) => {
                    if (tx.isError == '0'
                        && tx.txreceipt_status == '1'
                        && tx.to.toLowerCase() == config.mintDepositAddress.toLowerCase()
                    ) {
                        const etherValue = parseFloat(ethers.utils.formatEther(tx.value));
                        const tokensAllowed = etherValue / config.mintCost;

                        await connection.query('INSERT INTO mints SET project_id = ?, tx_hash = ?, wallet = ?, tokens_allowed = ?, block_number = ?, tx_ether_value = ?',
                            [req.query.project_id, tx.hash, tx.from, tokensAllowed, tx.blockNumber, etherValue], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(`Transfer from wallet ${tx.from} for ${etherValue} has been imported. Transaction has: ${tx.hash}`);
                                }
                            });
                    }
                });
            } else {
                console.error(`Etherscan api error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(error);
        });

        await sleep(60000);
    }
}

