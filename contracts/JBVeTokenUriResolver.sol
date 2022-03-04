// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import './JBConstants.sol';
import './JBErrors.sol';

contract JBVeTokenUriResolver {
  using SafeMath for uint16;
  using SafeMath for uint32;
  using SafeMath for uint64;
  using SafeMath for uint128;
  using SafeMath for uint256;

  uint256[] private _DURATIONS = [
    uint256(JBConstants.TEN_DAYS),
    uint256(JBConstants.TWENTY_FIVE_DAYS),
    uint256(JBConstants.ONE_HUNDRED_DAYS),
    uint256(JBConstants.TWO_HUNDRED_FIFTY_DAYS),
    uint256(JBConstants.ONE_THOUSAND_DAYS)
  ];

  /**
     @notice Computes the metadata url.
     @param _amount Lock Amount.
     @param _duration Lock time in seconds.
     Returns metadata url.
    */
  function tokenURI(uint256 _amount, uint256 _duration) public view returns (string memory uri) {
    if (_amount <= 0) {
      revert INSUFFICIENT_BALANCE();
    }
    if (_duration <= 0) {
      revert INVALID_DURATION();
    }
    uint256 bucket = 59;
    while (bucket >= 0) {
      uint256 maxAmount = uint256(bucket + 1) * 1000 + (uint256(14 ether).div(10 ether)**bucket);
      if (_amount >= maxAmount) {
        bucket += 1;
        break;
      } else if (bucket == 0) break;
      bucket -= 1;
    }
    if (bucket < 60) {
      for (uint256 i = uint256(_DURATIONS.length - 1); i >= 0; i -= 1) {
        if (_DURATIONS[i] == _duration) {
          return
            string(
              //
              abi.encodePacked('ipfs://QmZ95SaBa3VWb2X7o9bPniWKYBQ2uCnjBmhSUhLq7orjRS/', Strings.toString(bucket * 5 + i))
              //
            );
        }
      }
    } else revert INVALID_DURATION();
    revert INSUFFICIENT_BALANCE();
  }
}
