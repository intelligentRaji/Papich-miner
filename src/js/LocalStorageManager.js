class LocalStorageManager {
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    getItem(key, defaultValue) {
        const savedValue = localStorage.getItem(key);
        return savedValue === null ? defaultValue !== null && defaultValue !== void 0 ? defaultValue : null : JSON.parse(savedValue);
    }
}
export const localStorageManager = new LocalStorageManager();
