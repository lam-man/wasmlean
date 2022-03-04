function showDetails(mem) {
    var buf = mem.buffer;
    var memEl = document.getElementById('mem');
    var pagesEl = document.getElementById('pages');
    var firstIntEl = document.getElementById('firstint');
    var firstBytesEl = document.getElementById('firstbytes');

    memEl.innerText = buf.byteLength;
    pagesEl.innerText = buf.byteLength / 65536;

    var i32 = new Uint32Array(buf);
    var u8 = new Uint8Array(buf);

    firstIntEl.innerText = i32[0];
    firstBytesEl.innerText = "[" + u8[0] + "," + u8[1] + "," + u8[2] + "," + u8[3] + "]";
}

function fetchAndInstantiate(url, importObject) {
    return fetch(url).then(response =>
        response.arrayBuffer()
    ).then(bytes =>
        WebAssembly.instantiate(bytes, importObject)
    ).then(results =>
        results.instance
    );
}

fetchAndInstantiate('Memory.wasm').then(function (instance) {
    var mem = instance.exports.memory;

    var button = document.getElementById("expand");
    button.onclick = function () {
        try {
            mem.grow(1);
            showDetails(mem);
        } catch (re) {
            alert("You cannot grow the memory any more!");
        };
    };
    showDetails(mem);
});