// Web Worker: runs engine calls off the page so the screen never freezes.
import { run } from './api.js';

self.onmessage = (e) => {
  const { id, fn, args } = e.data;
  try {
    self.postMessage({ id, result: run(fn, args) });
  } catch (err) {
    self.postMessage({ id, error: err.message });
  }
};
