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

            .button-container {
                position: fixed;
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
