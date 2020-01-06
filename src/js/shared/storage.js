class Storage {
    constructor(key) {
        this.key = key;
    }
    set(obj) {
        localStorage.setItem(this.key, JSON.stringify(obj));
    }
    delete() {
        localStorage.delete(this.key);
    }
    async getDefault() {
        return await fetch('/manifest/defaultData.json')
            .then(res => res.json())
            .then(out => {
                return out;
            })
            .catch(err => { throw err });
    }
    async get() {
        const retrievedObject = localStorage.getItem(this.key);

        if (retrievedObject) {
            return JSON.parse(retrievedObject);
        }

        return this.getDefault();
    }
}
