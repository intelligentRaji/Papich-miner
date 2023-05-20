export function getLocalStorageItem<T>(key: string): T | null {
  const stringifyItem = localStorage.getItem(key);
  let res: T | null = null;
  if (stringifyItem !== null) {
    res = JSON.parse(stringifyItem);
  }
  return res;
}
