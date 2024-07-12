import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { S3 } from "@aws-sdk/client-s3";
import { YGTOG } from "../src";

function detectContentType(filename: string): string {
  if (filename.endsWith(".json")) {
    return "application/json";
  }
  if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (filename.endsWith(".png")) {
    return "image/png";
  }
  return "application/octet-stream";
}

async function uploadItem<
  M extends { image: string },
  T extends { metadataUrl: string; imageFile: string; metadata: M },
>(s3: S3, value: T) {
  const metadataURL = new URL(value.metadataUrl);
  const metadataKey = metadataURL.pathname.slice(1);
  const imageURL = new URL(value.metadata.image);
  const imageKey = imageURL.pathname.slice(1);

  console.log("uploading", metadataKey);

  await s3.putObject({
    Key: metadataKey,
    Bucket: process.env.S3_BUCKET!,
    Body: JSON.stringify(value.metadata, null, 2),
    ContentType: "application/json",
  });

  console.log("uploading", imageKey);

  await s3.putObject({
    Key: imageKey,
    Bucket: process.env.S3_BUCKET!,
    Body: createReadStream(path.join("assets", value.imageFile)),
    ContentType: detectContentType(value.imageFile),
  });
}

async function main() {
  const s3 = new S3({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });

  await uploadItem(s3, YGTOG.contract);

  for (const item of YGTOG.items) {
    await uploadItem(s3, item);
  }
}

main()
  .then(() => console.log("done"))
  .catch(console.error);
