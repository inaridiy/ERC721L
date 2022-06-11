import { expect } from "chai";
import { ethers } from "hardhat";
import {
  deployContract,
  getSigners,
  ONE,
  BASE_PERIOD,
  jumpTime,
  MARGIN,
  ZERO,
} from "./utils";

describe("ERC721Loanable", function () {
  it("check erc721", async function () {
    const instance = await deployContract();
    expect(await instance.name()).to.eq("Sample ERC721Loanable Token");
    expect(await instance.symbol()).to.eq("SET");
  });

  it("testing simple mint", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2],
    } = await getSigners();
    await instance.connect(addr1).mint();

    expect(await instance.balanceOf(addr1.address)).to.eq(ONE);
    expect(await instance.ownerOf(0)).to.eq(addr1.address);
  });

  it("testing simple lend", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    expect(await instance.ownerOf(0)).to.eq(addr2.address);
  });

  it("testing simple reclaim", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    await jumpTime(BASE_PERIOD.add(MARGIN));
    await instance.connect(addr1).reclaim(0);
    expect(await instance.ownerOf(0)).to.eq(addr1.address);
  });

  it("testing lend by borrower", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2, addr3],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    await expect(
      instance.connect(addr2).lend(addr3.address, 0, BASE_PERIOD)
    ).to.revertedWith("ERC721Loanable: lend caller is not true owner");
  });

  it("testing lend to owner", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await expect(
      instance.connect(addr1).lend(addr1.address, 0, BASE_PERIOD)
    ).to.revertedWith("ERC721Loanable: Cannot lend to itself.");
  });

  it("testing reclaim by not true owner", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2, addr3],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    await jumpTime(BASE_PERIOD.add(MARGIN));
    await expect(instance.connect(addr3).reclaim(0)).to.revertedWith(
      "ERC721Loanable: reclaim caller is not true owner"
    );
  });

  it("testing reclaim in deadline", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);

    await expect(instance.connect(addr1).reclaim(0)).to.revertedWith(
      "ERC721Loanable: token is during the lease period"
    );
  });

  it("testing reclaim in deadline", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);

    await expect(instance.connect(addr1).reclaim(0)).to.revertedWith(
      "ERC721Loanable: token is during the lease period"
    );
  });

  it("testing transfer by borrower", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2, addr3],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    await expect(
      instance.connect(addr2).transferFrom(addr2.address, addr3.address, 0)
    ).to.revertedWith("ERC721Loanable: transfer caller is not true owner");
  });

  it("testing get lending info", async () => {
    const instance = await deployContract();
    const {
      addrs: [addr1, addr2, addr3],
    } = await getSigners();
    await instance.connect(addr1).mint();
    await instance.connect(addr1).lend(addr2.address, 0, BASE_PERIOD);
    const { timestamp } = await ethers.provider.getBlock("latest");
    expect(await instance.lendingInfo(0)).to.eql([
      addr1.address,
      addr2.address,
      ZERO,
      BASE_PERIOD.add(timestamp),
    ]);
  });
});
