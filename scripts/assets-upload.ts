import { promises as fs, createReadStream } from "node:fs";
import path from "node:path";
import { S3 } from "@aws-sdk/client-s3";
import { YGTOG } from "../src";

function trimInternalFields(v: Record<string, any>): Record<string, any> {
  const keys = Object.keys(v);
  const result: Record<string, any> = {};
  for (const key of keys) {
    if (key.startsWith("_")) {
      continue;
    }
    result[key] = v[key];
  }
  return result;
}

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
  T extends { _metadataUrl: string; _imageFile: string; image: string },
>(s3: S3, value: T) {
  const metadataURL = new URL(value._metadataUrl);
  const metadataKey = metadataURL.pathname.slice(1);
  const imageURL = new URL(value.image);
  const imageKey = imageURL.pathname.slice(1);
  const metadata = trimInternalFields(value);

  console.log("uploading", metadataKey);

  await s3.putObject({
    Key: metadataKey,
    Bucket: process.env.S3_BUCKET!,
    Body: JSON.stringify(metadata, null, 2),
    ContentType: "application/json",
  });

  console.log("uploading", imageKey);

  await s3.putObject({
    Key: imageKey,
    Bucket: process.env.S3_BUCKET!,
    Body: createReadStream(path.join("assets", value._imageFile)),
    ContentType: detectContentType(value._imageFile),
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
