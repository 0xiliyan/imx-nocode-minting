import schema from "../../database/schema.js";
import {connection} from "../../helpers/db";
import config from "../../config";
import { ImmutableXClient, MintableERC721TokenType } from '@imtbl/imx-sdk';
import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import {getImxSDK} from "../../helpers/utils";

export default function handler(req, res) {
    if (req.method === 'POST') {
        return mint(req, res);
    }
}

const mint = async (req, res) => {
    const collectionId = req.query.collection_id;
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
            connection.query('UPDATE mints SET tokens_minted = ?, metadata = ? WHERE id = ?',
                [newTokensMinted, JSON.stringify(metadata), recordId], (error, results, fields) => {
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
        // Registering the user (owner of the contract) with IMX
        const registerImxResult = await client.registerImx({
            // address derived from PK
            etherKey: client.address.toLowerCase(),
            starkPublicKey: client.starkPublicKey,
        });

        // If the user is already registered, there's is no transaction to await, hence no tx_hash
        if (registerImxResult.tx_hash === '') {
            console.info('Minter registered, continuing...');
        } else {
            // If the user isn't registered, we have to wait for the block containing the registration TX to be mined
            // This is a one-time process (per address)
            console.info('Waiting for minter registration...');
            await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
        }

        let lastMintedId = await getLastMintedTokenId();
        const collectionCount = config.collectionCount;
        const batchSize = config.mintBatchSize;

        while (true) {

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
                        tokensToMint.push({
                            // token type (ERC721 NFT)
                            type: MintableERC721TokenType.MINTABLE_ERC721,
                            // data describing this token
                            data: {
                                // address of the token's contract
                                tokenAddress: isRopsten ? config.tokenContractAddressRopsten.toLowerCase() : config.tokenContractAddress.toLowerCase(),
                                // ID of the token (received as the 2nd argument in mintFor), positive integer string
                                id: '' + (lastMintedId + tokenIndex),
                                // blueprint - can't be left empty, but if you're not going to take advantage
                                // of on-chain metadata, just keep it to a minimum - in this case a single character
                                // gets passed as the 3rd argument formed as {tokenId}:{blueprint (whatever you decide to put in it when calling this function)}
                                blueprint: 'metadata',
                            },
                        });

                        console.log(`Trying to mint token_id: #${lastMintedId + tokenIndex} ...`);
                    }

                    console.log(`Trying to mint for wallet: ${userWalletAddress} ...`);

                    const result = await client.mint({
                        mints: [
                            {
                                // address of the (IMX registered!) user we want to mint this token to
                                // received as the first argument in mintFor() inside your L1 contract
                                etherKey: userWalletAddress,
                                // list of tokens to be minted
                                tokens: tokensToMint,
                                // nonce - a random positive integer (in this case a number between 0 - 1000), has to be a string!
                                nonce: '' + Math.floor(Math.random() * 10000),
                                // authSignature - to be left empty **ONLY BECAUSE** IMX's SDK takes care of signing it (signature must be present for EVERY SINGLE MINTing op.)
                                authSignature: '',
                            },
                        ],
                    });

                    console.log('Minting success!', result);

                    // update database token_tracker and user record
                    lastMintedId += tokensToMintForCurrentUser;
                    await updateLastMintedTokenId(lastMintedId);

                    tokensMinted += tokensToMintForCurrentUser;
                    await updateUserTokensMinted(tokenMintRequest.id, (tokenMintRequest.tokens_minted + tokensToMintForCurrentUser), result);

                    if (tokensMinted >= batchSize) {
                        console.log(`Batch limit size of ${batchSize} mints exceeded!`);
                        process.exit(0);
                    }

                    if (lastMintedId >= collectionCount) {
                        console.log('Collection limit reached!');
                        process.exit(0);
                    }

                    // operation can fail if the request is malformed or the tokenId provided already exists
                } catch(err) {
                    console.error(`Minting failed for wallet ${userWalletAddress}. Make sure the asset you're trying to mint doesn't already exist!`);
                    console.error('The following error was provided', err);
                }
            }

            await sleep(5000);
        }
    }

    main();
}

