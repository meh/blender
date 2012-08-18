Blender
========
This addon sets various preferences to fake to be the most common.

It fakes:

* the operating system to be Windows 7
* Firefox to be version 10
* the language to be english
* the accepted charsets to be unspecified

Options
-------
* `extensions.blender.force-headers` tells blender to force the overriding of
  the Accept headers. `false` by default.

* `extensions.blender.fake-language` tells blender to fake the language to
  english. `true` by default.

Suggestions
-----------
The results of using this addon end up reducing a lot fingerprintability, but
the sources of most information come from Java and Flash plugins, with those
you can practically be 100% sure to recognize who you are by listing plugins,
fonts and other stuff.

My suggestion is to uninstall both Java and Flash plugins and use Chrome when
you really need Flash (it happens rarely anyway).

Chrome, not Chromium, Chrome has a Flash plugin included and it tends to be
pretty secure, you're pretty much going to be tracked by Google but you would
end up having the same issues using Flash anyway, so just use Chrome to use
Flash, like for videos on Vimeo or videos that haven't been converted to HTML5
on YouTube.

Toggling blender with [Custom Buttons](https://addons.mozilla.org/en-US/firefox/addon/custom-buttons/?src=search)
------------------------------------------------------------------------------------------------------------------------

```javascript
Components.utils.import('resource://gre/modules/AddonManager.jsm');

AddonManager.getAddonByID('blender@meh.paranoid.pk', function (addon) {
    addon.userDisabled = !addon.userDisabled;
});
```
