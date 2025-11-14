"use server";
import { unstable_cache } from "next/cache";
import { CACHE_VERSION } from "@/lib/constants/cache";
import { getDateKeyValue } from "@/lib/utils/date-utils";
import { CacheTag } from "@/lib/enums/cach-tag";

const getCommand = async (): Promise<any> => {
  // Return null since we're not using AWS DynamoDB anymore
  return null;
};

const keyValue = getDateKeyValue();
export const getGithubContributions = unstable_cache(
  getCommand,
  [CACHE_VERSION, "github_contributes", keyValue],
  {
    tags: [CacheTag.Github, CacheTag.Contributions],
    revalidate: 3600,
  }
);
