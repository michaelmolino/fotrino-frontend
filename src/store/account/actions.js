import { LocalStorage, Notify, Dark } from 'quasar';
import axios from 'axios';

export function fetchProfile(context) {
  return axios
    .get('/api/account/profile')
    .then(response => {
      context.commit('SET_PROFILE', response.data);
    })
    .catch(error => {
      context.commit('SET_PROFILE', null);
      if (error.response.status !== 403) {
        Notify.create({
          type: 'negative',
          message: error.response.data,
          icon: 'warning',
          multiLine: true
        });
      }
    });
}

export function setDarkMode(context, darkMode) {
  context.commit('SET_DARK_MODE', darkMode);
  LocalStorage.set('darkMode', darkMode);
  Dark.set(darkMode);
}

export function setAutoUpload(context, autoUpload) {
  context.commit('SET_AUTO_UPLOAD', autoUpload);
  LocalStorage.set('autoUpload', autoUpload);
}

export function setUploadThreads(context, uploadThreads) {
  context.commit('SET_UPLOAD_THREADS', uploadThreads);
  LocalStorage.set('uploadThreads', uploadThreads);
}

export function setHashingThreads(context, hashingThreads) {
  context.commit('SET_HASHING_THREADS', hashingThreads);
  LocalStorage.set('hashingThreads', hashingThreads);
}

export function setDesktopSplitter(context, splitter) {
  context.commit('SET_DESKTOP_SPLITTER', splitter);
  LocalStorage.set('desktopSplitter', splitter);
}

export function setMobileSplitter(context, splitter) {
  context.commit('SET_MOBILE_SPLITTER', splitter);
  LocalStorage.set('mobileSplitter', splitter);
}
