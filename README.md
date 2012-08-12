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

Toggling blender with [Custom Buttons](https://addons.mozilla.org/en-US/firefox/addon/custom-buttons/?src=search)
------------------------------------------------------------------------------------------------------------------------

```javascript
Components.utils.import('resource://gre/modules/AddonManager.jsm');

AddonManager.getAddonByID('blender@meh.paranoid.pk', function (addon) {
    addon.userDisabled = !addon.userDisabled;
});
```
