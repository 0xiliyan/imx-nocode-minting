import React, { useState, useEffect, useRef } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import styled, { css } from 'styled-components';
import axios from "axios";
import Link from "next/link";
import {useRouter} from "next/router";
import {Img} from "@chakra-ui/image";
import {Section} from "../../../components/Layout";

const Mint = () => {
    const router = useRouter();

    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [paymentLayer, setPaymentLayer] = useState();
    const [depositWalletAddress, setDepositWalletAddress] = useState();
    const [formHasErrors, setFormHasErrors] = useState(false);

    useEffect(() => {
        if (router.query.id) {
            loadCollection(router.query.id);
        }
    }, [router.query.id]);

    const loadCollection = async (collectionId) => {
        const {data} = await axios.get(`/api/collections/${collectionId}`);
        setCollection(data);
    }

    const mint = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);

        }
        else {
            setFormHasErrors(true);
        }
    }

    const checkIsFormValid = () => {
        return (depositWalletAddress && paymentLayer) ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>{collection.name} - Read L1/L2 Payment Transactions and Mint NFTs</Heading>
            <Box mt="25" width="700px">
                <Section>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Deposit Wallet Address</FormLabel>
                        <Input onChange={(e) => setDepositWalletAddress(e.target.value)} value={depositWalletAddress} isInvalid={formHasErrors && !depositWalletAddress} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>What blockchain do you use to accept NFT payment transfers?</FormLabel>
                        <Select onChange={(e) => setPaymentLayer(e.target.value)} isInvalid={formHasErrors && !paymentLayer}>
                            <option value=''>Please Select</option>
                            <option value='l1'>Ethereum (ETH L1)</option>
                            <option value='l2'>ImmutableX (ETH L2)</option>
                        </Select>
                    </FormControl>
                    <Button colorScheme="blue" onClick={mint} isLoading={isLoading}>
                        Read Payments to Deposit Address & Mint NFTs
                    </Button>
                    {formHasErrors &&
                        <Text fontSize="sm" color="red" mt="4">Form has errors, please check fields above</Text>
                    }
                    {/*{processedRows &&*/}
                    {/*<Box mt={5}><b>Imported rows for airdrop: {`${processedRows}`}</b></Box>*/}
                    {/*}*/}
                </Section>
            </Box>
        </>
    )
}

export default Mint;
