export namespace YGTOG {
  export const baseUrl = "https://nft.yankeguo.com/chains/gnosis/tokens/YGTOG";

  export const contract = {
    chain: "gnosis",
    standard: "EIP-1155",
    address: "0xc9174F37f7C969e26d91C0A6001c424f1426c6bD",
    metadataUrl: `${baseUrl}/metadata.json`,
    imageFile: "contract.jpg",
    metadata: {
      name: "Token of Gratitude by Yanke Guo",
      description:
        "An unique and heartfelt NFT collection that celebrates the spirit of appreciation and connection. Each piece in this collection is a digital token of gratitude, expressing heartfelt thanks and recognition for the people and moments that make my life meaningful.",
      image: `${baseUrl}/image.jpg`,
    },
  };

  export const items = [
    {
      key: "test",
      id: 1n,
      imageFile: "1.jpg",
      metadata: {
        name: "Test Item",
        description: "This is a test item.",
      },
    },
  ].map((item) => {
    const imageExt = item.imageFile.split(".").pop();
    const idHex = item.id.toString(16).padStart(64, "0");
    const metadataUrl = `${baseUrl}/items/${idHex}/metadata.json`;
    const image = `${baseUrl}/items/${idHex}/image.` + imageExt;
    return {
      ...item,
      idHex,
      metadataUrl,
      metadata: {
        ...item.metadata,
        image,
      },
    };
  });
}
