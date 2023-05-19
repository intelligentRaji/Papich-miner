export function getLocalStorageItem<T>(key: string): T | null {
  const stringifyItem = localStorage.getItem(key);
  let res: T;
  if (stringifyItem) {
    res = JSON.parse(stringifyItem);
    return res;
  }
  return null;
}
