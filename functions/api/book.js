const BOOKING_BACKEND = "https://efb0de45.aimagery-site.pages.dev/api/book";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const contentType = context.request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { success: false, error: "Content-Type must be application/json" },
      { status: 415, headers: corsHeaders },
    );
  }

  const upstream = await fetch(BOOKING_BACKEND, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await context.request.text(),
  });

  const headers = new Headers(corsHeaders);
  headers.set(
    "Content-Type",
    upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers,
  });
}

