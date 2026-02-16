import { throwError } from "./response";
import { MESSAGES } from "../const/messages";

export const validateBookmarkInput = (title: string, url: string) => {
  const trimmedTitle = title?.trim();
  const trimmedUrl = url?.trim();

  if (!trimmedTitle || !trimmedUrl) {
    throwError(MESSAGES.BOOKMARK.INVALID_INPUT);
  }

  if (trimmedTitle.length > 200) {
    throwError("Title must be 200 characters or less.");
  }

  if (trimmedUrl.length > 2048) {
    throwError("URL must be 2048 characters or less.");
  }
};
