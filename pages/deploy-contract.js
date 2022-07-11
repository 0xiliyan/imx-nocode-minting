import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import config from "../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";
import {Section} from "../components/Layout";

const DeployContract = () => {
    const [currentConfig, setCurrentConfig] = useState(config);

    const [tokenContractAddress, setTokenContractAddress] = useState(config.tokenContractAddress);
    const [deployingContract, setDeployingContract] = useState(false);
    const [formHasErrors, setFormHasErrors] = useState(false);

    const updateConfig = (key, value) => {
        const newConfig = {...currentConfig};
        newConfig[key] = value;
        setCurrentConfig(newConfig);
    }

    const deployContract = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);
            await axios.post('/api/update-config', {config: currentConfig});

            setDeployingContract(true);
            const response = await axios.post('/api/deploy-contract');

            if (response.data.result) {
                setDeployingContract(false);
                setTokenContractAddress(response.data.result);
            }
        }
        else {
            setFormHasErrors(true);
        }
    }

    const checkIsFormValid = () => {
        return (currentConfig.minterAddress && currentConfig.minterPrivateKey) ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Deploy Contract</Heading>
            <Heading as="h4" size="xs" mb={15}>Deploy IMX contract on Ethereum</Heading>

            {tokenContractAddress &&
            <Alert status='success' variant='subtle' mt={5}>
                <AlertIcon/>
                Contract Deployed on Ethereum {config.appNetwork} with address {tokenContractAddress}! If you want to deploy a new contract (lets say for another collection), hit Deploy again. Otherwise you're good to go and mint your collection!
            </Alert>
            }

            <Box width="700px">
                <Section>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Contract Owner Wallet Address</FormLabel>
                        <Input placeholder="" onChange={(e) => updateConfig('minterAddress', e.target.value)} value={currentConfig.minterAddress} isInvalid={formHasErrors && !currentConfig.minterAddress} />
                        <FormHelperText>Wallet address that will be used to deploy the ImmutableX contract</FormHelperText>
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Contract Owner Wallet Private Key</FormLabel>
                        <Input placeholder="" onChange={(e) => updateConfig('minterPrivateKey', e.target.value)} value={currentConfig.minterPrivateKey} isInvalid={formHasErrors && !currentConfig.minterPrivateKey} />
                        <FormHelperText>Private Key for Contract Owner Wallet. Used to deploy contract to Ethereum and also mint NFTs. You can export this from Metamask wallet</FormHelperText>
                    </FormControl>
                    <>
                        {!deployingContract ?
                            <>
                                <Button colorScheme="blue" onClick={deployContract}>
                                    Deploy Contract to Ethereum {config.appNetwork}
                                </Button>
                                {formHasErrors &&
                                <Text fontSize="sm" color="red" mt="4">Form has errors, please check fields above</Text>
                                }
                            </>
                            :
                            <Flex size={"md"} align="center">Deploying, please wait... <Spinner ml={5}/></Flex>
                        }
                    </>
                </Section>
            </Box>
        </>
    )
}

export default DeployContract;
