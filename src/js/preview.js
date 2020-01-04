window.reloadPreview = function() {
    document.querySelector('#iframe-preview')
        .contentWindow.location.reload(true);
};

ReactDOM.render((
    <Draggable>
        <div class="edit-container">
            <iframe class="edit" src="/edit?hideFooter=true"></iframe>
        </div>
    </Draggable>
), document.querySelector("body"));
