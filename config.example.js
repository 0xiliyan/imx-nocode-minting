export default {
    appNetwork: 'mainnet',
    // database
    dbHost: '',
    dbName: '',
    dbUser: '',
    dbPass: '',
    // Alcehmy API key
    alchemyApiKey: 'https://eth-mainnet.alchemyapi.io/v2/your_api_key',
    alchemyRopstenApiKey: 'https://eth-ropsten.alchemyapi.io/v2/your_api_key',
    // Immutable X Generic Configurations
    // to submit a new contract for registration on immutable x use: https://submitcontract.x.immutable.com/
    publicApiUrl: 'https://api.x.immutable.com/v1',
    publicRopstenApiUrl: 'https://api.ropsten.x.immutable.com/v1',
    publicApiUrlV2: 'https://api.x.immutable.com/v2',
    publicRopstenApiUrlV2: 'https://api.ropsten.x.immutable.com/v2',
    // Use this when registering the contract in Remix
    smartContractAddress: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
    smartRopstenContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
    // use this in backend minter
    registrationContractAddress: '0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c',
    registrationRopstenContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
    // etherscan api
    etherscanApiKey: 'yourapikey',
    etherscanApi: 'https://api.etherscan.io/api',
    etherscanRopstenApi: 'https://api-ropsten.etherscan.io/api',
    // used by import_transactions script
    mintDepositAddress: 'your_deposit_address',
    // Private key for the wallet that is the contract's owner
    minterPrivateKey: 'your_contract_owner_wallet_private_key_mainnet',
    minterRopstenPrivateKey: 'your_contract_owner_wallet_private_key_ropsten',
    // Address of your registered contract on Immutable X
    tokenContractAddress: 'your_contract_address_mainnet',
    tokenRopstenContractAddress: 'your_contract_address_ropsten',
    royaltyReceiverAddress: 'your_royalty_receiver_address',
    royaltyPercentage: 2,
    // frontend configuration
    mintCost: '',
    maxMintsForUser: 0, // zero means unlimited
    whitelistedAddresses: [],
    collectionCount: 10000,
    mintBatchSize: 100,
    endSaleAtDepositAmount: 0,
    isMintingEnabled: false,
    whitelistOnly: false,
    backgroundColor: '',
    textColor: '',
    textSize: '',
    buttonBackgroundColor: '',
    buttonColor: '',
    pageHeading: '',
    mintButton: 'rounded', // rounded, rectangularr
    mintButtonLabel: 'Mint',
    currentPriceLabel: '',
    countdownDate: '',
    headerLinks: [],
}
