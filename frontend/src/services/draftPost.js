// Holds the photo being turned into a post while moving Camera -> upload.
// Kept in memory instead of route params because photos can be large data URIs.
let draft = null;

// { uri, showAvatar, outfit }
export function setDraftPost(next) {
  draft = next;
}

export function getDraftPost() {
  return draft;
}

export function clearDraftPost() {
  draft = null;
}
