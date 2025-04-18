/** @type {HTMLTextAreaElement} */
const message = document.getElementById("message");
/** @type {HTMLTextAreaElement} */
const translation = document.getElementById("translation");
/** @type {HTMLTextAreaElement} */
const output = document.getElementById("output");
/** @type {HTMLDivElement} */
const preview = document.getElementById("preview");

/** @type {[RegExp, string | ((substring: string, ...args: any[]) => string)][]} */
const previewProcessors = [
    [ /<script>?|<\/script>/ig, "" ],
    [ /<color="?(#?[A-z0-9]+)"?>/ig, (substring, args) => `<span style="color:${args}">` ],
    [ /<\/(?:color|mark)>/ig, "</span>" ]
];

function updateText() {
    let html = translation.value;
    for (const [ regex, replacement ] of previewProcessors)
        html = html.replaceAll(regex, replacement);
    preview.innerHTML = html;
}

async function copyOutput() {
    if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(output.value);
        return;
    }
    output.select();
    document.execCommand("copy");
}
