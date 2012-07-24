/*
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                   Version 2, December 2004
 *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 *********************************************************************/

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;

var Blender = (function () {
	var c = function () {};

	var Preferences = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("general.");
	var Settings    = {
		"appname.override":    "Netscape",
		"appversion.override": "5.0 (Windows)",
		"buldID.override":     "0",
		"oscpu.override":      "Windows NT 6.1",
		"platform.override":   "Win32",
		"productSub.override": "20100101",

		"useragent.override":  "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0",
		"useragent.vendor":    "",
		"useragent.vendorSub": "",

		"navigator.platform":     "Win32",
		"navigator.system":       "Windows NT 6.1",
		"navigator.appVersion":   "5.0 (Windows)",
		"navigator.buildID":      "20100101",
		"navigator.geckoVersion": "10.0",
		"navigator.version":      "10.0"
	}

	c.prototype.start = function () {
		for (var name in Settings) {
			if (!Preferences.prefHasUserValue(name)) {
				Preferences.setCharPref(name, Settings[name]);
			}
		}
	}

	c.prototype.stop = function () {
		for (var name in Settings) {
			if (Preferences.getCharPref(name) === Settings[name]) {
				Preferences.clearUserPref(name);
			}
		}
	}

	return c;
})();

var blender;

function startup (data, reason) {
	blender = new Blender();
	blender.start();
}

function shutdown (data, reason) {
	blender.stop();
}
