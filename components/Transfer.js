import { Link, ETHTokenType } from '@imtbl/imx-sdk'
import React, { useState, useEffect } from 'react'
import config from "../config";
import {useLinkSDK} from "./hooks/useLinkSDK";
import { Button, Input } from '@chakra-ui/react'

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
                <Input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="ETH amount, e.g. 0.4" my={4} />
            </div>
            <div>
                <Input type="text" value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="Receiver Wallet Address" my={4} />
            </div>
            <Button colorScheme='blue' onClick={transfer}>Transfer</Button>
        </div>
    )
}

export default Transfer;
