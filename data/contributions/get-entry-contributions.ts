import { unstable_cache } from "next/cache";
import { getDateKeyValue } from "@/lib/utils/date-utils";
import { CACHE_VERSION } from "@/lib/constants/cache";
import { CacheTag } from "@/lib/enums/cach-tag";

const getCommandWithEntry = async (): Promise<any> => {
  // Return null since we're not using AWS DynamoDB anymore
  return null;
};

const keyValue = getDateKeyValue();
export const getGithubEntryContributions = unstable_cache(
  getCommandWithEntry,
  [CACHE_VERSION, "contributes_entry", keyValue],
  { revalidate: 3600, tags: [CacheTag.Contributions] }
);
