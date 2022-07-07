import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Text} from "@chakra-ui/layout";
import config from "../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";

const Home = () => {
    const [currentConfig, setCurrentConfig] = useState({...config, generalConfigUpdated: true});
    const [configSaved, setConfigSaved] = useState(false);
    const [formHasErrors, setFormHasErrors] = useState(false);

    const updateConfig = (key, value) => {
        const newConfig = {...currentConfig};
        newConfig[key] = value;
        setCurrentConfig(newConfig);
    }

    const saveConfig = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);
            const response = await axios.post('/api/update-config', {config: currentConfig});

            if (response.data.result) {
                setConfigSaved(true);
                setTimeout(() => {
                    setConfigSaved(false);
                }, 2000);
            }
        }
        else {
            setFormHasErrors(true);
        }
    }

    const checkIsFormValid = () => {
        return (currentConfig.appNetwork && currentConfig.dbName && currentConfig.dbUser && currentConfig.dbPass
            && currentConfig.alchemyApiKey && currentConfig.alchemyRopstenApiKey && currentConfig.infuraApiUrl
            && currentConfig.infuraApiUrlRopsten && currentConfig.etherscanApiKey) ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>General Config</Heading>
            <Heading as="h4" size="xs" mb={15}>Set up the configuration below in order to start minting</Heading>
            <Box mt="15" width="500px">
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>ETH Network</FormLabel>
                    <Select onChange={(e) => updateConfig('appNetwork', e.target.value)} value={currentConfig.appNetwork}>
                        <option value='ropsten'>Ropsten</option>
                        <option value='mainnet'>Mainnet</option>
                    </Select>
                    <FormHelperText>Ropsten for test or Mainnet for production</FormHelperText>
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Database Name</FormLabel>
                    <Input onChange={(e) => updateConfig('dbName', e.target.value)} value={currentConfig.dbName} isInvalid={formHasErrors && !currentConfig.dbName} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Database User</FormLabel>
                    <Input onChange={(e) => updateConfig('dbUser', e.target.value)} value={currentConfig.dbUser} isInvalid={formHasErrors && !currentConfig.dbUser} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Database Pass</FormLabel>
                    <Input type="password" onChange={(e) => updateConfig('dbPass', e.target.value)} value={currentConfig.dbPass} isInvalid={formHasErrors && !currentConfig.dbPass} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Alchemy API Key</FormLabel>
                    <Input placeholder="e.g. https://eth-mainnet.alchemyapi.io/v2/your_api_key" onChange={(e) => updateConfig('alchemyApiKey', e.target.value)} value={currentConfig.alchemyApiKey} isInvalid={formHasErrors && !currentConfig.alchemyApiKey} />
                    <FormHelperText>Generate API key for ETH Mainnet on <a href="https://www.alchemy.com" target="_blank">alchemy.com</a> if you don't have one.</FormHelperText>
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Alchemy API Key (Ropsten)</FormLabel>
                    <Input placeholder="e.g. https://eth-mainnet.alchemyapi.io/v2/your_api_key" onChange={(e) => updateConfig('alchemyRopstenApiKey', e.target.value)} value={currentConfig.alchemyRopstenApiKey} isInvalid={formHasErrors && !currentConfig.alchemyRopstenApiKey} />
                    <FormHelperText>Generate API key for ETH Mainnet on <a href="https://www.alchemy.com" target="_blank">alchemy.com</a> if you don't have one.</FormHelperText>
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Infura API Key</FormLabel>
                    <Input placeholder=".g. https://mainnet.infura.io/v3/your_api_key" onChange={(e) => updateConfig('infuraApiUrl', e.target.value)} value={currentConfig.infuraApiUrl} isInvalid={formHasErrors && !currentConfig.infuraApiUrl} />
                    <FormHelperText>Generate API key for ETH Mainnet on <a href="https://infura.io/" target="_blank">infura.io</a> if you don't have one.</FormHelperText>
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Infura API Key (Ropsten)</FormLabel>
                    <Input placeholder="e.g. https://ropsten.infura.io/v3/your_api_key" onChange={(e) => updateConfig('infuraApiUrlRopsten', e.target.value)} value={currentConfig.infuraApiUrlRopsten} isInvalid={formHasErrors && !currentConfig.infuraApiUrlRopsten} />
                    <FormHelperText>Generate API key for ETH Mainnet on <a href="https://infura.io/" target="_blank">infura.io</a> if you don't have one.</FormHelperText>
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Etherscan API Key</FormLabel>
                    <Input placeholder="" onChange={(e) => updateConfig('etherscanApiKey', e.target.value)} value={currentConfig.etherscanApiKey} isInvalid={formHasErrors && !currentConfig.etherscanApiKey} />
                    <FormHelperText>Generate Etherscan API key on <a href="https://etherscan.io/apis" target="_blank">etherscan.io/apis</a> if you don't have one.</FormHelperText>
                </FormControl>
                {/*<FormControl mb="5">*/}
                {/*    <FormLabel htmlFor='email'>Deposit Wallet Address</FormLabel>*/}
                {/*    <Input placeholder="" onChange={(e) => updateConfig('mintDepositAddress', e.target.value)} value={currentConfig.mintDepositAddress} />*/}
                {/*    <FormHelperText>Your wallet address that is going to be used as deposit for payment transfers to mint NFTs.</FormHelperText>*/}
                {/*</FormControl>*/}
                {configSaved ?
                    <Alert status='success' variant='subtle' mt={5}>
                        <AlertIcon />
                        Configuration Saved!
                    </Alert> :
                    <>
                        <Button colorScheme="blue" onClick={saveConfig}>Save</Button>
                        {formHasErrors &&
                            <Text fontSize="sm" color="red" mt="4">Form has errors, please check fields above</Text>
                        }
                    </>
                }
            </Box>
        </>
    )
}

export default Home;
