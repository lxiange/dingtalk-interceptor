# 钉钉已读状态拦截器

<del>**适用于网页版钉钉**</del>

## UPDATE

经同事提醒，钉钉客户端（3.x）就是Electron包装的一层网页版而已。于是经过简单改造，现在已经支持钉钉客户端。

Mac 用户（3.x 版本）可以直接运行`sh install.sh`，自动安装并注入。

Windows 用户可以参考下，把 js 文件拷贝到钉钉目录（大概是叫`../app.nw/web_content`）下，并在`index.html`里加载此 js 。

**注意，一定要放在`app.js`前**

这样OK：

```html
<script src="./assets/ding_interceptor.js"></script>
<script src="./assets/vendor.js"></script>
<script src="./assets/app.js"></script>
```

这样不OK：

```html
<script src="./assets/vendor.js"></script>
<script src="./assets/app.js"></script>
<script src="./assets/ding_interceptor.js"></script>
```

默认会自动拦截全部已读回执。不过此次特增加了“原谅模式”，即恢复默认设置不再拦截，正常向对方展示已读状态。

右击标题栏部分即可激活或关闭。

![header](https://images.lxiange.com/posts/dingtalk-interceptor/header.png)

可以看到，标题栏会变成原谅色。喜欢你们喜欢。

不过值得庆祝的是，钉钉4.0版本已经重写为原生APP，性能和功能都得到很大的提升，可喜可贺！

以下为旧内容：

## 功能

* 拦截普通消息已读回执
* 拦截“钉一下”回执
* 消息防撤回（功能很鸡肋，只能拦截当前聊天窗口）

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
