window.reloadPreview = function() {
    document.querySelector('#iframe-preview')
        .contentWindow.location.reload(true);
};
