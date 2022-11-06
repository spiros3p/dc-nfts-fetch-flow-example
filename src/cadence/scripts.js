export const readSDMTokenTotalSupplyScript = `
import SdmToken from 0xProfile
pub fun main(): UFix64 {
  return SdmToken.totalSupply
}
`;

export const getIDsofWalletsDcNFTs = `
import DarkCountry from 0xProfile

pub fun main(address: Address): [UInt64] {
  let account = getAccount(address)

  let collectionRef = account.getCapability(DarkCountry.CollectionPublicPath)!.borrow<&{DarkCountry.DarkCountryCollectionPublic}>()
      ?? panic("Could not borrow capability from public collection")

  return collectionRef.getIDs()
}
`;

export const getDcNFTbyID = `
import DarkCountry from 0xProfile
import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(address: Address, itemId: UInt64): &DarkCountry.NFT? {
  let account = getAccount(address)

  let collectionRef = account.getCapability(DarkCountry.CollectionPublicPath)!.borrow<&{DarkCountry.DarkCountryCollectionPublic}>()
      ?? panic("Could not borrow capability from public collection")

  return collectionRef.borrowDarkCountryNFT(id: itemId)
}
`;

export const getAllItemTemplates = `
import DarkCountry from 0xProfile

pub fun main(): [DarkCountry.ItemTemplate] {
  return DarkCountry.getAllItemTemplates()
}
`;
