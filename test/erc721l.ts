import { expect } from "chai";
import {
  deployContract,
  getSigners,
  ONE,
  BASE_PERIOD,
  jumpTime,
  MARGIN,
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
    jumpTime(BASE_PERIOD.add(MARGIN));
    await instance.connect(addr1).reclaim(0);
    expect(await instance.ownerOf(0)).to.eq(addr1.address);
  });
});
