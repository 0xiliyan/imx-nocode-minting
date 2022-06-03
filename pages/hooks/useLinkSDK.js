import config from "../../config";
import React, { useState, useEffect } from 'react'
import {Link} from "@imtbl/imx-sdk";

export const useLinkSDK = () => {
    const [linkSDK, setLinkSDK] = useState(null);

    const setupLink = async () => {
        const linkSdkUrl = config.appNetwork == 'mainnet' ? config.linkSDK : config.linkSDKRopsten;
        const link = new Link(linkSdkUrl);
        setLinkSDK(link);

        if (!localStorage.getItem('address')) {
            const {address} = await link.setup({});
            localStorage.setItem('address', address);
        }
    }

    useEffect(() => {
        setupLink();
    }, []);

    return linkSDK;
}