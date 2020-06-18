export function albums(state) {
  return state.albums;
}

export function photos(state) {
  return state.photos;
}

export function photoSelection(state) {
  return state.photoSelection;
}

export function duplicates(state) {
  return state.duplicates;
}

export function selectedAlbumIsShared(state) {
  return state.selectedAlbumIsShared;
}

export function selectedAlbumId(state) {
  // if (!albums.map(a => a.id).includes(state.selectedAlbumId)) {
  //   return null;
  // }
  return state.selectedAlbumId;
}

export function similarFilter(state) {
  return state.similarFilter;
}

export function albumShareDialog(state) {
  return state.albumShareDialog;
}

export function albumCreateDialog(state) {
  return state.albumCreateDialog;
}

export function photosUploadDialog(state) {
  return state.photosUploadDialog;
}

export function albumRenameDialog(state) {
  return state.albumRenameDialog;
}

export function albumDeleteDialog(state) {
  return state.albumDeleteDialog;
}

export function photosMoveDialog(state) {
  return state.photosMoveDialog;
}

export function photosDeleteDialog(state) {
  return state.photosDeleteDialog;
}

export function photoExifDialog(state) {
  return state.photoExifDialog;
}

export function photoExifPhotoId(state) {
  return state.photoExifPhotoId;
}
