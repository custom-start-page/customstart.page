class Storage {
    constructor(key) {
        this.key = key;
    }
    set(obj) {
        localStorage.setItem(this.key, JSON.stringify(obj));
    }
    async get() {
        const retrievedObject = localStorage.getItem(this.key);

        if (retrievedObject) {
            return JSON.parse(retrievedObject);
        }

        return await fetch('/manifest/defaultData.json')
            .then(res => res.json())
            .then(out => {
                return out;
            })
            .catch(err => { throw err });
    }
}
