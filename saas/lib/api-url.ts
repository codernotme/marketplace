export function getApiBaseUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!rawUrl || rawUrl === "undefined" || rawUrl === "null") {
    return "http://localhost:8000";
  }

  return rawUrl.replace(/\/$/, "");
}