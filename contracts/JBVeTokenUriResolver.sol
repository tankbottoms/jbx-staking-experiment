// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

contract JBVeTokenUriResolver {
  using SafeMath for uint16;
  using SafeMath for uint32;
  using SafeMath for uint64;
  using SafeMath for uint128;
  using SafeMath for uint256;

  // TEN TWENTY_FIVE ONE_HUNDRED TWO_HUNDRED_FIFTY ONE_THOUSAND (days)
  uint256[] private _DURATIONS = [
    uint256(864000),
    uint256(2160000),
    uint256(8640000),
    uint256(21600000),
    uint256(86400000)
  ];

  /**
     @notice Computes the metadata url.
     @param _amount Lock Amount.
     @param _duration Lock time in seconds.
     Returns metadata url.
    */
  function tokenURI(uint256 _amount, uint256 _duration) external view returns (string memory uri) {
    require(_amount > 0, '_amount can not be zero');
    require(_duration > 0, '_duration can not be zero');

    for (uint16 i = 59; i >= 0; i -= 1) {
      uint32 maxAmount = uint32((i + 1) * 1000 + uint256(14 ether**i).div(10 ether));
      if (_amount <= maxAmount) {
        for (uint8 j = uint8(_DURATIONS.length - 1); j >= 0; j -= 1) {
          if (_DURATIONS[j] == _duration) {
            return
              string(
                abi.encodePacked(
                  'https://ipfs.io/ipfs/QmZ95SaBa3VWb2X7o9bPniWKYBQ2uCnjBmhSUhLq7orjRS/',
                  Strings.toString(i * 5 + j)
                )
              );
          }
        }
        require(false, 'invalid duration');
        break;
      }
    }
    require(false, 'invalid amount');
  }
}
