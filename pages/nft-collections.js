import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import config from "../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";

const NFTCollections = () => {
    const [currentConfig, setCurrentConfig] = useState(config);
    const [formHasErrors, setFormHasErrors] = useState(false);
    const [project, setProject] = useState(false);
    const [collection, setCollection] = useState({});

    const saveCollection = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);

            // create the project
            let response = await axios.post('/api/projects', {
                name: collection.project_name,
                company_name: collection.company_name,
                contact_email: collection.contact_email,
            });

            // create the collection
            const project_id = response.data.project_id;

            response = await axios.post('/api/collections', {
                name: collection.collection_name,
                project_id: project_id,
                description: collection.description,
                icon_url: collection.icon_url,
                metadata_api_url: collection.metadata_api_url,
                collection_size: collection.collection_size,
                mint_cost: collection.mint_cost,
                max_mints_per_user: collection.max_mints_per_user,
            });

            console.log(response);
            // response = await axios.post('/api/deploy-contract');
            //
            // if (response.data.result) {
            // }
        }
        else {
            setFormHasErrors(true);
        }
    }

    const checkIsFormValid = () => {
        return (collection.project_name) ? true : false;
    }

    console.log(collection);

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>NFT Collections</Heading>
            <Heading as="h4" size="md" mb={15}>Create a new collection</Heading>
            <Box mt="15" width="500px">
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Project Name</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, project_name: e.target.value}))} value={collection.project_name} isInvalid={formHasErrors && !collection.project_name} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Company Name</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, company_name: e.target.value}))} value={collection.company_name} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Contact Email</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, contact_email: e.target.value}))} value={collection.contact_email} />
                </FormControl>
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Collection Name</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, collection_name: e.target.value}))} value={collection.collection_name} isInvalid={formHasErrors && !collection.collection_name} />
                </FormControl>
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Collection Description</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, collection_description: e.target.value}))} value={collection.collection_description} isInvalid={formHasErrors && !collection.collection_description} />
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
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, collection_size: e.target.value}))} value={collection.collection_size ? collection.collection_size : 10000} isInvalid={formHasErrors && !collection.collection_size} />
                </FormControl>
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Mint Cost (ETH)</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, mint_cost: e.target.value}))} value={collection.mint_cost} isInvalid={formHasErrors && !collection.mint_cost} />
                </FormControl>
                <FormControl mb="5">
                    <FormLabel htmlFor='email'>Max Mints Per User (Leave blank for unlimited)</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, max_mints_per_user: e.target.value}))} value={collection.max_mints_per_user} isInvalid={formHasErrors && !collection.max_mints_per_user} />
                </FormControl>
                <Button colorScheme="blue" onClick={saveCollection}>
                    Create Collection
                </Button>
                {formHasErrors &&
                    <Text fontSize="sm" color="red" mt="4">Form has errors, please check fields above</Text>
                }
            </Box>
        </>
    )
}

export default NFTCollections;
