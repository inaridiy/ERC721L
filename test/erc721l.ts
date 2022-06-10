import { expect } from "chai";
import { ethers } from "hardhat";
import { deployContract, getSigners } from "./utils";

describe("ERC721Loanable", function () {
  it("check erc721", async function () {
    const instance = await deployContract();
    expect(await instance.name()).to.eq("Sample ERC721Loanable Token");
    expect(await instance.symbol()).to.eq("SET");
  });

  it("testing simple loanable", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1],
    } = await getSigners();
    await instance.connect(addr1).mint();
  });
});
