import React, { useState, useEffect } from 'react'
import {Button, ChakraProvider, Heading, Input} from '@chakra-ui/react'
import {Box, Container, Flex} from "@chakra-ui/layout";
import Link from "next/link";
import styled, { css } from 'styled-components';
import {Tab, TabList, Tabs} from "@chakra-ui/tabs";
import config from "../config";
import {Img} from "@chakra-ui/image";

const Header = styled.div`
    display: flex;
`

const LinkItem = styled.div`
    margin-right: 20px;
    font-size: 14px;
`

const Content = styled.div`
    margin: 25px 0px;
    padding-bottom: 100px;
`

export const Section = styled.div`
    padding: 24px 30px;
    background-color: #fff;
    border: 1px solid #e8edf3;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 4px 0 rgb(223 228 234 / 20%);
    box-shadow: 0 2px 4px 0 rgb(223 228 234 / 20%);
    margin: 15px 0px;
`

const AppNetwork = styled.div`
    background: #19cdc7;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    padding: 5px 20px;
    margin: 0px 20px;
    border-radius: 15px;
`

const Layout = ({children}) => {
    return (
        <ChakraProvider>
            <Flex align="center" background="white" p={5}>
                <Img src="/img/imx-nocode-minter.png" />
                <AppNetwork>{config.appNetwork.charAt(0).toUpperCase() + config.appNetwork.slice(1)}</AppNetwork>
                <Header>
                    <LinkItem>
                        <Link href="/">
                            <Button variant="ghost" colorScheme="gray">General Config</Button>
                        </Link>
                    </LinkItem>
                    {config.generalConfigUpdated &&
                    <>
                        {!config.databaseImported &&
                        <LinkItem>
                            <Link href="/import-db">
                                <Button variant="ghost" colorScheme="gray">Import Database</Button>
                            </Link>
                        </LinkItem>
                        }
                        <LinkItem>
                            <Link href="/deploy-contract">
                                <Button variant="ghost" colorScheme="gray">Deploy Contract</Button>
                            </Link>
                        </LinkItem>
                        <LinkItem>
                            <Link href="/collections">
                                <Button variant="ghost" colorScheme="gray">NFT Collections</Button>
                            </Link>
                        </LinkItem>
                        {/*<LinkItem>*/}
                        {/*    <Link href="/whitelist">*/}
                        {/*        <Button variant='outline'>Import Whitelist</Button>*/}
                        {/*    </Link>*/}
                        {/*</LinkItem>*/}
                        {/*<LinkItem>*/}
                        {/*    <Link href="/mint">*/}
                        {/*        <Button variant='outline'>Mint NFTs</Button>*/}
                        {/*    </Link>*/}
                        {/*</LinkItem>*/}
                    </>
                    }
                </Header>
            </Flex>
            <Container maxW="1500px">
                <Content>
                    {children}
                </Content>
            </Container>
        </ChakraProvider>
    )
}

export default Layout;
