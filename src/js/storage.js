class Storage {
    constructor(key) {
        this.key = key;
    }
    set(obj) {
        localStorage.setItem(this.key, JSON.stringify(obj));
    }
    get() {
        const retrievedObject = localStorage.getItem(this.key);

        if (retrievedObject) {
            return JSON.parse(retrievedObject);
        }

        return {};
    }
}
