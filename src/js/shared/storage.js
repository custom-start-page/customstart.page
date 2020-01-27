class CustomStartStorage {
    constructor() {
        this.key = 'customstart-data';
    }
    set(obj) {
        localStorage.setItem(this.key, JSON.stringify(obj));
    }
    delete() {
        localStorage.delete(this.key);
    }
    async getDefault() {
        return await fetch('/api/data')
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
