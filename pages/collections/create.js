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
            collection.metadata_api_url && collection.collection_image_url && collection.collection_size && collection.mint_cost;

        if (project === 'new_project') {
            result = result && collection.project_name && collection.company_name && collection.contact_email;
        }

        return result ? true : false;
    }

    return (
        <>
            <Heading as="h3" size="lg" mb={15}>Create a new NFT collection</Heading>
            <Box mt="15" width="500px">
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
                    </>
                }
                <FormControl mb="5" isRequired>
                    <FormLabel htmlFor='email'>Contact Email</FormLabel>
                    <Input placeholder="" onChange={(e) => setCollection(prevState => ({...prevState, contact_email: e.target.value}))} value={collection.contact_email} isInvalid={formHasErrors && !collection.contact_email} />
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
                    Create Collection
                </Button>
                {formHasErrors &&
                    <Text fontSize="sm" color="red" mt="4">{formHasErrors}</Text>
                }
            </Box>
        </>
    )
}

export default CreateCollection;
