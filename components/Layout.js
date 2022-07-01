import React, { useState, useEffect } from 'react'
import {Button, ChakraProvider, Heading, Input} from '@chakra-ui/react'
import {Container} from "@chakra-ui/layout";
import Link from "next/link";
import styled, { css } from 'styled-components';
import {Tab, TabList, Tabs} from "@chakra-ui/tabs";

const Header = styled.div`
    display: flex;
    margin-top: 25px;
`

const LinkItem = styled.div`
    margin-right: 20px;
    font-size: 14px;
`

const Content = styled.div`
    margin: 25px 0px;
    padding-bottom: 100px;
`

const Layout = ({children}) => {
    return (
        <ChakraProvider>
            <Container maxW="1250px">
                <Heading size={'md'} mt={4}>IMX Nocode Minting</Heading>
                <Header>
                    <LinkItem>
                        <Link href="/">
                            <Button variant='outline'>Configuration</Button>
                        </Link>
                    </LinkItem>
                    <LinkItem>
                        <Link href="/mint">
                            <Button variant='outline'>Mint NFTs</Button>
                        </Link>
                    </LinkItem>
                    <LinkItem>
                        <Link href="/whitelist">
                            <Button variant='outline'>Import Whitelist</Button>
                        </Link>
                    </LinkItem>
                    <LinkItem>
                        <Link href="/deploy-contract">
                            <Button variant='outline'>Deploy Contract</Button>
                        </Link>
                    </LinkItem>
                    <LinkItem>
                        <Link href="/import-db">
                            <Button variant='outline'>Import Database</Button>
                        </Link>
                    </LinkItem>
                    <LinkItem>
                        <Link href="/manage-projects">
                            <Button variant='outline'>Manage Projects</Button>
                        </Link>
                    </LinkItem>
                </Header>
                <Content>
                    {children}
                </Content>
            </Container>
        </ChakraProvider>
    )
}

export default Layout;
