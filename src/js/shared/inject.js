class Modal extends HTMLElement {
    constructor() {
        super();
        this._modalVisible = false;
        this._modal;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            /* The Modal (background) */
            .modal {
                display: none;
                position: fixed;
                z-index: 1;
                padding-top: 100px;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }

            /* Modal Content */
            .modal-content {
                position: relative;
                background-color: #fefefe;
                margin: auto;
                padding: 0;
                border: 1px solid #888;
                width: 80%;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
                -webkit-animation-name: animatetop;
                -webkit-animation-duration: 0.4s;
                animation-name: animatetop;
                animation-duration: 0.4s
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

            /* The Close Button */
            .close {
                color: white;
                float: right;
                font-size: 28px;
                font-weight: bold;
            }

            .close:hover,
            .close:focus {
            color: #000;
            text-decoration: none;
            cursor: pointer;
            }

            .modal-header {
            padding: 2px 16px;
            background-color: #000066;
            color: white;
            }

            .modal-body {padding: 2px 16px; margin: 20px 2px}

            // button {
            //     position: absolute;
            //     bottom: 50px;
            //     right: 50px;
            //     width: 50px;
            //     height: 50px;
            //     background-color: red;
            //     border-radius: 50%;
            //     border: 0;
            // }

            button {
                position: absolute;
                will-change: box-shadow;
                text-decoration: none;
                text-align: center;
                line-height: 50px;
                border-radius: 50%;
                font-size: 24px;
                height: 50px;
                width: 50px;
                bottom: 50px;
                right: 50px;
                padding: 0;
                overflow: hidden;
                background: rgb(63, 81, 181);
                box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0
                rgba(0,0,0,.24);
                border: none;
                cursor: pointer;
                color: white;
            }
        </style>
        <button>&plus;</button>
        <div class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="close">&times;</span>
                    <slot name="header"><h1>Default text</h1></slot>
                </div>
                <div class="modal-body">
                    <slot><slot>
                </div>
            </div>
        </div>
        `
    }
    connectedCallback() {
        this._modal = this.shadowRoot.querySelector(".modal");
        this.shadowRoot.querySelector("button").addEventListener('click', this._showModal.bind(this));
        this.shadowRoot.querySelector(".close").addEventListener('click', this._hideModal.bind(this));
    }
    disconnectedCallback() {
        this.shadowRoot.querySelector("button").removeEventListener('click', this._showModal);
        this.shadowRoot.querySelector(".close").removeEventListener('click', this._hideModal);
    }
    _showModal() {
        this._modalVisible = true;
        this._modal.style.display = 'block';
    }
    _hideModal() {
        this._modalVisible = false;
        this._modal.style.display = 'none';
    }
}

customElements.define('pp-modal', Modal);

class Message {
    constructor(header, message) {
        this.header = header;
        this.message = message;
    }
    show() {
        const modal = document.createElement('pp-modal');
        modal.innerHTML = `<h1 slot="header">${this.header}</h1>${this.message}`;

        document.querySelector('body')
            .appendChild(modal);
    }
}

new Message("News!", `<p>Good news!</p>`)
    .show();
