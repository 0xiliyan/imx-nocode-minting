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

    const readPaymentTransactions = async () => {
        if (checkIsFormValid()) {
            // setIsLoading(true);
            setFormHasErrors(false);

            const {data} = await axios.post(`/api/import-transactions${collection.mint_deposit_layer == 'l2' ? '-l2' : ''}`, {
                collection_id: collection.id
            });

            console.log(data);
            setIsLoading(false);
        }
        else {
            setFormHasErrors(true);
        }
    }

    const checkIsFormValid = () => {
        return true;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>{collection.name} - Read L1/L2 Payment Transactions and Mint NFTs</Heading>
            <Heading as="h4" size="sm" mb={15}>Automatically reads Airdrop requests as well imported into database</Heading>
            <Box mt="25" width="700px">
                <Section>
                    <Text mb={15}>Collection is set up to accept payment transactions on <b>{collection.mint_deposit_layer == 'l1' ? 'Ethereum L1' : 'ImmutableX L2'}</b> to the following deposit address: <b>{collection.mint_deposit_address}</b></Text>
                    <Button colorScheme="blue" onClick={readPaymentTransactions} isLoading={isLoading}>
                        Read Payment Transactions
                    </Button>
                    {formHasErrors &&
                        <Text fontSize="sm" color="red" mt="4">Form has errors, please check fields above</Text>
                    }
                </Section>
            </Box>
        </>
    )
}

export default Mint;
