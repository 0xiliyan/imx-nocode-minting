import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex} from "@chakra-ui/layout";
import config from "../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";

const DeployContract = () => {
    const [tokenContractAddress, setTokenContractAddress] = useState(config.tokenContractAddress);
    const [deployingContract, setDeployingContract] = useState(false);

    const deployContract = async () => {
        setDeployingContract(true);
        const response = await axios.post('/api/deploy-contract');

        if (response.data.result) {
            setDeployingContract(false);
            setTokenContractAddress(response.data.result);
        }
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Deploy Contract</Heading>
            <Heading as="h4" size="xs" mb={15}>Deploy IMX contract on Ethereum</Heading>
            <Box mt="15" width="500px">
                {tokenContractAddress ?
                    <Alert status='success' variant='subtle' mt={5}>
                        <AlertIcon />
                        Contract Deployed on Ethereum {config.appNetwork} with address {tokenContractAddress}!
                    </Alert> :
                    <>
                        {!deployingContract ?
                            <Button colorScheme="blue" onClick={deployContract}>
                                Deploy to Ethereum {config.appNetwork}
                            </Button> :
                            <Flex size={"md"} align="center">Deploying... <Spinner ml={5}/></Flex>
                        }
                    </>
                }
            </Box>
        </>
    )
}

export default DeployContract;
