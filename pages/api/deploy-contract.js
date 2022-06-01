
export default function handler(req, res) {
    if (req.method === 'GET') {
        return deployContract(req, res);
    }
}

const deployContract = async (req, res) => {
    // publish IXM contract
    const path = require('path');
    const fs = require('fs');
    const solc = require('solc');
    const Web3 = require('web3');

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


    const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
    // const contractFile = tempFile.contracts['NFT.sol']['NFT'];

    let result = tempFile;

    //
    // // Initialization
    // const bytecode = contractFile.evm.bytecode.object;
    // const abi = contractFile.abi;
    //
    // const privKey = '<private key>';
    // const address = '<address>';
    //
    // const web3 = new Web3("https://ropsten.infura.io/v3/<api>");
    //
    // // Deploy contract
    // const deploy = async() => {
    //
    //     console.log('Attempting to deploy from account:', address);
    //     const incrementer = new web3.eth.Contract(abi);
    //
    //     const incrementerTx = incrementer.deploy({
    //         data: bytecode
    //         // arguments: [],
    //     })
    //     const createTransaction = await web3.eth.accounts.signTransaction({
    //             from: address,
    //             data: incrementerTx.encodeABI(),
    //             gas: 3000000,
    //         },
    //         privKey
    //     )
    //     const createReceipt = web3.eth.sendSignedTransaction(createTransaction.rawTransaction).then((res) => {
    //         console.log('Contract deployed at address', res.contractAddress);
    //     });

    // };

    return res.status(200).json({result});
}
