customElements.define('start-page', class extends HTMLElement {
    constructor() {
        super();

        fetch('/index.html')
            .then(res => res.text())
            .then(text => {
                console.log(text);
                shadowRoot.innerHTML = text;
            });

        const shadowRoot = this.attachShadow({mode: 'open'});
        // shadowRoot.innerHTML = this.innerHTML;
    }
});
