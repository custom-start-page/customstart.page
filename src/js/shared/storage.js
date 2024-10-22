/*! js-cookie v3.0.0-rc.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,r=e.Cookies=t();r.noConflict=function(){return e.Cookies=n,r}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var t={read:function(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};return function n(r,o){function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),n=r.write(n,t);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n+c}}return Object.create({set:i,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var n=document.cookie?document.cookie.split("; "):[],o={},i=0;i<n.length;i++){var c=n[i].split("="),u=c.slice(1).join("=");'"'===u[0]&&(u=u.slice(1,-1));try{var f=t.read(c[0]);if(o[f]=r.read(u,f),e===f)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){i(t,"",e({},n,{expires:-1}))},withAttributes:function(t){return n(this.converter,e({},this.attributes,t))},withConverter:function(t){return n(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(r)}})}(t,{path:"/"})});

/**
 * Originally local storage was used but I wanted the users data to be sent to the server it could render EJS documents server side with the users settings.
 * This is a transitionary stage to gap users who have stored their data in localstorage when it should be cookie.
 */
class CustomStartStorageCookieAndLocalStorage {
    constructor() {
        this.localStorage = new CustomStartStorageLocalStorage();
        this.cookieStorage = new CustomStartStorageCookieStorage();
    }
    async set(obj) {
        this.cookieStorage.set(obj);
    }
    delete() {
        this.cookieStorage.delete();
        this.localStorage.delete();
    }
    async get() {
        let data = await this.localStorage.get();

        if (data != null) {
            this.localStorage.delete();
            this.cookieStorage.set(data);

            return data;
        }

        return this.cookieStorage.get();
    }
}

class CustomStartStorageCookieStorage {
    constructor() {
        this.key = 'customstart-data';
    }
    async set(obj) {
        Cookies.set(this.key, JSON.stringify(obj), {
            expires: 365,
            /* Must be None so that the page can be loaded in an iframe (like when using https://github.com/methodgrab/firefox-custom-new-tab-page) otherwise the cookies can't be loaded in that iframe?! */
            sameSite: 'None',
            secure: true,
        });
    }
    delete() {
        return Cookies.remove(this.key);
    }
    async get() {
        const retrievedObject = Cookies.get(this.key);

        if (retrievedObject) {
            return JSON.parse(retrievedObject);
        }

        return null;
    }
}

class CustomStartStorageLocalStorage {
    constructor() {
        this.key = 'customstart-data';
    }
    async set(obj) {
        localStorage.setItem(this.key, JSON.stringify(obj));
    }
    delete() {
        localStorage.removeItem(this.key);
    }
    async get() {
        const retrievedObject = localStorage.getItem(this.key);

        if (retrievedObject) {
            return JSON.parse(retrievedObject);
        }

        return null;
    }
}

// class CustomStartStorageApi {
//     async set(obj) {
//         const rawResponse = await fetch('/api/data', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(obj)
//         });

//         const content = await rawResponse.json();

//         console.log(content);
//     }
//     delete() {
//         throw "Delete not implemented on API.";
//     }
//     async get() {
//         return await fetch('/api/data')
//             .then(res => res.json())
//             .then(out => {
//                 return out;
//             })
//             .catch(err => { throw err });
//     }
// }

// class CustomStartStorage extends CustomStartStorageLocalStorage {
class CustomStartStorage extends CustomStartStorageCookieAndLocalStorage {
    constructor() {
        super();
    }
    async getDefault() {
        return await fetch("/api/data")
            .then(res => res.json())
            .then(out => {
                return out;
            })
            .catch(err => { throw err });
    }
    async get() {
        const data = await super.get();

        console.log(data);

        if (data != null)
            return data;

        return await this.getDefault();
    }
}
