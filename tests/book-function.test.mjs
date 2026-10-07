import assert from "node:assert/strict";
import test from "node:test";

import {
  onRequestOptions,
  onRequestPost,
} from "../functions/api/book.js";

test("OPTIONS returns CORS metadata without contacting the backend", async () => {
  const response = await onRequestOptions();

  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Methods"), "POST, OPTIONS");
});

test("POST rejects non-JSON requests", async () => {
  const response = await onRequestPost({
    request: new Request("https://aimagery.com/api/book", {
      method: "POST",
      body: "not json",
    }),
  });

  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), {
    success: false,
    error: "Content-Type must be application/json",
  });
});

test("POST preserves the booking backend response", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://efb0de45.aimagery-site.pages.dev/api/book");
    assert.equal(init.method, "POST");
    assert.equal(init.headers["Content-Type"], "application/json");
    assert.equal(init.body, '{"test":true}');

    return Response.json(
      { success: false, error: "Missing required property/contact fields" },
      { status: 400 },
    );
  };

  const response = await onRequestPost({
    request: new Request("https://aimagery.com/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"test":true}',
    }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    success: false,
    error: "Missing required property/contact fields",
  });
});
