import fs from "node:fs";
import path from "node:path";

const rootURL = "https://nft.yankeguo.com/tokens/YGTOG";
const rootDir = path.join("uploads", "tokens", "YGTOG");

// create root directory
fs.mkdirSync(rootDir, { recursive: true });

// contract metadata
let metadata = JSON.parse(
  fs.readFileSync(path.join("assets", "metadata.json"), "utf-8"),
) as Record<string, any>;
metadata = Object.assign(metadata, {
  image: `${rootURL}/image.jpg`,
});
fs.writeFileSync(
  path.join(rootDir, "metadata.json"),
  JSON.stringify(metadata, null, 2),
);
fs.copyFileSync(
  path.join("assets", "image.jpg"),
  path.join(rootDir, "image.jpg"),
);

// contract items metadata
const items = fs.readdirSync(path.join("assets", "items"));

for (const item of items) {
  if (!item.endsWith(".json")) {
    continue;
  }
  const idDec = item.slice(0, -5);
  const idHex = BigInt(idDec).toString(16).padStart(64, "0");
  let metadata = JSON.parse(
    fs.readFileSync(path.join("assets", "items", item), "utf-8"),
  ) as Record<string, any>;
  metadata = Object.assign(metadata, {
    image: `${rootURL}/items/${idHex}/image.jpg`,
  });
  console.log("writing", idDec, idHex, metadata.name);
  const dir = path.join(rootDir, "items", idHex);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
  );
  fs.copyFileSync(
    path.join("assets", "items", `${idDec}.jpg`),
    path.join(dir, "image.jpg"),
  );
}
