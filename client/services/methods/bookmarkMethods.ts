import { deleteRequest, getRequest, postRequest } from "../api";

const get = getRequest;
const post = postRequest;
const del = deleteRequest;

export const bookmarkMethods = {
  list: () => get("/bookmarks"),
  create: (payload: { title: string; url: string }) => post("/bookmarks", payload),
  remove: (id: string) => del(`/bookmarks/${id}`),
};
