import { Notify } from 'quasar';
import axios from 'axios';

export function fetchAlbums(context) {
  return axios
    .get('/api/albums')
    .then(response => {
      const albums = response.data;
      const sortedAlbums = [albums.find(a => a.name === 'Unsorted')].concat(
        albums
          .filter(a => a.name !== 'Unsorted')
          .sort((a1, a2) => (a1.name > a2.name ? 1 : -1))
      );
      context.commit('SET_ALBUMS', sortedAlbums);
    })
    .catch(error => {
      Notify.create({
        type: 'negative',
        message: error.response.data,
        icon: 'warning',
        multiLine: true
      });
    });
}

export function fetchPhotos(context, album) {
  if (album !== null) {
    axios
      .get('/api/photos/' + album)
      .then(response => {
        context.commit('SET_PHOTOS', response.data);
      })
      .catch(error => {
        Notify.create({
          type: 'negative',
          message: error.response.data,
          icon: 'warning',
          multiLine: true
        });
      });
  } else {
    context.commit('SET_PHOTOS', []);
  }
}

export function fetchSharedPhotos(context, album) {
  if (album !== null) {
    axios
      .get('/api/photos/shared/' + album)
      .then(response => {
        context.commit('SET_PHOTOS', response.data);
      })
      .catch(error => {
        Notify.create({
          type: 'negative',
          message: error.response.data,
          icon: 'warning',
          multiLine: true
        });
      });
  } else {
    context.commit('SET_PHOTOS', []);
  }
}

export function setPhotoFlag(context, { photos, flag }) {
  const force = photos.length !== 1;
  const newPhotos = [];
  photos.forEach(photo => {
    let newFlag = null;
    if (force) {
      newFlag = flag;
    } else {
      newFlag = photo.flag !== flag ? flag : null;
    }
    context.commit('SET_PHOTO_FLAG', {
      photoId: photo.id,
      flag: newFlag
    });
    const newPhoto = Object.assign({}, photo);
    newPhoto.flag = newFlag;
    newPhotos.push(newPhoto);
  });

  axios.put('/api/photos', newPhotos).catch(error => {
    Notify.create({
      type: 'negative',
      message: error.response.data,
      icon: 'warning',
      multiLine: true
    });
  });
}

export function addPhoto(context, photo) {
  context.commit('ADD_PHOTO', photo);
}

export function setPhotoSelection(context, selection) {
  context.commit('SET_PHOTO_SELECTION', selection);
}

export function setPhotoSelectionAll(context, value) {
  context.commit('SET_PHOTO_SELECTION_ALL', value);
}

export function fetchDuplicates(context, album) {
  axios
    .get('/api/photos/similar/' + album)
    .then(response => {
      context.commit('SET_DUPLICATES', response.data);
    })
    .catch(error => {
      Notify.create({
        type: 'negative',
        message: error.response.data,
        icon: 'warning',
        multiLine: true
      });
    });
}

export function setSelectedAlbumIsShared(context, isShared) {
  context.commit('SET_SELECTED_ALBUM_IS_SHARED', isShared);
}

export function setSelectedAlbumId(context, albumId) {
  return new Promise(resolve => {
    context.commit('SET_FILTER', null);
    context.commit('SET_PHOTOS', []);
    context.commit('SET_ALBUM_CREATE_DIALOG', false);
    context.commit('SET_PHOTOS_UPLOAD_DIALOG', false);
    context.commit('SET_FILTER', null);
    context.commit('SET_ALBUM_SHARE_DIALOG', false);
    context.commit('SET_ALBUM_RENAME_DIALOG', false);
    context.commit('SET_ALBUM_DELETE_DIALOG', false);
    context.commit('SET_PHOTOS_MOVE_DIALOG', false);
    context.commit('SET_PHOTOS_DELETE_DIALOG', false);
    context.commit('SET_PHOTO_SELECTION', []);
    context.commit('SET_SELECTED_ALBUM_ID', albumId);
    resolve(albumId);
  });
}

export function setFilter(context, filter) {
  context.commit('SET_FILTER', filter);
}

export function setAlbumShareDialog(context, visible) {
  context.commit('SET_ALBUM_SHARE_DIALOG', visible);
}

export function setAlbumCreateDialog(context, visible) {
  context.commit('SET_ALBUM_CREATE_DIALOG', visible);
}

export function setPhotosUploadDialog(context, visible) {
  context.commit('SET_PHOTOS_UPLOAD_DIALOG', visible);
}

export function setAlbumRenameDialog(context, visible) {
  context.commit('SET_ALBUM_RENAME_DIALOG', visible);
}

export function setAlbumDeleteDialog(context, visible) {
  context.commit('SET_ALBUM_DELETE_DIALOG', visible);
}

export function setPhotosMoveDialog(context, visible) {
  context.commit('SET_PHOTOS_MOVE_DIALOG', visible);
}

export function setPhotosDeleteDialog(context, visible) {
  context.commit('SET_PHOTOS_DELETE_DIALOG', visible);
}

export function setPhotoExifDialog(context, { visible, photo }) {
  context.commit('SET_PHOTO_EXIF_DIALOG', { visible, photo });
}
