export type BookmarkFormData = {
  title: string;
  url: string;
};

export type BookmarkErrors = Partial<Record<keyof BookmarkFormData, string>>;

export const validateBookmark = (data: BookmarkFormData): BookmarkErrors => {
  const errors: BookmarkErrors = {};

  if (!data.title.trim()) {
    errors.title = "Title is required";
  } else if (data.title.trim().length > 200) {
    errors.title = "Title must be 200 characters or less";
  }

  if (!data.url.trim()) {
    errors.url = "URL is required";
  } else if (data.url.trim().length > 2048) {
    errors.url = "URL must be 2048 characters or less";
  } else {
    const withProtocol = /^https?:\/\//i.test(data.url.trim())
      ? data.url.trim()
      : `https://${data.url.trim()}`;
    try {
      new URL(withProtocol);
    } catch {
      errors.url = "Enter a valid URL";
    }
  }

  return errors;
};
