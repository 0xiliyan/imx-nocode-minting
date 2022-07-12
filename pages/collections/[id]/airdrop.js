import React, { useState, useEffect, useRef } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import styled, { css } from 'styled-components';
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";
import {Img} from "@chakra-ui/image";

const Airdrop = () => {
    const router = useRouter();
    const fileUpload = useRef(null);

    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [processedRows, setProcessedRows] = useState();

    useEffect(() => {
        if (router.query.id) {
            loadCollection(router.query.id);
        }
    }, [router.query.id]);

    const loadCollection = async (collectionId) => {
        const {data} = await axios.get(`/api/collections/${collectionId}`);
        setCollection(data);
    }

    const onChangeHandler = async (event) => {
        if (!event.target.files?.length) {
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('airdrop', event.target.files[0]);
        formData.append('collection_id', collection.id);

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (event) => {
                console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
            },
        };

        const {data} = await axios.post('/api/import-airdrop', formData, config);

        setProcessedRows(data.processed);
        setIsLoading(false);

        // reset file upload field
        fileUpload.current.value = '';
    };

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>{collection.name} - Import CSV list of wallets for NFT Airdrop</Heading>
            <p><b>Step 1</b>: Import CSV sheet with two columns - first column is wallet address, second column is number of NFTs to mint for the wallet (e.g. 3). No need for column headers.</p>
            <p><b>Step 2</b>: Click import button below to parse the CSV list and import into database.</p>
            <p><b>Step 3</b>: Mint NFTs from the collection's mint page <Link href={`/collections/${collection.id}/mint`}><b style={{cursor: "pointer"}}>here</b></Link>.</p>

            <Box my={25}>
                <Box mb={5}>Example CSV sheet screenshot below:</Box>
                <Img src="/img/import-airdrop-example.png" />
            </Box>
            <Box mt="25" width="500px">
                <form>
                    <Input type="file" name="airdrop" ref={fileUpload} accept=".csv" border="0" padding="0" onChange={onChangeHandler} hidden  />
                    <Button colorScheme="blue" onClick={() => fileUpload.current.click()} isLoading={isLoading}>
                        Import CSV
                    </Button>
                    {processedRows &&
                    <Box mt={5}><b>Imported rows for airdrop: {`${processedRows}`}</b></Box>
                    }
                </form>
            </Box>
        </>
    )
}

export default Airdrop;
