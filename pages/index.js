import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Link, ETHTokenType } from '@imtbl/imx-sdk'
import React, { useState, useEffect } from 'react'
import config from "../config";



const Home = () => {
    const [linkSDK, setLinkSDK] = useState(null);

    const setupLink = async () => {
        const linkSdkUrl = config.appNetwork == 'mainnet' ? config.linkSDK : config.linkSDKRopsten;
        const link = new Link(linkSdkUrl);
        const {address} = await link.setup({});
        localStorage.setItem('address', address);

        link.transfer([
            {
                amount: '0.08',
                type: ETHTokenType.ETH,
                toAddress: config.minterAddress,
            }]);

        https://api.ropsten.x.immutable.com/v1/transfers?receiver=0x18a17813021aF3096F0BFFF9BA09Da6Aab82Ac96&status=success&token_type=ETH

        setLinkSDK(link);
    }

    useEffect(() => {
        setupLink();
    }, []);

    return (
        <div className={styles.container}>
            <p>IMX Nocode minter</p>
        </div>
    )
}

export default Home;
