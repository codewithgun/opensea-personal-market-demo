pragma solidity ^0.8.0;
import "./ERC721.sol";

contract ERC721Collection is ERC721 {

    uint256 public counter;
    string public contractURI;
    mapping(uint256 => string) public tokenURIs;

    constructor(string memory _name, string memory _symbol, string memory _contractURI) ERC721(_name, _symbol) {
        contractURI = _contractURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return tokenURIs[tokenId];
    }
    
    function mint(address _to, string memory _tokenURI) public {
        counter += 1;
        tokenURIs[counter] = _tokenURI;
        _safeMint(_to, counter);   
    }

}