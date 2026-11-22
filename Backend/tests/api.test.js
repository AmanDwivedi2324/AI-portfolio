/**
 * End-to-end API tests against a throwaway local database.
 *   npm test    (needs MongoDB on 127.0.0.1:27017, or set TEST_MONGO_URI)
 */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

process.env.NODE_ENV = "test";
process.env.MONGO_URI = process.env.TEST_MONGO_URI ?? "mongodb://127.0.0.1:27017/portfolio_test";
process.env.MONGO_DB_NAME = ""; // never inherit the live database name from .env
process.env.JWT_SECRET = "test-only-secret-".padEnd(64, "x");
for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) process.env[key] = "";

const { default: mongoose } = await import("mongoose");
const { default: app } = await import("../app.js");
const { connectDB, disconnectDB } = await import("../config/db.js");
const { default: User } = await import("../models/user.model.js");
const { UPLOAD_DIR, cloudinaryUploadOptions, safeBaseName } = await import("../services/storage.service.js");
const PDF_TINY = Buffer.from("%PDF-1.4\n1 0 obj << >> endobj\ntrailer << >>\n%%EOF\n");

const ADMIN = { username: "admin", password: "correct horse battery" };
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

let server;
let base;
let token;
const uploaded = [];

async function api(method, url, { body, auth = token, raw } = {}) {
  const headers = {};
  if (auth) headers.authorization = `Bearer ${auth}`;
  let payload = raw;
  if (body !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(base + url, { method, headers, body: payload });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

const validProfile = {
  firstName: "Aman",
  lastName: "Dwivedi",
  email: "aman@example.com",
  phone: "+91 00000 00000",
  showPhone: false,
  socials: [{ platform: "github", label: "GitHub", url: "https://github.com/example" }],
  stats: [{ value: "3", label: "roles" }],
  quote: { text: "Ship it.", author: "Aman" },
};

before(async () => {
  await connectDB(process.env.MONGO_URI);
  await mongoose.connection.dropDatabase();
  // Rebuild unique indexes (e.g. project slug) that the drop removed.
  await Promise.all(Object.values(mongoose.models).map((model) => model.syncIndexes()));
  const user = new User({ username: ADMIN.username });
  await user.setPassword(ADMIN.password);
  await user.save();
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await Promise.all(uploaded.map((name) => fs.rm(path.join(UPLOAD_DIR, name), { force: true })));
  await mongoose.connection.dropDatabase();
  await disconnectDB();
  server.close();
});

describe("public API", () => {
  test("health check", async () => {
    const res = await api("GET", "/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });

  test("portfolio is empty before seeding", async () => {
    const res = await api("GET", "/api/portfolio");
    assert.equal(res.status, 200);
    assert.equal(res.body.profile, null);
    assert.deepEqual(res.body.projects, []);
  });

  test("unknown routes return JSON 404", async () => {
    const res = await api("GET", "/api/nope");
    assert.equal(res.status, 404);
    assert.match(res.body.error.message, /Route not found/);
  });

  test("the old public register route is gone", async () => {
    const res = await api("POST", "/api/auth/register", { body: { username: "x", password: "y" } });
    assert.equal(res.status, 404);
  });
});

describe("auth", () => {
  test("wrong password and unknown user get the same 401", async () => {
    const wrong = await api("POST", "/api/auth/login", { body: { ...ADMIN, password: "nope" } });
    const unknown = await api("POST", "/api/auth/login", { body: { username: "ghost", password: "nope" } });
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.equal(wrong.body.error.message, unknown.body.error.message);
  });

  test("login returns a token and never the password hash", async () => {
    const res = await api("POST", "/api/auth/login", { body: { ...ADMIN, username: "ADMIN" } });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.username, "admin");
    assert.equal(res.body.user.passwordHash, undefined);
    token = res.body.token;
  });

  test("admin routes reject missing and forged tokens", async () => {
    assert.equal((await api("GET", "/api/admin/dashboard", { auth: null })).status, 401);
    assert.equal((await api("GET", "/api/admin/dashboard", { auth: "abc.def.ghi" })).status, 401);
    assert.equal((await api("POST", "/api/admin/projects", { auth: null, body: {} })).status, 401);
    assert.equal((await api("GET", "/api/admin/dashboard")).status, 200);
  });
});

describe("profile", () => {
  test("invalid fields are reported per field", async () => {
    const res = await api("PUT", "/api/admin/profile", {
      body: { ...validProfile, email: "not-an-email", portraitUrl: "javascript:alert(1)" },
    });
    assert.equal(res.status, 400);
    const paths = res.body.error.details.map((d) => d.path);
    assert.ok(paths.includes("email"));
    assert.ok(paths.includes("portraitUrl"));
  });

  test("unknown fields are rejected", async () => {
    const res = await api("PUT", "/api/admin/profile", { body: { ...validProfile, isAdmin: true } });
    assert.equal(res.status, 400);
  });

  test("saving creates the profile and the site shows it, without the hidden phone", async () => {
    const saved = await api("PUT", "/api/admin/profile", { body: validProfile });
    assert.equal(saved.status, 200);
    const site = await api("GET", "/api/portfolio");
    assert.equal(site.body.profile.firstName, "Aman");
    assert.equal(site.body.profile.phone, undefined);
    assert.equal(site.body.quote.text, "Ship it.");
  });
});

describe("projects CRUD", () => {
  const ids = {};

  test("create validates input", async () => {
    const res = await api("POST", "/api/admin/projects", {
      body: { summary: "x", links: { github: "javascript:alert(1)" } },
    });
    assert.equal(res.status, 400);
    const paths = res.body.error.details.map((d) => d.path);
    assert.ok(paths.includes("title"));
    assert.ok(paths.includes("category"));
    assert.ok(paths.includes("links.github"));
  });

  test("create generates a slug and the next order", async () => {
    const a = await api("POST", "/api/admin/projects", {
      body: { title: "BlogPilot Agent", category: "Agents", summary: "Writes blogs." },
    });
    const b = await api("POST", "/api/admin/projects", {
      body: { title: "Secret WIP", category: "RAG", summary: "Hidden.", visible: false },
    });
    assert.equal(a.status, 201);
    assert.equal(a.body.slug, "blogpilot-agent");
    assert.equal(b.body.order, a.body.order + 1);
    ids.a = a.body._id;
    ids.b = b.body._id;
  });

  test("duplicate slug is a 409", async () => {
    const res = await api("POST", "/api/admin/projects", {
      body: { title: "BlogPilot Agent", category: "Agents", summary: "Again." },
    });
    assert.equal(res.status, 409);
  });

  test("hidden projects stay off the public site", async () => {
    const site = await api("GET", "/api/portfolio");
    assert.deepEqual(
      site.body.projects.map((p) => p.title),
      ["BlogPilot Agent"],
    );
    const admin = await api("GET", "/api/admin/projects");
    assert.equal(admin.body.length, 2);
  });

  test("reorder and partial update", async () => {
    const reordered = await api("PATCH", "/api/admin/projects/reorder", { body: { ids: [ids.b, ids.a] } });
    assert.equal(reordered.status, 200);
    assert.equal(reordered.body[0]._id, ids.b);

    const updated = await api("PUT", `/api/admin/projects/${ids.b}`, { body: { visible: true } });
    assert.equal(updated.status, 200);
    const site = await api("GET", "/api/portfolio");
    assert.deepEqual(
      site.body.projects.map((p) => p.title),
      ["Secret WIP", "BlogPilot Agent"],
    );
  });

  test("invalid ids and deletes", async () => {
    assert.equal((await api("GET", "/api/admin/projects/123")).status, 400);
    assert.equal((await api("DELETE", `/api/admin/projects/${ids.b}`)).status, 204);
    assert.equal((await api("GET", `/api/admin/projects/${ids.b}`)).status, 404);
  });
});

describe("contact messages", () => {
  test("validation, honeypot and the admin inbox", async () => {
    const bad = await api("POST", "/api/contact", { auth: null, body: { name: "A", email: "x", message: "hi" } });
    assert.equal(bad.status, 400);

    const ok = await api("POST", "/api/contact", {
      auth: null,
      body: { name: "Recruiter", email: "hr@example.com", message: "We'd love to talk about a role." },
    });
    assert.equal(ok.status, 201);

    const bot = await api("POST", "/api/contact", {
      auth: null,
      body: { name: "Bot", email: "bot@example.com", message: "Buy cheap things now!!", website: "spam.example" },
    });
    assert.equal(bot.status, 201);

    const inbox = await api("GET", "/api/admin/messages?status=unread");
    assert.equal(inbox.body.length, 1);
    assert.equal(inbox.body[0].name, "Recruiter");

    const read = await api("PATCH", `/api/admin/messages/${inbox.body[0]._id}`, { body: { read: true } });
    assert.equal(read.body.read, true);
    assert.equal((await api("GET", "/api/admin/messages?status=unread")).body.length, 0);
  });
});

describe("uploads", () => {
  const send = (buffer, type, name, kind = "image") => {
    const form = new FormData();
    form.append("file", new Blob([buffer], { type }), name);
    return fetch(`${base}/api/admin/uploads?kind=${kind}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    }).then(async (res) => ({ status: res.status, body: await res.json() }));
  };

  test("rejects a file that only pretends to be an image", async () => {
    const res = await send(Buffer.from("<script>alert(1)</script>"), "image/png", "evil.png");
    assert.equal(res.status, 400);
  });

  test("rejects a disallowed type", async () => {
    const res = await send(Buffer.from("hello"), "text/html", "x.html");
    assert.equal(res.status, 400);
  });

  test("stores a real image and serves it", async () => {
    const res = await send(PNG_1X1, "image/png", "pixel.png");
    assert.equal(res.status, 201);
    assert.match(res.body.url, /^\/uploads\/.+\.png$/);
    uploaded.push(path.basename(res.body.url));
    const file = await fetch(base + res.body.url);
    assert.equal(file.status, 200);
    assert.equal(file.headers.get("content-type"), "image/png");
  });
});

describe("documents (résumé PDFs)", () => {
  test("are stored in the database and download as a named .pdf", async () => {
    const form = new FormData();
    form.append("file", new Blob([PDF_TINY], { type: "application/pdf" }), "Aman Résumé (final).pdf");
    const res = await fetch(`${base}/api/admin/uploads?kind=document`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form,
    });
    const body = await res.json();
    assert.equal(res.status, 201);
    assert.equal(body.storage, "database");
    assert.match(body.url, /^\/api\/files\/[a-f\d]{24}\/Aman_Resume_final\.pdf$/);

    // Public download, no auth needed.
    const file = await fetch(base + body.url);
    assert.equal(file.status, 200);
    assert.equal(file.headers.get("content-type"), "application/pdf");
    assert.match(file.headers.get("content-disposition"), /^attachment; filename="Aman_Resume_final\.pdf"/);
    assert.deepEqual(Buffer.from(await file.arrayBuffer()), PDF_TINY);
  });

  test("unknown or invalid file ids", async () => {
    assert.equal((await fetch(`${base}/api/files/${"a".repeat(24)}/x.pdf`)).status, 404);
    assert.equal((await fetch(`${base}/api/files/not-an-id/x.pdf`)).status, 400);
  });

  test("images still go to Cloudinary as images", () => {
    assert.equal(cloudinaryUploadOptions().resource_type, "image");
  });

  test("unsafe or empty names are cleaned", () => {
    assert.equal(safeBaseName("../../etc/passwd"), "passwd");
    assert.equal(safeBaseName(""), "file");
    assert.equal(safeBaseName("Aman_Final_Resume__Copy__Copy__for_aiml.pdf"), "Aman_Final_Resume_Copy_Copy_for_aiml");
  });
});

describe("password change", () => {
  test("requires the current password and signs out old sessions", async () => {
    const wrong = await api("PUT", "/api/auth/password", {
      body: { currentPassword: "nope", newPassword: "a brand new passphrase" },
    });
    assert.equal(wrong.status, 400);

    const oldToken = token;
    const ok = await api("PUT", "/api/auth/password", {
      body: { currentPassword: ADMIN.password, newPassword: "a brand new passphrase" },
    });
    assert.equal(ok.status, 200);
    token = ok.body.token;

    assert.equal((await api("GET", "/api/auth/me", { auth: oldToken })).status, 401);
    assert.equal((await api("GET", "/api/auth/me")).status, 200);
  });
});
