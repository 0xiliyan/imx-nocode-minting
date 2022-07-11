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
            });

            console
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
            collection.metadata_api_url && collection.collection_image_url && collection.collection_size && collection.mint_cost;

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
