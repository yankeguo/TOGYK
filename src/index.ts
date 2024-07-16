import { abi } from "./abi";

export namespace YGTOG {
  export const baseUrl = "https://nft.yankeguo.com/chains/gnosis/tokens/YGTOG";

  export type MetadataProperties = Record<string, string>;

  export type MetadataAttributes = { trait_type: string; value: string }[];

  export interface BaseMetadata {
    name: string;
    description: string;
    image: string;
  }

  export interface ContractMetadata extends BaseMetadata {}

  export interface ItemMetadata extends BaseMetadata {
    properties: MetadataProperties;
    attributes: MetadataAttributes;
  }

  interface _Contract {
    chain: string;
    standard: string;
    address: string;
    imageFile: string;
    abi: any;
    metadata: {
      name: string;
      description: string;
    };
  }

  const _contract: _Contract = {
    chain: "gnosis",
    standard: "EIP-1155",
    address: "0xc9174F37f7C969e26d91C0A6001c424f1426c6bD",
    imageFile: "contract.jpg",
    abi,
    metadata: {
      name: "Token of Gratitude by Yanke Guo",
      description:
        "An unique and heartfelt NFT collection that celebrates the spirit of appreciation and connection. Each piece in this collection is a digital token of gratitude, expressing heartfelt thanks and recognition for the people and moments that make my life meaningful.",
    },
  };

  export interface Contract {
    chain: string;
    standard: string;
    address: string;
    abi: any;
    metadataUrl: string;
    imageFile: string;
    metadata: ContractMetadata;
  }

  export const contract: Contract = [_contract].map((item) => {
    const imageExt = item.imageFile.split(".").pop();
    const metadataUrl = `${baseUrl}/metadata.json`;
    const image = `${baseUrl}/image.` + imageExt;
    return {
      ...item,
      metadataUrl,
      metadata: {
        ...item.metadata,
        image,
      },
    };
  })[0];

  interface _Item {
    key: string;
    id: bigint;
    imageFile: string;
    helper: string;
    metadata: {
      name: string;
      description: string;
      properties: MetadataProperties;
    };
  }

  const _items: _Item[] = [
    {
      key: "github_follower_2024",
      id: 101n,
      imageFile: "101.png",
      helper: `Follow GitHub account <a href="https://github.com/yankeguo" target="_blank">@yankeguo</a> to claim this token. If you just followed on GitHub, please <b>re-connect GitHub</b> to claim this NFT.`,
      metadata: {
        name: "GitHub Follower 2024",
        description:
          "Thank you for following me on GitHub! This NFT is a token of my gratitude for your support.",
        properties: {
          Kind: "Social",
          Year: "2024",
          Platform: "GitHub",
        },
      },
    },
    {
      key: "twitter_follower_2024",
      id: 102n,
      imageFile: "102.png",
      helper: `Follow Twitter account <a href="https://twitter.com/yankeguo" target="_blank">@yankeguo</a> to claim this token. If you just followed on Twitter, please <b>re-connect Twitter</b> to claim this NFT.`,
      metadata: {
        name: "Twitter Follower 2024",
        description: `Thank you for following me on Twitter! This NFT is a token of my gratitude for your support. (As I'm not willing to pay the $100 per month Twitter developer plan required to verify followers, anyone with Twitter account connected can mint this NFT.)`,
        properties: {
          Kind: "Social",
          Year: "2024",
          Platform: "Twitter",
        },
      },
    },
  ];

  export interface Item {
    key: string;
    id: bigint;
    imageFile: string;
    helper: string;
    metadataUrl: string;
    metadata: ItemMetadata;
  }

  export const items: Item[] = _items.map((item) => {
    const idHex = item.id.toString(16).padStart(64, "0");
    const imageExt = item.imageFile.split(".").pop();
    const metadataUrl = `${baseUrl}/items/${idHex}/metadata.json`;
    const image = `${baseUrl}/items/${idHex}/image.` + imageExt;
    const attributes = Object.entries(item.metadata.properties).map(
      ([trait_type, value]) => ({
        trait_type,
        value,
      }),
    );
    return {
      ...item,
      idHex,
      metadataUrl,
      metadata: {
        ...item.metadata,
        image,
        attributes,
      },
    };
  });
}
