import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import styled, { css } from 'styled-components';
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";

const Airdrop = () => {
    const router = useRouter();

    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (router.query.id) {
            loadCollection(router.query.id);
        }
    }, [router.query.id]);

    const loadCollection = async (collectionId) => {
        const {data} = await axios.get(`/api/collections/${collectionId}`);
        setCollection(data);
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Import CSV list of wallets for NFT Airdrop</Heading>
            <p><b>Step 1</b>: Import CSV sheet with two columns - first column is wallet address, second column is number of NFTs to mint for the wallet (e.g. 3)</p>
            <p><b>Step 2</b>: Click import button below to parse the CSV list and import into database.</p>
            <p><b>Step 3</b>: Mint NFTs from the collection mint page.</p>
            <Box mt="25" width="500px">
                <Input type="file" border="0" padding="0" />
                <Link href="/collections/create">
                    <Button colorScheme="blue" mt={15}>
                        Import CSV
                    </Button>
                </Link>
            </Box>
        </>
    )
}

export default Airdrop;
