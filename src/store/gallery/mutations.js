export function SET_ALBUMS(state, albums) {
  state.albums = albums;
  if (state.selectedAlbumId) {
    state.selectedAlbum = state.albums.find(
      a => a.id === state.selectedAlbumId
    );
  }
}

export function SET_PHOTOS(state, photos) {
  state.photos = photos;
}

export function SET_PHOTO_FLAG(state, { photoId, flag }) {
  state.photos.find(p => p.id === photoId).flag = flag;
}

export function ADD_PHOTO(state, photo) {
  state.photos.push(photo);
  state.photos.sort((i, j) => (i.exif_datetime > j.exif_datetime ? 1 : -1));
}

export function SET_PHOTO_SELECTION(state, photoSelection) {
  state.photoSelection = photoSelection;
}

export function SET_PHOTO_SELECTION_ALL(state, value) {
  if (!value) {
    state.photoSelection = [];
  } else {
    state.photoSelection = state.photos.map(photo => photo.id);
  }
}

export function SET_DUPLICATES(state, duplicates) {
  state.duplicates = duplicates;
}

export function SET_SELECTED_ALBUM_IS_SHARED(state, isShared) {
  state.selectedAlbumIsShared = isShared;
}

export function SET_SELECTED_ALBUM_ID(state, albumId) {
  state.selectedAlbum = state.albums.find(a => a.id === albumId);
  state.selectedAlbumId = albumId;
}

export function SET_FILTER(state, filter) {
  state.filter = filter;
}

export function SET_ALBUM_SHARE_DIALOG(state, visible) {
  state.albumShareDialog = visible;
}

export function SET_ALBUM_CREATE_DIALOG(state, visible) {
  state.albumCreateDialog = visible;
}

export function SET_PHOTOS_UPLOAD_DIALOG(state, visible) {
  state.photosUploadDialog = visible;
}

export function SET_ALBUM_RENAME_DIALOG(state, visible) {
  state.albumRenameDialog = visible;
}

export function SET_ALBUM_DELETE_DIALOG(state, visible) {
  state.albumDeleteDialog = visible;
}

export function SET_PHOTOS_MOVE_DIALOG(state, visible) {
  state.photosMoveDialog = visible;
}

export function SET_PHOTOS_DELETE_DIALOG(state, visible) {
  state.photosDeleteDialog = visible;
}

export function SET_PHOTO_EXIF_DIALOG(state, { visible, photo }) {
  state.photoExifDialog = visible;
  state.photoExifPhotoId = photo;
}
