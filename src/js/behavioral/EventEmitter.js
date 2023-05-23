export class EventEmitter {
    constructor() {
        this.events = {};
    }
    subscribe(key, callback) {
        this.events[key] = callback;
    }
    unsubscribe(key) {
        delete this.events[key];
    }
    emit(key, ...args) {
        this.events[key](...args);
    }
}
