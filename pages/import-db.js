import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container} from "@chakra-ui/layout";
import config from "../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {Section} from "../components/Layout";

const ImportDatabase = () => {
    const [currentConfig, setCurrentConfig] = useState(config);
    const [databaseImported, setDatabaseImported] = useState(config.databaseImported);
    const [isLoading, setIsLoading] = useState(false);

    const updateConfig = (key, value) => {
        const newConfig = {...currentConfig};
        newConfig[key] = value;
        setCurrentConfig(newConfig);
    }

    const importDb = async () => {
        setIsLoading(true);
        const response = await axios.post('/api/import-database');

        if (response.data.result) {
            setDatabaseImported(true);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Import Database</Heading>
            <Heading as="h4" size="xs" mb={15}>Create database tables to enable NFT minting and management</Heading>
            <Box width="700px">
                <Section>
                    {databaseImported ?
                        <Alert status='success' variant='subtle' mt={5}>
                            <AlertIcon />
                            Database Imported!
                        </Alert> :
                        <Button colorScheme="blue" onClick={importDb} isLoading={isLoading}>Import</Button>
                    }
                </Section>
            </Box>
        </>
    )
}

export default ImportDatabase;
