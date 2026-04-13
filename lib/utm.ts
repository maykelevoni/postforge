interface UtmParams {
  source: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

export function buildUtmUrl(
  baseUrl: string,
  params: UtmParams
): string {
  const url = new URL(baseUrl);

  url.searchParams.set("utm_source", params.source);

  if (params.medium) {
    url.searchParams.set("utm_medium", params.medium);
  }

  if (params.campaign) {
    url.searchParams.set("utm_campaign", params.campaign);
  }

  if (params.content) {
    url.searchParams.set("utm_content", params.content);
  }

  return url.toString();
}
