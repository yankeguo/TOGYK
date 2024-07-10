import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { S3 } from "@aws-sdk/client-s3";

const rootURL = "https://nft.yankeguo.com/tokens/YGTOG";
const rootDir = path.join("uploads", "tokens", "YGTOG");

async function buildAssets() {
  // create root directory
  await fs.mkdir(rootDir, { recursive: true });

  // contract metadata
  let metadata = JSON.parse(
    await fs.readFile(path.join("assets", "metadata.json"), "utf-8"),
  ) as Record<string, any>;
  metadata = Object.assign(metadata, {
    image: `${rootURL}/image.jpg`,
  });

  // write contract metadata and image
  await fs.writeFile(
    path.join(rootDir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
  );
  await fs.copyFile(
    path.join("assets", "image.jpg"),
    path.join(rootDir, "image.jpg"),
  );

  // contract items metadata
  const items = await fs.readdir(path.join("assets", "items"));

  for (const item of items) {
    if (!item.endsWith(".json")) {
      continue;
    }

    const idDec = item.slice(0, -5);
    const idHex = BigInt(idDec).toString(16).padStart(64, "0");

    console.log(`processing item ${idDec}`);

    // item metadata
    let metadata = JSON.parse(
      await fs.readFile(path.join("assets", "items", item), "utf-8"),
    ) as Record<string, any>;
    metadata = Object.assign(metadata, {
      image: `${rootURL}/items/${idHex}/image.jpg`,
    });

    const dir = path.join(rootDir, "items", idHex);

    // write item metadata and image
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "metadata.json"),
      JSON.stringify(metadata, null, 2),
    );
    await fs.copyFile(
      path.join("assets", "items", `${idDec}.jpg`),
      path.join(dir, "image.jpg"),
    );
  }
}

async function uploadAssets() {
  const s3 = new S3({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
  await s3UploadDir(s3, "uploads", process.env.S3_BUCKET!);
}

async function s3UploadDir(s3: S3, s3Path: string, bucket: string) {
  // Recursive getFiles from
  // https://stackoverflow.com/a/45130990/831465
  async function getFiles(dir: string): Promise<string | string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
      }),
    );
    return Array.prototype.concat(...files);
  }

  const files = (await getFiles(s3Path)) as string[];
  const uploads = files.map((filePath) =>
    s3.putObject({
      Key: path.relative(s3Path, filePath),
      Bucket: bucket,
      Body: createReadStream(filePath),
    }),
  );
  return Promise.all(uploads);
}

async function main() {
  await buildAssets();
  await uploadAssets();
}

main()
  .then(() => console.log("done"))
  .catch(console.error);
