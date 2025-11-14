import { unstable_cache } from "next/cache";
import { getDateKeyValue } from "@/lib/utils/date-utils";
import { CACHE_VERSION } from "@/lib/constants/cache";
import { CacheTag } from "@/lib/enums/cach-tag";

const scanCommand = async (): Promise<any[]> => {
  // Return empty array since we're not using AWS DynamoDB anymore
  return [];
};

const keyValue = getDateKeyValue();
export const getGithubRangeContributions = unstable_cache(
  scanCommand,
  [CACHE_VERSION, "github_range_contributes", keyValue],
  { revalidate: 3600, tags: [CacheTag.Contributions] }
);
