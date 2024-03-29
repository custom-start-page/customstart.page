/*! js-cookie v2.2.1 | MIT */

!function(a){var b;if("function"==typeof define&&define.amd&&(define(a),b=!0),"object"==typeof exports&&(module.exports=a(),b=!0),!b){var c=window.Cookies,d=window.Cookies=a();d.noConflict=function(){return window.Cookies=c,d}}}(function(){function a(){for(var a=0,b={};a<arguments.length;a++){var c=arguments[a];for(var d in c)b[d]=c[d]}return b}function b(a){return a.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}function c(d){function e(){}function f(b,c,f){if("undefined"!=typeof document){f=a({path:"/"},e.defaults,f),"number"==typeof f.expires&&(f.expires=new Date(1*new Date+864e5*f.expires)),f.expires=f.expires?f.expires.toUTCString():"";try{var g=JSON.stringify(c);/^[\{\[]/.test(g)&&(c=g)}catch(j){}c=d.write?d.write(c,b):encodeURIComponent(c+"").replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),b=encodeURIComponent(b+"").replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var h="";for(var i in f)f[i]&&(h+="; "+i,!0!==f[i]&&(h+="="+f[i].split(";")[0]));return document.cookie=b+"="+c+h}}function g(a,c){if("undefined"!=typeof document){for(var e={},f=document.cookie?document.cookie.split("; "):[],g=0;g<f.length;g++){var h=f[g].split("="),i=h.slice(1).join("=");c||'"'!==i.charAt(0)||(i=i.slice(1,-1));try{var j=b(h[0]);if(i=(d.read||d)(i,j)||b(i),c)try{i=JSON.parse(i)}catch(k){}if(e[j]=i,a===j)break}catch(k){}}return a?e[a]:e}}return e.set=f,e.get=function(a){return g(a,!1)},e.getJSON=function(a){return g(a,!0)},e.remove=function(b,c){f(b,"",a(c,{expires:-1}))},e.defaults={},e.withConverter=c,e}return c(function(){})});

const getDomainName = () => {
    const hostName = window.location.hostname;

    const split = hostName.split('.');

    // Should only match the case where it's *.localhost.
    if (split.length === 2) {
        return split[1];
    } else {
        return split[split.length - 2] + '.' + split[split.length - 1] + ':' + window.location.port;
    }
};

class Modal extends HTMLElement {
    constructor() {
        super();
        this._modalVisible = false;
        this._modal = null;
        this._iframe = null;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            /* Icons from https://css.gg */

            .gg-close {
                box-sizing: border-box;
                position: relative;
                display: block;
                transform: scale(var(--ggs,1));
                width: 22px;
                height: 22px;
                border: 2px solid transparent;
                border-radius: 40px
            }
            .gg-close::after,
            .gg-close::before {
                content: "";
                display: block;
                box-sizing: border-box;
                position: absolute;
                width: 16px;
                height: 2px;
                background: currentColor;
                transform: rotate(45deg);
                border-radius: 5px;
                top: 8px;
                left: 1px
            }
            .gg-close::after {
                transform: rotate(-45deg)
            }

            .gg-bell, .gg-bell::before {
                border-top-left-radius: 100px;
                border-top-right-radius: 100px
            }
            .gg-bell {
                box-sizing: border-box;
                position: relative;
                display: block;
                transform: scale(var(--ggs,1));
                border: 2px solid;
                border-bottom: 0;
                width: 14px;
                height: 14px
            }
            .gg-bell::after,
            .gg-bell::before {
                content: "";
                display: block;
                box-sizing: border-box;
                position: absolute
            }
            .gg-bell::before {
                background: currentColor;
                width: 4px;
                height: 4px;
                top: -4px;
                left: 3px
            }
            .gg-bell::after {
                border-radius: 3px;
                width: 16px;
                height: 10px;
                border: 6px solid transparent;
                border-top: 1px solid transparent;
                box-shadow:
                    inset 0 0 0 4px,
                    0 -2px 0 0;
                top: 14px;
                left: -3px;
                border-bottom-left-radius: 100px;
                border-bottom-right-radius: 100px
            }

            .modal-background {
                display: none;
                position: fixed;
                z-index: 2147483647;
                padding-top: 100px;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }

            .modal-content {
                position: relative;
                background-color: #fefefe;
                margin: auto;
                padding: 0;
                border: 1px solid #888;
                width: 80%;
                height: 80%;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                -webkit-animation-name: animatetop;
                -webkit-animation-duration: 0.4s;
                animation-name: animatetop;
                animation-duration: 0.4s
            }

            iframe {
                width: 100%;
                height: 100%;
                border: 0;
            }

            /* Add Animation */
            @-webkit-keyframes animatetop {
                from {top:-300px; opacity:0}
                to {top:0; opacity:1}
            }

            @keyframes animatetop {
                from {top:-300px; opacity:0}
                to {top:0; opacity:1}
            }

            .close {
                color: white;
                float: right;
                --ggs: 2;
                margin: 20px;
            }

            .close:hover, .close:focus {
                color: #000;
                text-decoration: none;
                cursor: pointer;
            }

            .modal-header {
                padding: 2px;
                background-color: #326cf2;
                color: white;
                overflow: hidden;
            }

            .button-container {
                position: fixed;
                z-index: 2147483647;
                right: 0;
                bottom: 0;
                width: 100px;
                height: 100px;
                overflow: hidden;
            }

            button {
                position: absolute;
                right: 0;
                bottom: 0;
                background-color: #326cf2;
                width: 100%;
                height: 100%;
                border: 0;
                transform: rotate(45deg) translate(70%, 0);
                box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0;
                cursor: pointer;
            }

            .button-inner {
                transform: rotate(-45deg);
                position: absolute;
                top: 45px;
                left: 10px;
                color: white;
            }
        </style>
        <div class="button-container">
            <button>
                <span class="button-inner">
                    <i class="gg-bell"></i>
                </span>
            </button>
        </div>
        <div class="modal-background">
            <div class="modal-content">
                <div class="modal-header">
                    <i class="close gg-close"></i>
                </div>
                <iframe></iframe>
            </div>
        </div>`;
    }
    connectedCallback() {
        this._iframe = this.shadowRoot.querySelector("iframe");
        this._modal = this.shadowRoot.querySelector(".modal-background");
        this.shadowRoot.querySelector("button").addEventListener('click', this._showModal.bind(this));
        this.shadowRoot.querySelector(".close").addEventListener('click', this._hideModal.bind(this));
    }
    disconnectedCallback() {
        this.shadowRoot.querySelector("button").removeEventListener('click', this._showModal);
        this.shadowRoot.querySelector(".close").removeEventListener('click', this._hideModal);
    }
    _onShow() {
        const notificationStorage = new NotificationStorage();

        notificationStorage.update(Date.now());
    }
    _loadIframe() {
        this._iframe.src = '//' + getDomainName() + '/news';
    }
    _showModal() {
        this._modalVisible = true;
        this._modal.style.display = 'block';

        this._loadIframe();

        this._onShow();
    }
    _hideModal() {
        this._modalVisible = false;
        this._modal.style.display = 'none';
    }
}

customElements.define('custom-start-page-modal', Modal);

class Notification {
    // /**
    //  * @type {Date}
    //  * @memberof Notification
    //  */
    // date;
    // /**
    //  * @type {string}
    //  * @memberof Notification
    //  */
    // bodyText;
    constructor(obj) {
        this.date = new Date(obj.date);
        this.bodyText = obj.bodyText;
    }
}

class NotificationApiClient {
    constructor() {
        this.baseApi = '//' + getDomainName() + '/api/notifications';
    }
    /**
     * @returns {Promise<Notification[]>}
     * @memberof NotificationApiClient
     */
    async get() {
        return await fetch(this.baseApi)
            .then(res => res.json())
            .then(items => {
                return items.map(item => new Notification(item));
            })
            .catch(err => { throw err });
    }
}

/**
 * For storing the status of this users notifcation status.
 */
class NotificationStorage {
    constructor() {
        this.storageKey = 'customstart-news';
    }
    get() {
        const retrievedObject = Cookies.get(this.storageKey);

        if (retrievedObject) {
            const parsedObj = JSON.parse(retrievedObject);

            parsedObj.date = new Date(parsedObj.date);

            return parsedObj;
        }

        this.update(new Date(0));

        return this.get();
    }
    update(newDate) {
        this._set({
            version: '0.0.1',
            date: newDate,
        });
    }
    _set(obj) {
        Cookies.set(this.storageKey, obj, {
            expires: 365,
            domain: '.' + getDomainName(),
        });
    }
}

/**
 * Creates a clickable area that shows the notifications if the user clicks on it.
 * @class NotificationModalTrigger
 */
class NotificationModalTrigger {
    show() {
        const modal = document.createElement('custom-start-page-modal');

        document.querySelector('body')
            .appendChild(modal);
    }
    _isIframe() {
        return window != window.top;
    }
    async shouldShow() {
        if (this._isIframe()) {
            return false
        }

        const notificationStorage = new NotificationStorage();
        const notificationApiClient = new NotificationApiClient();

        const notifications = await notificationApiClient.get()

        return notificationStorage.get().date < notifications[0].date;
    }
}

(async function() {
    const notificationModalTrigger = new NotificationModalTrigger();

    if (await notificationModalTrigger.shouldShow()) {
        notificationModalTrigger.show();
    }
}());
