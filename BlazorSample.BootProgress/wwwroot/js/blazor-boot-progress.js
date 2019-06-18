// This should be set to max number of DLL assemblies expected
// to be loaded at boot up which can be discovered during
// development by examining the DLL loaded in the JS console
window.blazor_boot_dll_max = 25;
window.blazor_boot_dll_min = 0;
window.blazor_boot_dll_val = 0;

window.blazor_boot_update_progress = function (min, max, val, msg) {
    var msgElm = document.getElementById("bootMessage");
    msgElm.innerHTML = msg;
}

XMLHttpRequest.prototype.orig_open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async) {
    if (url.endsWith(".dll")) {
        var dllName = "" + url;
        var lastSlash = dllName.lastIndexOf("/");
        if (lastSlash > 0)
            dllName = dllName.substr(lastSlash + 1);
        this.addEventListener("load", function (e) {
            window.blazor_boot_dll_val++;
            window.blazor_boot_update_progress(0, 0, 0, "Loading component <b><code>" + dllName + "</code></b>");
            console.log("Loaded component #" + window.blazor_boot_dll_val + ": " + url);
        });
    }
    this.orig_open(method, url, async);
}
