import React, { useState, useEffect } from 'react';
import { Heading, FormControl, FormLabel, Input, FormHelperText, Select, Radio, RadioGroup, Button } from '@chakra-ui/react';
import {Box, Stack, Container, Flex, Text} from "@chakra-ui/layout";
import config from "../../config";
import styled, { css } from 'styled-components';
import axios from "axios";
import {Alert, AlertIcon} from "@chakra-ui/alert";
import {CircularProgress} from "@chakra-ui/progress";
import {Spinner} from "@chakra-ui/spinner";
import {NumberInput} from "@chakra-ui/number-input";
import Router from "next/router";
import {Section} from "../../components/Layout";

const CreateCollection = () => {
    const [formHasErrors, setFormHasErrors] = useState(false);
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState('new_project');
    const [collection, setCollection] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
    }

    const saveCollection = async () => {
        if (checkIsFormValid()) {
            setFormHasErrors(false);
            setIsLoading(true);

            let response = {};
            if (project === 'new_project') {
                // create the project
                response = await axios.post('/api/projects', {
                    name: collection.project_name,
                    company_name: collection.company_name,
                    contact_email: collection.contact_email,
                });
            }
            else {
                const projectIds = project.split('_');
                response = {};
                response.data = {};
                response.data.project_id = projectIds[0];
                response.data.imx_project_id = projectIds[1];
            }

            // create the collection
            response = await axios.post('/api/collections', {
                name: collection.collection_name,
                project_id: response.data.project_id,
                imx_project_id: response.data.imx_project_id,
                description: collection.collection_description,
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
        let result = collection.collection_name && collection.collection_description && collection.icon_url &&
            collection.metadata_api_url && collection.collection_image_url && collection.collection_size &&
            collection.mint_cost && collection.mint_deposit_address && collection.mint_deposit_layer;

        if (project === 'new_project') {
            result = result && collection.project_name && collection.company_name && collection.contact_email;
        }

        return result ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Create a new NFT collection</Heading>
            <Box width="700px">
                <Section>
                    <FormControl mb="5">
                        <FormLabel htmlFor='email'>Currently Deployed Contract Address (Will be used for this collection)</FormLabel>
                        <b>{config.tokenContractAddress}</b>
                    </FormControl>
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Select Project</FormLabel>
                    <Select onChange={(e) => setProject(e.target.value)} value={project}>
                        <option value='new_project'>Create New Project</option>
                        {projects.map(project =>
                            <option value={`${project.id}_${project.imx_project_id}`}>{project.name}</option>
                        )}
                    </Select>
                </FormControl>
                {project === 'new_project' &&
                    <>
                        <FormControl mb="5" isRequired>
                            <FormLabel htmlFor='email'>Project Name</FormLabel>
                            <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, project_name: e.target.value}))} value={collection.project_name} isInvalid={formHasErrors && !collection.project_name} />
                        </FormControl>
                        <FormControl mb="5" isRequired>
                            <FormLabel htmlFor='email'>Company Name</FormLabel>
                            <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, company_name: e.target.value}))} value={collection.company_name} isInvalid={formHasErrors && !collection.company_name} />
                        </FormControl>
                        <FormControl mb="5" isRequired>
                            <FormLabel htmlFor='email'>Contact Email</FormLabel>
                            <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, contact_email: e.target.value}))} value={collection.contact_email} isInvalid={formHasErrors && !collection.contact_email} />
                        </FormControl>
                    </>
                }
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
                    <FormLabel htmlFor='email'>What blockchain are you going to use to accept NFT payment transfers in your minting dapp?</FormLabel>
                    <Select onChange={(e) => setCollection(prevState => ({...prevState, mint_deposit_layer: e.target.value}))} isInvalid={formHasErrors && !collection.mint_deposit_layer}>
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
                    Create Collection
                </Button>
                {formHasErrors &&
                    <Text fontSize="sm" color="red" mt="4">{formHasErrors}</Text>
                }
                </Section>
            </Box>
        </>
    )
}

export default CreateCollection;
