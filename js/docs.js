function copy(text){
    const parent = text.closest('.code-block') || text.parentElement;
    const code = parent.querySelector('code');
    const range = document.createRange();
    range.selectNode(code);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    if (!navigator.clipboard){
        document.execCommand('copy');
    } else {
        try {
            navigator.clipboard.writeText(range.toString())
        } catch (error){}
    }
}

function wrapCodeBlock(pre) {
    var code = pre.querySelector('code');
    var lang = '';
    if (code) {
        var match = code.className.match(/language-(\S+)/);
        if (match) {
            lang = match[1];
        }
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    var header = document.createElement('div');
    header.className = 'code-block__header';

    var label = document.createElement('span');
    label.className = 'code-block__lang';
    label.textContent = lang || 'text';
    header.appendChild(label);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-block__copy';
    button.textContent = 'Copy';
    button.setAttribute('title', 'Copy code');
    button.addEventListener('click', function () {
        copy(button);
        var original = button.textContent;
        button.textContent = 'Copied!';
        window.setTimeout(function () {
            button.textContent = original;
        }, 2000);
    });
    header.appendChild(button);

    wrapper.insertBefore(header, pre);
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre.highlight").forEach(function (element) {
        wrapCodeBlock(element);
    });

    document.getElementById("current-year").textContent = new Date().getFullYear().toString();
});

function closeMdActionsMenus(except) {
    document.querySelectorAll('.md-actions-toggle[aria-expanded="true"]').forEach(function (toggle) {
        if (toggle === except) {
            return;
        }
        toggle.setAttribute('aria-expanded', 'false');
        toggle.parentNode.querySelector('.md-actions-menu').classList.remove('show');
    });
}

function toggleMdActionsMenu(toggle) {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    closeMdActionsMenus(toggle);
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    toggle.parentNode.querySelector('.md-actions-menu').classList.toggle('show', ! expanded);
}

function copyMarkdownPage(button) {
    var label = button.querySelector('.label');
    var original = label.textContent;

    var restore = function (message) {
        label.textContent = message;
        window.setTimeout(function () {
            label.textContent = original;
        }, 2000);
    };

    fetch(button.dataset.copyUrl, {headers: {'Accept': 'text/markdown, text/plain'}})
        .then(function (response) {
            if (! response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.text();
        })
        .then(async function (markdown) {
            return await navigator.clipboard.writeText(markdown);
        })
        .then(function () {
            restore('Copied!');
        })
        .catch(function () {
            restore('Copy failed');
        });
}

document.addEventListener('click', function (event) {
    if (! event.target.closest('.md-actions')) {
        closeMdActionsMenus();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeMdActionsMenus();
    }
});
