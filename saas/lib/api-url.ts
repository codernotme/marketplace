export function getApiBaseUrl() {
  const useDirectApi = process.env.NEXT_PUBLIC_USE_DIRECT_API === "true";
  if (!useDirectApi) {
    return "/api/backend";
  }

  const rawUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!rawUrl || rawUrl === "undefined" || rawUrl === "null") {
    return "http://localhost:8000";
  }

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl.replace(/\/$/, "");
  }

  return rawUrl.replace(/\/$/, "");
}