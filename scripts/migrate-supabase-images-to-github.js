const fs = require("fs");
const path = require("path");

const token = process.env.GITHUB_TOKEN;
const repoFull = process.env.GITHUB_REPOSITORY;
const branch = process.env.GITHUB_REF_NAME || "main";
const firebaseDb = (process.env.FIREBASE_DATABASE_URL || "").replace(/\/$/, "");
const defaultSupabase = (process.env.DEFAULT_SUPABASE_URL || "").replace(/\/$/, "");
const bucket = (process.env.SUPABASE_BUCKET || "products").replace(/^\/+|\/+$/g, "");

if (!token || !repoFull || !firebaseDb) {
  throw new Error("Missing GITHUB_TOKEN, GITHUB_REPOSITORY, or FIREBASE_DATABASE_URL");
}

const [owner, repo] = repoFull.split("/");
const pagesBase = repo === `${owner}.github.io`
  ? `https://${owner}.github.io/images/`
  : `https://${owner}.github.io/${repo}/images/`;

function isImageName(name) {
  return /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(String(name || "").split("?")[0]);
}

function fileNameFromValue(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("data:")) return "";
  try {
    if (/^https?:\/\//i.test(raw)) {
      const u = new URL(raw);
      return decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || "");
    }
  } catch (_) {}
  return raw.replace(/^\/+/, "").split("/").pop() || "";
}

function makeDownloadUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("data:")) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const name = fileNameFromValue(raw);
  if (!name || !defaultSupabase) return "";
  return `${defaultSupabase}/storage/v1/object/public/${bucket}/${encodeURIComponent(name)}`;
}

function extractImages(product) {
  const out = [];
  const add = (v) => {
    if (!v) return;
    if (typeof v === "object") v = v.url || v.src || v.path || "";
    v = String(v || "").trim();
    if (!v || v === "محدد شيء" || v.startsWith("data:image/svg")) return;
    const name = fileNameFromValue(v);
    if (isImageName(name)) out.push(v);
  };
  if (Array.isArray(product.images)) product.images.forEach(add);
  else if (product.images && typeof product.images === "object") Object.values(product.images).forEach(add);
  else add(product.images);
  if (!out.length) add(product.image);
  if (!out.length) add(product.img);
  return [...new Set(out)];
}

async function githubGetContent(filePath) {
  const res = await fetch(`https://api.github.com/repos/${repoFull}/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(branch)}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub get failed ${res.status}: ${await res.text()}`);
  return res.json();
}

async function githubPutFile(filePath, buffer, message) {
  const existing = await githubGetContent(filePath);
  if (existing && existing.sha) {
    console.log(`Exists, skip upload: ${filePath}`);
    return;
  }
  const body = {
    message,
    content: buffer.toString("base64"),
    branch
  };
  const res = await fetch(`https://api.github.com/repos/${repoFull}/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`GitHub upload failed ${res.status}: ${await res.text()}`);
}

async function main() {
  console.log("Reading products from Firebase...");
  const res = await fetch(`${firebaseDb}/products.json`);
  if (!res.ok) throw new Error(`Firebase read failed ${res.status}: ${await res.text()}`);
  const products = await res.json() || {};
  const entries = Object.entries(products);
  console.log(`Products found: ${entries.length}`);

  let uploaded = 0;
  let updated = 0;
  let skipped = 0;

  for (const [id, product] of entries) {
    const images = extractImages(product || {});
    if (!images.length) { skipped++; continue; }

    const githubUrls = [];
    for (const img of images) {
      const name = fileNameFromValue(img);
      if (!isImageName(name)) continue;
      const safeName = name.replace(/[\\?#%*:|"<>]/g, "_");
      const targetPath = `images/${safeName}`;
      const targetUrl = pagesBase + encodeURIComponent(safeName).replace(/%20/g, "%20");
      githubUrls.push(targetUrl);

      const existing = await githubGetContent(targetPath);
      if (existing && existing.sha) continue;

      const downloadUrl = makeDownloadUrl(img);
      if (!downloadUrl) continue;
      console.log(`Downloading ${downloadUrl}`);
      const imgRes = await fetch(downloadUrl);
      if (!imgRes.ok) {
        console.log(`Skip ${name}: download failed ${imgRes.status}`);
        continue;
      }
      const arr = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arr);
      if (!buffer.length) continue;
      await githubPutFile(targetPath, buffer, `Add product image ${safeName}`);
      uploaded++;
    }

    if (githubUrls.length) {
      const patch = { images: githubUrls, image: githubUrls[0] };
      if (Array.isArray(product.imgs)) patch.imgs = githubUrls;
      if (typeof product.img === "string") patch.img = githubUrls[0];
      const up = await fetch(`${firebaseDb}/products/${encodeURIComponent(id)}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      if (!up.ok) throw new Error(`Firebase update failed for ${id}: ${up.status} ${await up.text()}`);
      updated++;
      console.log(`Updated product ${id}`);
    }
  }

  console.log(`Done. Uploaded: ${uploaded}, updated products: ${updated}, skipped: ${skipped}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

