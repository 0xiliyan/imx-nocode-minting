import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";
import {NumberInput} from "@chakra-ui/number-input";
import Router, {useRouter} from "next/router";
import {Section} from "../../../components/Layout";

const UpdateCollection = () => {
    const router = useRouter();

    const [formHasErrors, setFormHasErrors] = useState(false);;
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

    const saveCollection = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);
            setIsLoading(true);

            // update the collection
            let response = await axios.put(`/api/collections/${collection.id}`, {
                imx_collection_id: collection.imx_collection_id,
                name: collection.name,
                description: collection.description,
                icon_url: collection.icon_url,
                metadata_api_url: collection.metadata_api_url,
                collection_image_url: collection.collection_image_url,
                collection_size: collection.collection_size,
                mint_cost: collection.mint_cost,
                max_mints_per_user: collection.max_mints_per_user,
                mint_deposit_address: collection.mint_deposit_address,
                mint_deposit_layer: collection.mint_deposit_layer,
                royalty_receiver_address: collection.royalty_receiver_address,
                royalty_percentage: collection.royalty_percentage,
            });

            if (response.data.collection_id) {
                Router.push('/collections');
            }
            else {
                setFormHasErrors(response.data.error.message);
                setIsLoading(false);
            }
        }
        else {
            setFormHasErrors('Form has errors, please check fields above');
        }
    }

    const checkIsFormValid = () => {
        let result = collection.name && collection.description && collection.icon_url &&
            collection.metadata_api_url && collection.collection_image_url && collection.collection_size &&
            collection.mint_cost && collection.mint_deposit_address && collection.mint_deposit_layer;

        return result ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Update NFT collection</Heading>
            <Box width="700px">
                <Section>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Collection Name</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, name: e.target.value}))} value={collection.name} isInvalid={formHasErrors && !collection.name} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Collection Description</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, description: e.target.value}))} value={collection.description} isInvalid={formHasErrors && !collection.description} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Icon URL</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, icon_url: e.target.value}))} value={collection.icon_url} isInvalid={formHasErrors && !collection.icon_url} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Metadata API URL</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, metadata_api_url: e.target.value}))} value={collection.metadata_api_url} isInvalid={formHasErrors && !collection.metadata_api_url} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Collection Image URL</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, collection_image_url: e.target.value}))} value={collection.collection_image_url} isInvalid={formHasErrors && !collection.collection_image_url} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Collection Size (How Many NFTs Total)</FormLabel>
                        <Input placeholder="e.g. 10000" onChange={(e) => setCollection(prevState => ({...prevState, collection_size: e.target.value}))} value={collection.collection_size} isInvalid={formHasErrors && !collection.collection_size} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Mint Cost (ETH)</FormLabel>
                        <Input placeholder="e.g. 0.2" onChange={(e) => setCollection(prevState => ({...prevState, mint_cost: e.target.value}))} value={collection.mint_cost} isInvalid={formHasErrors && !collection.mint_cost} />
                    </FormControl>
                    <FormControl mb="5">
                        <FormLabel htmlFor='email'>Max Mints Per User (Leave blank for unlimited)</FormLabel>
                        <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, max_mints_per_user: e.target.value}))} value={collection.max_mints_per_user} />
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>Deposit Wallet Address</FormLabel>
                        <Input onChange={(e) => setCollection(prevState => ({...prevState, mint_deposit_address: e.target.value}))} value={collection.mint_deposit_address} isInvalid={formHasErrors && !collection.mint_deposit_address} />
                        <FormHelperText>Address on your frontend minting dapp where you take payment transfers for NFT mints</FormHelperText>
                    </FormControl>
                    <FormControl mb="5" isRequired>
                        <FormLabel htmlFor='email'>What blockchain do you use to accept NFT payment transfers?</FormLabel>
                        <Select onChange={(e) => setCollection(prevState => ({...prevState, mint_deposit_layer: e.target.value}))} value={collection.mint_deposit_layer} isInvalid={formHasErrors && !collection.mint_deposit_layer}>
                            <option value=''>Please Select</option>
                            <option value='l1'>Ethereum (ETH L1)</option>
                            <option value='l2'>ImmutableX (ETH L2)</option>
                        </Select>
                    </FormControl>
                    <FormControl mb="5">
                        <FormLabel htmlFor='email'>Royalty Wallet Address (optional)</FormLabel>
                        <Input onChange={(e) => setCollection(prevState => ({...prevState, royalty_receiver_address: e.target.value}))} value={collection.royalty_receiver_address} />
                        <FormHelperText>Wallet that is going to receive royalty commissions from NFT sales</FormHelperText>
                    </FormControl>
                    <FormControl mb="5">
                        <FormLabel htmlFor='email'>Royalty Percentage (optional)</FormLabel>
                        <Input onChange={(e) => setCollection(prevState => ({...prevState, royalty_percentage: e.target.value}))} value={collection.royalty_percentage} />
                        <FormHelperText>How much is the royalty commission? Between 1 to 4 is a common percentage</FormHelperText>
                    </FormControl>
                    <Button colorScheme="blue" onClick={saveCollection} isLoading={isLoading}>
                        Update Collection
                    </Button>
                    {formHasErrors &&
                        <Text fontSize="sm" color="red" mt="4">{formHasErrors}</Text>
                    }
                </Section>
            </Box>
        </>
    )
}

export default UpdateCollection;
