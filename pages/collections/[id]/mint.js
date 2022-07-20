import React, { useState, useEffect, useRef } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import styled, { css } from 'styled-components';
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";
import {Img} from "@chakra-ui/image";
import {Section} from "../../../components/Layout";
import {Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/table";
import moment from "moment";
import config from "../../../config";

const MintedTokenId = styled.a`
    background: #3182CE;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
`

const Mint = () => {
    const router = useRouter();

    const [collection, setCollection] = useState({});
    const [lastTokenId, setLastTokenId] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [mintedTokens, setMintedTokens] = useState([]);
    const [notMintedTokens, setNotMintedTokens] = useState([]);
    const [notMintedSearch, setNotMintedSearch] = useState('');
    const [mintedSearch, setMintedSearch] = useState('');
    const [mintingResult, setMintingResult] = useState(null);
    const [walletRegistrationStatus, setWalletRegistrationStatus] = useState({});

    useEffect(() => {
        if (router.query.id) {
            getCollection();
            getNotMintedTokens();
            getMintedTokens();
        }
    }, [router.query.id]);

    useEffect(() => {
        if (router.query.id) {
            getNotMintedTokens(notMintedSearch);
        }
    }, [notMintedSearch]);

    useEffect(() => {
        if (router.query.id) {
            getMintedTokens(mintedSearch);
        }
    }, [mintedSearch]);

    const getCollection = async () => {
        const {data} = await axios.get(`/api/collections/${router.query.id}`);
        setCollection(data);
        setLastTokenId(data.last_token_id);
    }

    const readPaymentTransactions = async () => {
        setIsLoading(true);

        await axios.post(`/api/import-transactions${collection.mint_deposit_layer == 'l2' ? '-l2' : ''}`, {
            collection_id: collection.id
        });

        // load minted and not minted tokens
        await getNotMintedTokens();
        setIsLoading(false);
    }

    const mint = async () => {
        setMintingResult('');
        setIsLoading(true);
        const {data} = await axios.post(`/api/mint`, {
            collection_id: collection.id
        });

        if (data.result.error) {
            setMintingResult(<Box mt={15}><b><Text color="red" as="span">Error:</Text> {data.result.error}</b></Box>);
        }
        else if (data.result.success) {
            setMintingResult(<Box mt={15}><b><Text color="green" as="span">Success</Text>: {data.result.tokensMinted} tokens minted</b>. (please note that all wallets pending mints must be registered on IMX)</Box>);
            setLastTokenId(data.result.lastMintedId);

            // load minted and not minted tokens
            await getNotMintedTokens();
            await getMintedTokens();
        }

        setIsLoading(false);
    }

    const getNotMintedTokens = async (search = '') => {
        const {data} = await axios.get(`/api/mints?collection_id=${router.query.id}&type=not_minted&search=${search}`);
        setNotMintedTokens(data);
    }

    const getMintedTokens = async (search = '') => {
        const {data} = await axios.get(`/api/mints?collection_id=${router.query.id}&type=minted&search=${search}`);
        setMintedTokens(data);
    }

    const checkWalletRegistration = async (wallet) => {
        try {
            await axios.get(`https://api.${config.appNetwork == 'ropsten' ? 'ropsten.' : ''}x.immutable.com/v1/users/${wallet}`);
            setWalletRegistrationStatus({wallet, status: 'Registered'});
        }
        catch (error) {
            if (error.response.data.code == 'account_not_found') {
                setWalletRegistrationStatus({wallet, status: 'Not Registered'});
            }
        }

        setTimeout(() => {
            setWalletRegistrationStatus({});
        }, [3000]);
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>{collection.name} - Read L1/L2 Payment Transactions and Mint NFTs</Heading>
            <Heading as="h4" size="sm" mb={15}>Automatically reads Airdrop requests as well imported into database</Heading>
            <Box mt="25">
                <Section>
                    <Text>Collection is set up to accept NFT payment transactions for mints on <b>{collection.mint_deposit_layer == 'l1' ? 'Ethereum L1' : 'ImmutableX L2'}</b> to the following deposit address: <b>{collection.mint_deposit_address}</b>.
                    Mint cost is <b>{collection.mint_cost} ETH</b>.
                    </Text>
                    <Text mb={15}>Collection contract address on IMX is: <a href={`https://api.${config.appNetwork == 'ropsten' ? 'ropsten.' : ''}x.immutable.com/v1/assets?collection=${collection.imx_collection_id}&order_by=updated_at`} target="_blank"><b>{collection.imx_collection_id}</b></a>.</Text>
                    <Button colorScheme="blue" onClick={readPaymentTransactions} isLoading={isLoading}>Read Payment Transactions</Button>
                </Section>
            </Box>
            <Heading as="h3" size="md" mt={35}>Pending Mints</Heading>
            <Box mt="25">
                <Section>
                    <Input onChange={(e) => setNotMintedSearch(e.target.value)} value={notMintedSearch} placeholder="Search pending mints by wallet address" width="400px" mb="25" />
                    {notMintedTokens.length > 0 &&
                        <>
                            <TableContainer>
                                <Table variant='simple' size='sm'>
                                    <Thead>
                                        <Tr>
                                            <Th width="450px">Wallet</Th>
                                            <Th width="250px">Tokens To Mint</Th>
                                            <Th>ETH Paid</Th>
                                            <Th>Type</Th>
                                            <Th>Date Imported</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {notMintedTokens.map(mint =>
                                            <Tr key={mint.id}>
                                                <Td>{mint.wallet}</Td>
                                                <Td>{mint.tokens_allowed}</Td>
                                                <Td>{mint.tx_ether_value ? `${mint.tx_ether_value} ETH` : ''}</Td>
                                                <Td>{mint.tx_hash == 'airdrop' ? 'Airdrop' : 'Regular Mint'}</Td>
                                                <Td>{moment(mint.created_at).format('D MMMM YYYY')}</Td>
                                                <Td>
                                                    <Button colorScheme="blue" variant="outline"
                                                            onClick={() => checkWalletRegistration(mint.wallet)}>
                                                        {walletRegistrationStatus.wallet && walletRegistrationStatus.wallet == mint.wallet ?
                                                            <Text color={walletRegistrationStatus.status == 'Registered' ? 'green' : 'red'}>{walletRegistrationStatus.status}</Text> :
                                                            <Text>Check Wallet Registration on IMX</Text>
                                                        }
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Button colorScheme="blue" onClick={readPaymentTransactions} isLoading={isLoading} mt={35} onClick={mint}>Mint NFTs</Button>
                            {collection.royalty_receiver_address && collection.royalty_percentage && <Text my={15}>Royalty percentage of <b>{collection.royalty_percentage}%</b> will be included for wallet: <b>{collection.royalty_receiver_address}</b>.</Text>}
                            {mintingResult}
                        </>
                    }
                </Section>
            </Box>
            <Heading as="h3" size="md" mt={35}>Minted Tokens</Heading>
            <Box mt="25">
                <Section>
                    <Input onChange={(e) => setMintedSearch(e.target.value)} value={mintedSearch} placeholder="Search minted tokens by wallet address" width="400px" mb="25" />
                    {mintedTokens.length > 0 &&
                        <>
                        <TableContainer>
                            <Table variant='simple' size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th width="450px">Wallet</Th>
                                        <Th width="250px">Tokens Minted</Th>
                                        <Th>ETH Paid</Th>
                                        <Th>Type</Th>
                                        <Th>Mint Date</Th>
                                        <Th width="100px">Minted Token Ids</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {mintedTokens.map(mint => {
                                        const metadata = JSON.parse(mint.metadata);
                                        const tokenIds = metadata ? metadata.results.map(result => <MintedTokenId href={`https://api.${config.appNetwork == 'ropsten' ? 'ropsten.' : ''}x.immutable.com/v1/assets/${collection.imx_collection_id}/${result.token_id}`} target="_blank" style={{ marginRight: '10px'}}>{result.token_id}</MintedTokenId>) : '';

                                        return <Tr key={mint.id}>
                                            <Td>{mint.wallet}</Td>
                                            <Td>{mint.tokens_minted}</Td>
                                            <Td>{mint.tx_ether_value ? `${mint.tx_ether_value} ETH` : ''}</Td>
                                            <Td>{mint.tx_hash == 'airdrop' ? 'Airdrop' : 'Regular Mint'}</Td>
                                            <Td>{mint.last_minted_at ? moment(mint.last_minted_at).format('D MMMM YYYY') : ''}</Td>
                                            <Td>{tokenIds}</Td>
                                        </Tr>
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        </>
                    }
                </Section>
            </Box>
            {collection &&
                <>
                    <Heading as="h3" size="md" mt={35}>Last Minted Token ID</Heading>
                    <Box mt="25">
                        <Section>
                          <b>{lastTokenId ?? 'n/a'}</b>
                        </Section>
                    </Box>
                </>
            }
        </>
    )
}

export default Mint;
