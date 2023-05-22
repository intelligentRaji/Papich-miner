function isCallable(fn) {
    return typeof fn === "function";
}
export class Observable {
    constructor(initialValue) {
        this.value = initialValue;
        this.listeners = [];
    }
    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.value);
    }
    unsubscribe(listener) {
        this.listeners = this.listeners.filter((elem) => elem !== listener);
    }
    notify(params) {
        if (isCallable(params)) {
            this.value = params(this.value);
        }
        else {
            this.value = params;
        }
        this.listeners.forEach((listener) => listener(this.value));
    }
    getValue() {
        return this.value;
    }
}
