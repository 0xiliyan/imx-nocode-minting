import fs from 'fs';
import util from 'util';
import config from "../config.js";
import {AlchemyProvider} from "@ethersproject/providers";
import {ImmutableXClient} from "@imtbl/imx-sdk";
import {Wallet} from "@ethersproject/wallet";

export const logConsoleOutputToFile = (logFile) => {
    var logFile = fs.createWriteStream(logFile, { flags: 'a' });
    // Or 'w' to truncate the file every time the process starts.
    var logStdout = process.stdout;

    console.log = function () {
        logFile.write(util.format.apply(null, arguments) + '\n');
        logStdout.write(util.format.apply(null, arguments) + '\n');
    }
    console.error = console.log;
}

export const sleep = (delay) => {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export const getImxSDK = async () => {
    const isRopsten = config.appNetwork == 'ropsten';

    // set up provider
    const provider = new AlchemyProvider(isRopsten ? 'ropsten' : 'homestead', isRopsten ? config.alchemyRopstenApiKey : config.alchemyApiKey);

    // creating a signer
    const wallet = new Wallet(config.minterPrivateKey);
    const signer = wallet.connect(provider);

    // set up IMX SDK client
    const client = await ImmutableXClient.build({
        // IMX's API URL
        publicApiUrl: isRopsten ? config.publicApiUrlRopsten : config.publicApiUrl,
        // signer (in this case, whoever owns the contract)
        signer,
        // IMX's STARK contract address
        starkContractAddress: isRopsten ? config.imxRegistrationContractAddressRopsten : config.imxRegistrationContractAddress,
        // IMX's Registration contract address
        registrationContractAddress: isRopsten ? config.imxContractAddressRopsten : config.imxContractAddress
    });

    return {
        provider, wallet, signer, client
    }
}

export const getHash = (str) => {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

