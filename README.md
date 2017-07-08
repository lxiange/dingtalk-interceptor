# 钉钉已读回执拦截器

**适用于网页版钉钉**

## 安装方法：

1. 通过Chrome Webstore安装[DingTalk Interceptor](https://chrome.google.com/webstore/detail/dingtalk-interceptor/dcefpnhobgebmafmamokafniilmmcgdp)
2. 若无法访问Chrome Webstore，可下载此项目解压，然后打开`chrome://extensions/`，点击`加载已解压的扩展程序...`按钮，选择此项目文件夹。

## 使用方法：

安装插件后，登陆网页版钉钉正常使用即可。

代码工作正常情况下，打开控制台，会打印：
```
Injecting DingTalk hooks.
Using wsHook. All WebSocket connections are being hooked.
```
这两行信息，表示代码已经注入成功：
![welcome](https://images.lxiange.com/posts/dingtalk-interceptor/welcome.png)
（这堆warning/error是钉钉代码的锅）

此外，每拦截一条已读回执，会在控制台打印一条信息：
![log](https://images.lxiange.com/posts/dingtalk-interceptor/log.png)

此插件会拦截网页版钉钉的所有已读回执，如需发送已读回执，请在手机等其他客户端上再次浏览消息即可。

## 注意事项：

本插件采用简单匹配法，拦截所有发送的包含`updateToRead`的消息。
因此如果你发送的消息中含有此字符串，也将被误伤拦截。
这是我特意留的一个Bug，:P

## 致谢

* 感谢 @启鸣 不停给我发消息做测试。答应了算他一份的，差点忘了。
* [skepticfx/hookish](https://github.com/skepticfx/hookish)
（其实基本上就是照着抄的）

## 相关博文

[钉钉已读回执拦截器](https://lxiange.com/posts/dingtalk-interceptor.html)
