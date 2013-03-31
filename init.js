/* vi: set sw=4 et sts=4: */
// fake plugin.id = 'style-input'
plugin.major = 0;
plugin.minor = 2;
plugin.version = plugin.major + '.' + plugin.minor;
plugin.id = 'style-input';
plugin.description = "use the same font/colors in the input box as in the message area";

function plug(name) {
    return plugin.id + ':' + name;
}

plugin.init = function init() {
};

function change_css(css) {
    ['input', 'multiline-input'].forEach(function (id) {
        var elem = document.getElementById(id);
        if (typeof css === 'string') {
            elem.setAttribute('style', css);
        } else {
            elem.removeAttribute('style');
        }
    });
}

plugin.enable = function enable() {
    function sync_font(e) {
        var css = client.getFontCSS();
        css = css.replace(/^[^{}]+\{/, '').replace(/\}\s*$/, '');

        var body = client.frame.contentDocument.querySelector('body.chatzilla-body'), style;
        if (body && (style = getComputedStyle(body)).backgroundColor !== 'transparent') {
            css += '-moz-appearance:none;';
            css += 'color:' + style.color + ';';
            css += 'background-color:' + style.backgroundColor + ';';
        } else {
            setTimeout(sync_font, 200);  // kludge
        }

        change_css(css);
    }

    client.commandManager.addHook(
        'sync-font',
        sync_font,
        plug('sync-font'),
        false
    );
    client.commandManager.addHook(
        'sync-motif',
        sync_font,
        plug('sync-motif'),
        false
    );

    sync_font();

    return true;
};

plugin.disable = function disable() {
    client.commandManager.removeHook(
        'sync-font',
        plug('sync-font'),
        false
    );
    client.commandManager.removeHook(
        'sync-motif',
        plug('sync-motif'),
        false
    );

    change_css();

    return true;
};
