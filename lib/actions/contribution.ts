"use server";

import { collectGithubContributions } from "@/data/contributions/github";

export const getContributions = async () => {
  try {
    const github_contributions = await collectGithubContributions();

    return {
      success: true,
      data: {
        github_contributions,
      },
    };
  } catch (error) {
    console.error("Error occurred:", error);
    return { success: false, message: "Failed to get contributions" };
  }
};
