export function getLocalStorageItem(key) {
    const stringifyItem = localStorage.getItem(key);
    let res = null;
    if (stringifyItem !== null) {
        res = JSON.parse(stringifyItem);
    }
    return res;
}
