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
