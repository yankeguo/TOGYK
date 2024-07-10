import fs from "node:fs";
import path from "node:path";

const entries = fs.readdirSync("items");

for (const entry of entries) {
  if (!entry.endsWith(".json")) {
    continue;
  }
  const idDec = entry.slice(0, -5);
  const idHex = BigInt(idDec).toString(16).padStart(64, "0");
  let metadata = JSON.parse(
    fs.readFileSync(path.join("items", entry), "utf-8"),
  ) as Record<string, any>;
  metadata = Object.assign(metadata, {
    image: `https://nft.yankeguo.com/tokens/YGTOG/items/${idHex}/image.jpg`,
  });
  console.log("writing", idDec, idHex, metadata.name);
  const dir = path.join("assets", "tokens", "YGTOG", "items", idHex);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "metadata.json"),
    JSON.stringify(metadata, null, 2),
  );
  fs.copyFileSync(
    path.join("items", `${idDec}.jpg`),
    path.join(dir, "image.jpg"),
  );
}
