import { Link, ETHTokenType } from '@imtbl/imx-sdk'
import React, { useState, useEffect } from 'react'
import config from "../../config";
import {useLinkSDK} from "../hooks/useLinkSDK";

const Transfer = () => {
    const linkSDK = useLinkSDK();

    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');

    const transfer = () => {
        linkSDK.transfer([
            {
                amount,
                type: ETHTokenType.ETH,
                toAddress: receiver,
            }]);
    }

    return (
        <div>
            <div>
                <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="ETH amount, e.g. 0.4" />
            </div>
            <div>
                <input type="text" value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="Receiver Wallet Address" />
            </div>
            <button onClick={transfer}>Transfer</button>
        </div>
    )
}

export default Transfer;
