var wshook = function () {
    console.log('Using wsHook. All WebSocket connections are being hooked.');
    /* wsHook.js
     * https://github.com/skepticfx/wshook
     * Reference: http://www.w3.org/TR/2011/WD-websockets-20110419/#websocket
     */

    var wsHook = {};
    (function () {

        var before = wsHook.before = function (data, url) {
            // ...
            return data;
        };
        wsHook.resetHooks = function () {
            wsHook.before = before;
        }

        var _WS = WebSocket;
        WebSocket = function (url, protocols) {
            var WSObject;
            this.url = url;
            this.protocols = protocols;
            if (!this.protocols) {
                WSObject = new _WS(url);
            }
            else {
                WSObject = new _WS(url, protocols);
            }

            var _send = WSObject.send;
            var _wsobject = this;
            WSObject.send = function (data) {
                data = wsHook.before(data, WSObject.url) || data;
                if (data.indexOf('updateToRead') != -1) {
                    console.log('`updateToRead` is intercepted: ', data)
                    return;
                }
                if (data.indexOf('confirmDing') != -1) {
                    console.log('`confirmDing` is intercepted: ', data)
                    return;
                }
                _send.apply(this, arguments);
            }
            return WSObject;
        }
    })();
}

chrome.storage.local.get(null, function (db) {
    if (document.domain.indexOf('im.dingtalk.com') != -1) {
        console.log('Injecting DingTalk hooks.');
        var injectString = [];
        injectString.push(wshook)

        // Generate the script to inject from the array of functions.
        var scriptToInject = "";

        injectString.forEach(function (func) {
            var func = func.toString().trim(); // get the function code
            func = func.replace(func.split('{', 1), ''); // remove the function(), part from the string.
            func = func.substr(1); // remove the {
            func = func.substr(0, func.length - 1); // remove the last } at the end.
            func = func + "\n"; // create a new line
            scriptToInject = scriptToInject + func;

        });

        injectScript(scriptToInject);

    }
});

function injectScript(scriptString) {
    var actualCode = '(function(){' + scriptString + '})();'
    var script = document.createElement('script');
    script.textContent = actualCode;
    (document.head || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
}
