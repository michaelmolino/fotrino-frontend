export default function() {
  return {
    albums: [],
    photos: [],
    photoSelection: [],
    duplicates: [],
    selectedAlbumIsShared: false,
    selectedAlbumId: null,
    selectedAlbum: null,
    filter: null,
    albumShareDialog: false,
    albumCreateDialog: false,
    photosUploadDialog: false,
    albumRenameDialog: false,
    albumDeleteDialog: false,
    photosMoveDialog: false,
    photosDeleteDialog: false,
    photoExifDialog: false,
    photoExifPhotoId: null
  };
}
