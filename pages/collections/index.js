import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import config from "../../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";
import {NumberInput} from "@chakra-ui/number-input";
import Link from "next/link";
import {Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/table";
import {Section} from "../../components/Layout";

const Collections = () => {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        const response = await axios.get('/api/collections');
        setCollections(response.data);
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>NFT Collections</Heading>
            <Section>
                <TableContainer>
                <Table variant='simple' size='sm'>
                    <TableCaption>Your Collections on ImmutableX</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Contract Address</Th>
                            <Th>Project</Th>
                            <Th>NFT Collection Size</Th>
                            <Th>Mint Cost</Th>
                            <Th>Max Mints</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {collections.map(collection =>
                            <Tr key={collection.id}>
                                <Td>{collection.name}</Td>
                                <Td>{collection.imx_collection_id}</Td>
                                <Td>{collection.project_name}</Td>
                                <Td>{collection.collection_size}</Td>
                                <Td>{collection.mint_cost} ETH</Td>
                                <Td>{collection.max_mints_per_user ? `${collection.max_mints_per_user} per user` : 'unlimited'}</Td>
                                <Td>
                                    <Link href="/collections/create">
                                        <Button colorScheme="blue" variant="outline" mr={5}>Mint</Button>
                                    </Link>
                                    <Link href={`/collections/${collection.id}/airdrop`}>
                                        <Button colorScheme="blue" variant="outline" mr={5}>Airdrop</Button>
                                    </Link>
                                    <Link href={`/collections/${collection.id}/update`}>
                                        <Button colorScheme="blue" variant="outline" mr={5}>Edit</Button>
                                    </Link>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            </Section>
            <Box mt="25" width="500px">
                <Link href="/collections/create">
                    <Button colorScheme="blue">
                        Create Collection
                    </Button>
                </Link>
            </Box>
        </>
    )
}

export default Collections;
