import { getEventData } from "./github/events";
import { getGithubContributions } from "./get-contributions";
import { getGithubRangeContributions } from "./get-range-contributions";
import { mergeGithubContributions } from "./merge-contributions";

export const collectGithubContributions = async () => {
  const eventData = await getEventData();
  let contributionsItem = await getGithubContributions();
  const oldContributes = await getGithubRangeContributions();
  
  // If no cached item, create one from event data
  if (!contributionsItem) {
    contributionsItem = {
      contributions: {
        grouped_events: eventData.groupedEvents || [],
        entry_events: [],
        old_grouped_events: [],
      },
      events_count: eventData.allEvents?.length || 0,
    };
  } else if (contributionsItem && ["open"].includes(contributionsItem.status)) {
    contributionsItem = await mergeGithubContributions(
      contributionsItem,
      oldContributes
    );
  }
  
  return contributionsItem;
};
