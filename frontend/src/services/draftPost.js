
// Holds the photo and related information while moving between screens.
let draft = null;

// { uri, showAvatar, outfit, mode, areaId, latitude, longitude, placeName }
export function setDraftPost(next) {
  draft = next;
}

export function getDraftPost() {
  return draft;
}

export function clearDraftPost() {
  draft = null;
}
