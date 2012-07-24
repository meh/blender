Blender
========
This addon sets various preferences to fake to be the most commonly found Firefox version,
operating system and various other things.

Toggling blender with [Custom Buttons](https://addons.mozilla.org/en-US/firefox/addon/custom-buttons/?src=search)
------------------------------------------------------------------------------------------------------------------------

```javascript
Components.utils.import('resource://gre/modules/AddonManager.jsm');

AddonManager.getAddonByID('blender@meh.paranoid.pk', function (addon) {
    addon.userDisabled = !addon.userDisabled;
});
```
