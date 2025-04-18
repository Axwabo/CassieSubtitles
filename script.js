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
    [ /<br>/ig, "\n" ],
    [ /<noparse>([\s\S]+?)<\/noparse>/ig, (substring, args) => args.replaceAll("<", "&lt;").replaceAll(">", "&gt;") ],
    [ /<allcaps>|<uppercase>/ig, `<span style="text-transform:uppercase">` ],
    [ /<alpha="?#([0-9a-f]{2})"?>((?:.(?!<alpha))+)/ig, (substring, ...args) => `<span style="opacity:${parseInt(args[0], 16) / 255}">${args[1]}</span>` ],
    [ /<color="?(#?[a-z0-9]+)"?>/ig, (substring, args) => `<span style="color:${args}">` ],
    [ /<cspace=([\d.]+[a-z]+?)>/ig, (substring, args) => `<span style="letter-spacing:${args}">` ],
    [ /<font-weight=([\d.]+)>/ig, (substring, args) => `<span style="font-weight:${args}">` ],
    [ /<indent="?(-?[\d.]+[a-z]+?)"?>/ig, (substring, args) => `<span style="text-indent:${args}">` ], // TODO: percentage
    [ /<line-height="?([\d.]+[a-z%]+?)"?>(.*)/ig, (substring, ...args) => `<span style="line-height:${args[0]}">${args[1]}</span>` ],
    [ /<lowercase>/ig, `<span style="text-transform:lowercase">` ],
    [ /<margin="?([\d.]+[a-z]+?)"?>(.*)/ig, (substring, ...args) => `<span style="margin:0 ${args[0]}">${args[1]}</span>` ],
    [ /<mark="?(#?[a-z0-9]+)"?>/ig, (substring, args) => `<span class="mark" style="--mark:${args}">` ],
    [ /<nobr>/ig, `<span style="white-space:nowrap">` ],
    [ /<pos="?([\d.]+[a-z%]+?)"?>(.*)/ig, (substring, ...args) => `<span style="position:absolute;left:${args[0]}">${args[1]}</span>` ], // TODO: percentage
    [ /<size=([\d.]+[a-z]+?)>/ig, (substring, args) => `<span style="font-size:${args}">` ],
    [ /<smallcaps>/ig, `<span style="font-variant:small-caps">` ],
    [ /<space="?([\d.]+[a-z]+?)"?>/ig, (substring, args) => `<span style="width:${args}"></span>` ],
    [ /<voffset="?(-?[\d.]+[a-z]+?)"?>/ig, (substring, args) => `<span style="vertical-align:calc(${args} * -1)">` ],
    [ /\n/ig, "<br>" ],
    [ /<\/(?:allcaps|color|cspace|font-weight|lowercase|mark|nobr|size|smallcaps|voffset|uppercase)>/ig, "</span>" ]
];

function updateText() {
    output.value = `${translation.value.replaceAll(" ", "​")}<size=0> ${message.value} </size>`;
    let html = translation.value;
    for (const [ regex, replacement ] of previewProcessors)
        html = html.replaceAll(regex, replacement);
    preview.innerHTML = `<span style="color: #68a0c3">C.A.S.S.I.E :</span> ${html}`;
}

async function copyOutput() {
    if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(output.value);
        return;
    }
    output.select();
    document.execCommand("copy");
}
