import { trpc } from '@/providers/trpc';
import { defaultSiteContent, type SiteContent } from '@contracts/site-content';

export function useSiteContent(): SiteContent {
  const { data } = trpc.siteContent.get.useQuery(undefined, {
    staleTime: 60_000,
  });
  return data ?? defaultSiteContent;
}
