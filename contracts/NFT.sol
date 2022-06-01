// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// OpenZeppelin's ERC721 implementation (it's a standard, so let it be)
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// IMXMethods.sol is an abstracted implementation of IMX-required interfaces (IMintable as well as Ownable)
// OZ's Ownable implementation, implementes owner() and onlyOwner
import "@openzeppelin/contracts/access/Ownable.sol";

// IMintable interface that defines the mintFor method
// IMintable interface that's necessary for withdrawal of L2-minted tokens to L1
// Implemented in IMXMethods.sol
interface IMintable {
    function mintFor(address to, uint256 quantity, bytes calldata blueprint) external;
}

// Parsing utilities, used to split the receivied blueprints into [tokenId, metadata]
// Can be ignored if you're not using on-chain metadata, which will save you some bytes
library Bytes {
    /**
     * @dev Converts a `uint256` to a `string`.
     * via OraclizeAPI - MIT licence
     * https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
     */
    function fromUint(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        uint256 index = digits - 1;
        temp = value;
        while (temp != 0) {
            buffer[index--] = bytes1(uint8(48 + (temp % 10)));
            temp /= 10;
        }
        return string(buffer);
    }

    bytes constant alphabet = "0123456789abcdef";

    /**
     * Index Of
     *
     * Locates and returns the position of a character within a string starting
     * from a defined offset
     *
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string acting as the haystack to be
     *              searched
     * @param _value The needle to search for, at present this is currently
     *               limited to one character
     * @param _offset The starting point to start searching from which can start
     *                from 0, but must not exceed the length of the string
     * @return int The position of the needle starting from 0 and returning -1
     *             in the case of no matches found
     */
    function indexOf(
        bytes memory _base,
        string memory _value,
        uint256 _offset
    ) internal pure returns (int256) {
        bytes memory _valueBytes = bytes(_value);

        assert(_valueBytes.length == 1);

        for (uint256 i = _offset; i < _base.length; i++) {
            if (_base[i] == _valueBytes[0]) {
                return int256(i);
            }
        }

        return -1;
    }

    function substring(
        bytes memory strBytes,
        uint256 startIndex,
        uint256 endIndex
    ) internal pure returns (string memory) {
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    function toUint(bytes memory b) internal pure returns (uint256) {
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 val = uint256(uint8(b[i]));
            if (val >= 48 && val <= 57) {
                result = result * 10 + (val - 48);
            }
        }
        return result;
    }
}

library Parsing {
    // Split the minting blob into token_id and blueprint portions
    // {token_id}:{blueprint}

    function split(bytes calldata blob)
    internal
    pure
    returns (uint256, bytes memory)
    {
        int256 index = Bytes.indexOf(blob, ":", 0);
        require(index >= 0, "Separator must exist");
        // Trim the { and } from the parameters
        uint256 tokenID = Bytes.toUint(blob[1:uint256(index) - 1]);
        uint256 blueprintLength = blob.length - uint256(index) - 3;
        if (blueprintLength == 0) {
            return (tokenID, bytes(""));
        }
        bytes calldata blueprint = blob[uint256(index) + 2:blob.length - 1];
        return (tokenID, blueprint);
    }
}

// Implementation of IMX-required methods
// Inheriting from IMintable (mintFor) and Ownable (owner method)
abstract contract IMXMethods is Ownable, IMintable {
    // address of the IMX's L1 contract that needs to be whitelisted
    // 0x4527be8f31e2ebfbef4fcaddb5a17447b27d2aef - Ropsten
    // 0x5FDCCA53617f4d2b9134B29090C87D01058e27e9 - Mainnet
    // gets passed in the constructor on deployment of the contract
    address public imx;

    // Utility event, disable it if you don't want applications to listen to it
    event AssetMinted(address to, uint256 id, bytes blueprint);

    constructor(address _imx) {
        // IMX's contract address passed from the child
        imx = _imx;
    }

    // implementation of IMintable's mintFor
    // this method gets called upon successful L2-minted asset withdrawal
    function mintFor(
    // address of the receiving user's wallet (must be IMX registered)
        address user,
    // number of tokens that are getting mint, must be 1 for ERC721
        uint256 quantity,
    // blueprint blob, formatted as {tokenId}:{blueprint}
    // blueprint gets passed on L2 mint-time
        bytes calldata mintingBlob
    ) external override {
        // quantity MUST be 1 for ERC721 token type
        require(quantity == 1, "Invalid quantity");
        // whitelisting the IMX Smart Contract address
        // this makes sure that you don't accidentally call the function, which could result in clashing token IDs
        require(msg.sender == imx, "Function can only be called by IMX");
        // parsing of the blueprint as implemented by IMX, splits the {tokenId}:{blueprint} into [id, blueprint]
        (uint256 id, bytes memory blueprint) = Parsing.split(mintingBlob);
        // passing the user, id as well as the parsed blueprint to a child-implemented _mintFor method
        // child's implementation should (at the very least) call ERC721's _safeMint(user, id)
        _mintFor(user, id, blueprint);
        // emiting the AssetMinted event
        // if you don't need this event, comment it out
        emit AssetMinted(user, id, blueprint);
    }

    // defining the signature of a child-implemented method
    // this gets called inside teh above-defiend mintFor
    function _mintFor(
        address user,
        uint256 id,
        bytes memory blueprint
    ) internal virtual;
}


// Make sure the contract is ERC721 compatible!
contract NFT is ERC721, IMXMethods {
    // Optional - used for L1-level late reveals, a static string can be used instead (check below)
    string public baseTokenURI;
    // blueprints storage, if you're not storing on-chain metadata comment this line
    mapping(uint256 => bytes) public metadata;

    // constructor which gets called on contract's deployment
    constructor(
    // name of your Token (eg. "BoredApeYachtClub")
        string memory _name,
    // symbol of your Token (reg. "BAYC")
        string memory _symbol,
    // IMX's Smart Contract address that gets passed to IMXMethods.sol for whitelisting purposes
        address _imx
    ) ERC721(_name, _symbol) IMXMethods(_imx) {}


    // this function receives the (already parsed) version of the blueprint from IMX.sol
    function _mintFor(
    // address of the receiving wallet (has to be IMX registered!)
        address user,
    // id of the Token that has to be mint
        uint256 id,
    // PARSED! blueprint without the {tokenId} prefix
        bytes memory blueprint
    ) internal override {
        // ERC721 defined mint function - required in order for the token to be created
        _safeMint(user, id);
        // you may store the blueprint (on-chain metadata) here or implement some logic that relies on the blueprint data passed
        // below is a bare-minimum implementation of a simple mapping, comment it out if you are not storing on-chain metadata
        metadata[id] = blueprint;
    }

    // overwrite OpenZeppelin's _baseURI to define the base for tokenURI
    // can be a static value, use a variable if you want the ability to change this (L1 late-reveal)
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    // optional - change the baseTokenURI for late-reveal purposes
    function setBaseTokenURI(string memory uri) public onlyOwner {
        baseTokenURI = uri;
    }
}
