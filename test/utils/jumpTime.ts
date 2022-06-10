import { BigNumber, BigNumberish } from "ethers";
import { ethers } from "hardhat";

export const jumpTime = async (time: BigNumberish) => {
  await ethers.provider.send("evm_increaseTime", [
    BigNumber.from(time).toNumber(),
  ]);
  await ethers.provider.send("evm_mine", []);
};
