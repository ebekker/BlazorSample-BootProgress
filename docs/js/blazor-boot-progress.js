
// Parse the URL params to control functionality below
var urlParams = new URLSearchParams(window.location.search);

// This should be set to max number of DLL assemblies expected
// to be loaded at boot up which can be discovered during
// development by examining the DLL loaded in the JS console
window.blazor_boot_dll_max = urlParams.has("dll_max") ? parseInt(urlParams.get("dll_max")) : 25;
window.blazor_boot_dll_min = urlParams.has("dll_min") ? parseInt(urlParams.get("dll_min")) : 0;
window.blazor_boot_dll_val = urlParams.has("dll_val") ? parseInt(urlParams.get("dll_val")) : 0;
window.blazor_boot_dll_msg = urlParams.has("dll_msg") ? urlParams.get("dll_msg") : "Loading application...";

window.blazor_boot_update_progress = function (min, max, val, msg) {
    var msgElm = document.getElementById("bootMessage");
    msgElm.innerHTML = msg;

    var rng = max - min;
    var pct = 0;
    if (rng > 0) {
        pct = val * 100 / rng;
    }

    var barElm = document.getElementById("bootProgress");
    barElm.style.width = pct + "%";
    barElm.setAttribute("aria-valuemin", min);
    barElm.setAttribute("aria-valuemax", max);
    barElm.setAttribute("aria-valuenow", val);
}

// Update static progress elements with initial state
window.blazor_boot_update_progress(
    window.blazor_boot_dll_min,
    window.blazor_boot_dll_max,
    window.blazor_boot_dll_val,
    window.blazor_boot_dll_msg
);

XMLHttpRequest.prototype.orig_open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async) {
    if (url.endsWith(".dll")) {
        this.is_dll = true;
        url = url.replace(".dll", ".blzr.wasm");
        var dllName = "" + url;
        var lastSlash = dllName.lastIndexOf("/");
        if (lastSlash > 0)
            dllName = dllName.substr(lastSlash + 1);
        this.addEventListener("load", function (e) {
            window.blazor_boot_dll_val++;
            window.blazor_boot_update_progress(
                window.blazor_boot_dll_min,
                window.blazor_boot_dll_max,
                window.blazor_boot_dll_val,
                "Loading component <b><code>" + dllName + "</code></b>");
            console.log("Loaded component #" + window.blazor_boot_dll_val + ": " + url);
        });
    }
    else {
        this.is_dll = false;
    }
    this.orig_open(method, url, async);
}



// Artificial progressive delay and abort for dev/test
//   (defaults to on with 100ms delay)
window.blazor_boot_xhr_send_delay_count = 1;
window.blazor_boot_xhr_send_abort_count =  urlParams.has("xhr_send_abort_count")
? parseInt(urlParams.get("xhr_send_abort_count")) : 0;
window.blazor_boot_xhr_send_delay_factor = urlParams.has("xhr_send_delay_factor")
    ? parseInt(urlParams.get("xhr_send_delay_factor")) : 100;

if (window.blazor_boot_xhr_send_delay_factor) {
    XMLHttpRequest.prototype.orig_send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        if (window.blazor_boot_xhr_send_abort_count > 0
            && window.blazor_boot_xhr_send_delay_count >= window.blazor_boot_xhr_send_abort_count)
            return;

        if (this.is_dll && window.blazor_boot_xhr_send_delay_count > 0) {
            var timeout = ++window.blazor_boot_xhr_send_delay_count
                * window.blazor_boot_xhr_send_delay_factor;
            setTimeout(function (xhr) { xhr.orig_send(); }, timeout, this);
        }
        else { 
            xhr.orig_send();
        }
    }
}
