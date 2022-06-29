import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Link, ETHTokenType } from '@imtbl/imx-sdk'
import React, { useState, useEffect } from 'react'
import Transfer from "../components/Transfer";
import { ChakraProvider, Heading } from '@chakra-ui/react'
import {Container} from "@chakra-ui/layout";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/tabs";

const Mint = () => {
    return (
        <>
            Minting
        </>
    )
}

export default Mint;
