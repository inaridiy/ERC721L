import { ethers } from "hardhat";

export const deployContract = async () => {
  const factory = await ethers.getContractFactory("Sample");
  const instance = await factory.deploy();
  await instance.deployed();
  return instance;
};

export const getSigners = async () => {
  const [owner, ...addrs] = await ethers.getSigners();
  return { owner, addrs };
};
