class CustomStartStorage {
    constructor() {
        this.key = 'customstart-data';
    }
    async set(obj) {
        // localStorage.setItem(this.key, JSON.stringify(obj));

        const rawResponse = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        const content = await rawResponse.json();

        console.log(content);
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
        // const retrievedObject = localStorage.getItem(this.key);

        // if (retrievedObject) {
        //     return JSON.parse(retrievedObject);
        // }

        // return this.getDefault();

        return await fetch('/api/data')
            .then(res => res.json())
            .then(out => {
                return out;
            })
            .catch(err => { throw err });
    }
}
