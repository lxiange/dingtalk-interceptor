
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
        var after = wsHook.after = function (e, url) {
            // ...
            return e;
        };
        wsHook.resetHooks = function () {
            wsHook.before = before;
            wsHook.after = after;
        }


        var enableInterception = true;
        setTimeout(() => {
            console.log('addEventListener on header.');
            document.getElementById('header').addEventListener('click',
                () => {
                    if (enableInterception) {
                        enableInterception = false;
                        document.getElementById('header').style.backgroundColor = 'green';
                    } else {
                        enableInterception = true;
                        document.getElementById('header').style.backgroundColor = '#008cee';
                    }
                });
        }, 5000);


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

                if (data.indexOf('updateToRead') != -1 || data.indexOf('confirmDing') != -1) {
                    if (enableInterception) {
                        console.log('`updateToRead` is intercepted: ', data)
                        return;
                    } else {
                        console.log('enableInterception is false, not intercept: ', data);
                    }
                }
                _send.apply(this, arguments);
            }

            // Events needs to be proxied and bubbled down.
            var onmessage_func;
            WSObject.__defineSetter__('onmessage', function (func) {
                onmessage_func = func;
            });
            var base64ToBase16 = function (base64) {
                return window.atob(base64)
                    .split('')
                    .map(function (aChar) {
                        return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
            }
            //todo: refactor.
            WSObject.addEventListener('message', function (e) {
                try {
                    var content = JSON.parse(e.data);
                    if (content['lwp'] === '/s/sync'
                        && content['body'].hasOwnProperty('1')
                        && content['body']['1']['6'].length > 0
                        && content['body']['1']['6'][0]['1'] === 1001) {

                        console.log("Message recall is intercepted.", e.data);

                        msg_id = parseInt(base64ToBase16(content['body']['1']['6'][0]['2']).substr(54, 10), 16);

                        var msg_element = document.querySelector('[msg-id="' + msg_id + '"]');
                        var msg_bubble = msg_element.getElementsByClassName('msg-bubble ng-scope ng-isolate-scope')[0];
                        msg_bubble.style.border = msg_bubble.style.background = 'red';
                        msg_element.parentElement.appendChild(msg_element.cloneNode(true));
                    }
                } catch (error) {
                    console.log(e.data);
                    console.error(error);
                }
                onmessage_func.apply(this, [e]);
            });
            return WSObject;
        }
    })();
}

function install_for_chrome() {
    function injectScript(scriptString) {
        var actualCode = '(function(){' + scriptString + '})();'
        var script = document.createElement('script');
        script.textContent = actualCode;
        (document.head || document.documentElement).appendChild(script);
        script.parentNode.removeChild(script);
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
}

if (typeof nw !== 'undefined') {
    // in nwjs.
    wshook();
} else {
    // in chrome.
    install_for_chrome();
}