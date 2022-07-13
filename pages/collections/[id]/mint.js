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

const Mint = () => {
    const router = useRouter();

    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [mintedTokens, setMintedTokens] = useState([]);
    const [notMintedTokens, setNotMintedTokens] = useState([]);

    useEffect(() => {
        if (router.query.id) {
            getCollection(router.query.id);
            getNotMintedTokens(router.query.id);
            getMintedTokens(router.query.id);
        }
    }, [router.query.id]);

    const getCollection = async (collectionId) => {
        const {data} = await axios.get(`/api/collections/${collectionId}`);
        setCollection(data);
    }

    const readPaymentTransactions = async () => {
        setIsLoading(true);

        await axios.post(`/api/import-transactions${collection.mint_deposit_layer == 'l2' ? '-l2' : ''}`, {
            collection_id: collection.id
        });

        // load minted and not minted tokens
        await getNotMintedTokens(collection.id);
        setIsLoading(false);
    }

    const getNotMintedTokens = async (collectionId) => {
        const {data} = await axios.get(`/api/mints?collection_id=${collectionId}&type=not_minted`);
        setNotMintedTokens(data);
    }

    const getMintedTokens = async (collectionId) => {
        const {data} = await axios.get(`/api/mints?collection_id=${collectionId}&type=minted`);
        setMintedTokens(data);
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>{collection.name} - Read L1/L2 Payment Transactions and Mint NFTs</Heading>
            <Heading as="h4" size="sm" mb={15}>Automatically reads Airdrop requests as well imported into database</Heading>
            <Box mt="25">
                <Section>
                    <Text mb={15}>Collection is set up to accept payment transactions on <b>{collection.mint_deposit_layer == 'l1' ? 'Ethereum L1' : 'ImmutableX L2'}</b> to the following deposit address: <b>{collection.mint_deposit_address}</b></Text>
                    <Button colorScheme="blue" onClick={readPaymentTransactions} isLoading={isLoading}>Read Payment Transactions</Button>
                </Section>
            </Box>
            {notMintedTokens.length > 0 &&
                <>
                    <Heading as="h3" size="md" mt={35}>Pending Mints</Heading>
                    <Box mt="25">
                        <Section>
                            <TableContainer>
                                <Table variant='simple' size='sm'>
                                    <Thead>
                                        <Tr>
                                            <Th width="450px">Wallet</Th>
                                            <Th width="250px">Tokens To Mint</Th>
                                            <Th>ETH Paid</Th>
                                            <Th>Type</Th>
                                            <Th>Date Imported</Th>
                                        </Tr>
                                        </Thead>
                                    <Tbody>
                                        {notMintedTokens.map(mint =>
                                            <Tr key={mint.id}>
                                                <Td>{mint.wallet}</Td>
                                                <Td>{mint.tokens_allowed}</Td>
                                                <Td>{mint.tx_ether_value} ETH</Td>
                                                <Td>{mint.tx_hash == 'airdrop' ? 'Airdrop' : 'Regular Mint'}</Td>
                                                <Td>{moment(mint.created_at).format('D MMMM YYYY')}</Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Button colorScheme="blue" onClick={readPaymentTransactions} isLoading={isLoading} mt={35}>Mint NFTs</Button>
                        </Section>
                    </Box>
                </>
            }
            {mintedTokens.length > 0 &&
            <>
                <Heading as="h3" size="md" mt={35}>Minted Tokens</Heading>
                <Box mt="25">
                    <Section>
                        <TableContainer>
                            <Table variant='simple' size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th width="450px">Wallet</Th>
                                        <Th width="250px">Tokens Minted</Th>
                                        <Th>ETH Paid</Th>
                                        <Th>Type</Th>
                                        <Th>Token Ids</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {mintedTokens.map(mint =>
                                        <Tr key={mint.id}>
                                            <Td>{mint.wallet}</Td>
                                            <Td>{mint.tokens_minted}</Td>
                                            <Td>{mint.tx_ether_value} ETH</Td>
                                            <Td>{mint.tx_hash == 'airdrop' ? 'Airdrop' : 'Regular Mint'}</Td>
                                            <Td>{mint.metadata ? mint.metadata : 'n/a'}</Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Section>
                </Box>
            </>
            }
            {collection &&
                <>
                    <Heading as="h3" size="md" mt={35}>Last Minted Token ID</Heading>
                    <Box mt="25">
                        <Section>
                          <b>{collection.last_token_id ? collection.last_token_id : 'n/a'}</b>
                        </Section>
                    </Box>
                </>
            }
        </>
    )
}

export default Mint;
