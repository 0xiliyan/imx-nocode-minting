import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import { ImmutableXClient, MintableERC721TokenType } from '@imtbl/imx-sdk';
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import {getImxSDK} from "../../helpers/utils";
import * as t from "io-ts";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return mint(req, res);
    }
}

const mint = async (req, res) => {
    const collectionId = req.body.collection_id;

    const result = await connection.query("SELECT * FROM collections WHERE id = ?",
        [collectionId]
    );
    const collection = result[0];

    const {provider, client} = await getImxSDK();

    // this function blocks until the transaction is either mined or rejected
    const waitForTransaction = async (promise) => {
        const txId = await promise;
        console.info('Waiting for transaction', 'TX id', txId);
        const receipt = await provider.waitForTransaction(txId);
        if (receipt.status === 0) {
            throw new Error('Transaction containing user registration rejected');
        }
        console.info('Transaction containing user registration TX mined: ' + receipt.blockNumber);
        return receipt;
    };

    const getTokensToMint = () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM mints WHERE collection_id = ? AND (tokens_allowed - tokens_minted) > 0 ORDER BY id ASC',
                [collectionId], (error, results, fields) => {
                    if (error) {
                        reject();
                        console.log(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    }

    const getLastMintedTokenId = () => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT last_token_id FROM token_trackers WHERE collection_id = ?',
                [collectionId], (error, results, fields) => {
                    if (error) {
                        reject();
                        console.log(error);
                    } else {
                        resolve(results[0].last_token_id);
                    }
                });
        });
    }

    const updateLastMintedTokenId = (newTokenId) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE token_trackers SET last_token_id = ? WHERE collection_id = ?',
                [newTokenId, collectionId], (error, results, fields) => {
                    if (error) {
                        reject();
                        console.log(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    }

    const updateUserTokensMinted = (recordId, newTokensMinted, metadata) => {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE mints SET tokens_minted = ?, metadata = ?, last_minted_at = ? WHERE id = ?',
                [newTokensMinted, JSON.stringify(metadata), new Date(), recordId], (error, results, fields) => {
                    if (error) {
                        reject();
                        console.log(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    }


    const main = async () => {
        const isRegistered = await client.isRegistered({user: client.address.toLowerCase()});

        // If the user is already registered, there's is no transaction to await, hence no tx_hash
        if (isRegistered) {
            console.info('Minter registered, continuing...');
        } else {
            // If the user isn't registered, we have to wait for the block containing the registration TX to be mined
            // This is a one-time process (per address)
            console.info('Waiting for minter registration...');

            const registerImxResult = await client.registerImx({
                // address derived from PK
                etherKey: client.address.toLowerCase(),
                starkPublicKey: client.starkPublicKey,
            });

            await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
        }

        let lastMintedId = await getLastMintedTokenId();
        const collectionCount = collection.collection_size;
        const batchSize = config.mintBatchSize;

        console.log('Reading tokens to mint ...')
        const tokenMintRequests = await getTokensToMint();

        let tokensMinted = 0;

        for (const tokenMintRequest of tokenMintRequests) {
            const userWalletAddress = tokenMintRequest.wallet.toLowerCase();
            let tokensToMintForCurrentUser = tokenMintRequest.tokens_allowed - tokenMintRequest.tokens_minted;

            try {
                // client.mint - (without the v2 prefix) is to be deprecated and replaced by mintv2
                //      - this method does not include royalty information
                const tokensToMint = [];
                for (let tokenIndex = 1; tokenIndex <= tokensToMintForCurrentUser; tokenIndex++) {
                    let tokenToMint = {
                        // token type (ERC721 NFT)
                        // type: MintableERC721TokenType.MINTABLE_ERC721,
                        // data describing this token
                        // address of the token's contract
                        // tokenAddress: collection.imx_collection_id.toLowerCase(),
                        // ID of the token (received as the 2nd argument in mintFor), positive integer string
                        id: '' + (lastMintedId + tokenIndex),
                        // blueprint - can't be left empty, but if you're not going to take advantage
                        // of on-chain metadata, just keep it to a minimum - in this case a single character
                        // gets passed as the 3rd argument formed as {tokenId}:{blueprint (whatever you decide to put in it when calling this function)}
                        blueprint: 'metadata',
                    };

                    // add royalties if specified
                    if (collection.royalty_receiver_address && collection.royalty_percentage) {
                        tokenToMint.royalties = [{recipient: collection.royalty_receiver_address, percentage: collection.royalty_percentage}];
                    }

                    tokensToMint.push(tokenToMint);

                    console.log(`Trying to mint token_id: #${lastMintedId + tokenIndex} ...`);
                }

                console.log(`Trying to mint for wallet: ${userWalletAddress} ...`);

                const result = await client.mintV2([{
                    "users": [
                        {
                            "tokens": tokensToMint,
                            "etherKey": userWalletAddress
                            // [{
                            //     "blueprint": "string",
                            //     "id": "string",
                            //     "royalties": [
                            //         {
                            //             "percentage": 100,
                            //             "recipient": "string"
                            //         }
                            //     ]
                            // }],
                        }
                    ],
                    "contractAddress": collection.imx_collection_id,
                    // global contract level royalties
                    "royalties": [
                        {
                            "percentage": 2,
                            "recipient": "0x18a17813021aF3096F0BFFF9BA09Da6Aab82Ac96"
                        }
                    ],
                }]);

                console.log('Minting success!', result);

                // update database token_tracker and user record
                lastMintedId += tokensToMintForCurrentUser;
                await updateLastMintedTokenId(lastMintedId);

                tokensMinted += tokensToMintForCurrentUser;
                await updateUserTokensMinted(tokenMintRequest.id, (tokenMintRequest.tokens_minted + tokensToMintForCurrentUser), result);

                if (lastMintedId >= collectionCount) {
                    console.log('Collection limit reached!');
                    return {error: 'Collection limit reached!'};
                }

                // operation can fail if the request is malformed or the tokenId provided already exists
            } catch(err) {
                console.error(`Minting failed for wallet ${userWalletAddress}. Make sure the asset you're trying to mint doesn't already exist!`);
                console.error('The following error was provided', err);
            }
        }

        return {success: true, tokensMinted};
    }

    const mintResult = await main();

    return res.status(200).json({result: mintResult});
}

