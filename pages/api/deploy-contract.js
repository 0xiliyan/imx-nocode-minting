import config from "../../config";

export default function handler(req, res) {
    if (req.method === 'GET') {
        return deployContract(req, res);
    }
}

const deployContract = async (req, res) => {
    // deploy IMX contract
    const infuraApiUrl = config.appNetwork === 'mainnet' ? config.infuraApiUrl : config.infuraApiUrlRopsten;
    const imxRegistrationContractAddress = config.appNetwork === 'mainnet' ? config.imxRegistrationContractAddress : config.imxRegistrationContractAddressRopsten;

    const fs = require('fs');
    const path = require('path');
    const solc = require('solc');
    const Web3 = require('web3');

    const HDWalletProvider = require('@truffle/hdwallet-provider');
    const provider = new HDWalletProvider({ privateKeys: [config.minterPrivateKey], providerOrUrl: infuraApiUrl });
    const web3 = new Web3(provider);

    // Compile contract
    const contractPath = path.resolve(`${__dirname}../../../../../contracts`, 'NFT.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'NFT.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    function findImports(_path) {
        const file_path = path.resolve(`${__dirname}../../../../../`, _path)
        try {
            return {
                contents: (fs.readFileSync(file_path)).toString()
            }
        } catch {
            return {
                error: "404"
            }
        }
    }

    const tempFile = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    const contract = tempFile.contracts['NFT.sol']['NFT'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    const deploy = async () => {
        try {
            const [account] = await web3.eth.getAccounts();

            console.log(`Deploying contract to ${config.appNetwork} ...`);

            const {_address} = await new web3.eth.Contract(abi)
            .deploy({ data: '0x' + bytecode, arguments: [config.collectionName, config.collectionSymbol, imxRegistrationContractAddress] })
            .send({from: account, gas: 4000000 });

            console.log(`Deployed contract with address: ${_address}`);

            return _address;
        } catch (err) {
            console.log(err);
        }
    };

    const newContractAddress = await deploy();

    return res.status(200).json({newContractAddress});
}
