export const get = (key: string) => {
  return window.localStorage.getItem(key);
};

export const set = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};
