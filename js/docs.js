function copy(text){
    const parent = text.parentElement
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

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("pre.highlight").forEach(function (element) {
        let icon = document.createElement("i");
        icon.className = "bi bi-copy copy_btn";
        icon.title = "Copy code";
        icon.setAttribute("onclick", "copy(this)");
        element.prepend(icon);
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
