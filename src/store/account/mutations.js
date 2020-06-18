export function SET_PROFILE(state, profile) {
  state.profile = profile;
  state.isLoggedIn = profile !== null;
}

export function SET_DARK_MODE(state, darkMode) {
  state.darkMode = darkMode;
}

export function SET_AUTO_UPLOAD(state, autoUpload) {
  state.autoUpload = autoUpload;
}

export function SET_UPLOAD_THREADS(state, uploadThreads) {
  state.uploadThreads = uploadThreads;
}

export function SET_HASHING_THREADS(state, hashingThreads) {
  state.hashingThreads = hashingThreads;
}

export function SET_DESKTOP_SPLITTER(state, splitter) {
  state.desktopSplitter = splitter;
}

export function SET_MOBILE_SPLITTER(state, splitter) {
  state.mobileSplitter = splitter;
}
