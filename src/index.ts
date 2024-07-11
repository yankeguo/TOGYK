export namespace YGTOG {
  export const baseUrl = "https://nft.yankeguo.com/chains/gnosis/tokens/YGTOG";

  export const contract = {
    _imageFile: "contract.jpg",
    _metadataUrl: `${baseUrl}/metadata.json`,
    name: "Token of Gratitude by Yanke Guo",
    description:
      "An unique and heartfelt NFT collection that celebrates the spirit of appreciation and connection. Each piece in this collection is a digital token of gratitude, expressing heartfelt thanks and recognition for the people and moments that make my life meaningful.",
    image: `${baseUrl}/image.jpg`,
  };

  export const items = [
    {
      _id: 1n,
      _imageFile: "1.jpg",
      name: "Test Item",
      description: "This is a test item.",
    },
  ].map((item) => {
    const imageExt = item._imageFile.split(".").pop();
    const _idHex = item._id.toString(16).padStart(64, "0");
    const _metadataUrl = `${baseUrl}/items/${_idHex}/metadata.json`;
    const image = `${baseUrl}/items/${_idHex}/image.` + imageExt;
    return {
      ...item,
      _idHex,
      _metadataUrl,
      image,
    };
  });
}
