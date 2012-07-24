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
	var preferences = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("general.");

	c.prototype.start = function () {
		preferences.setCharPref("appname.override", "Netscape");
		preferences.setCharPref("appversion.override", "5.0 (Windows)");
		preferences.setCharPref("buldID.override", "0");
		preferences.setCharPref("oscpu.override", "Windows NT 6.1");
		preferences.setCharPref("platform.override", "Win32");
		preferences.setCharPref("productSub.override", "20100101");

		preferences.setCharPref("useragent.override", "Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20100101 Firefox/10.0");
		preferences.setCharPref("useragent.vendor", "");
		preferences.setCharPref("useragent.vendorSub", "");

		preferences.setCharPref("navigator.platform", "Win32");
		preferences.setCharPref("navigator.system", "Windows NT 6.1");
		preferences.setCharPref("navigator.appVersion", "5.0 (Windows)");
		preferences.setCharPref("navigator.buildID", "20100101");
		preferences.setCharPref("navigator.geckoVersion", "10.0");
		preferences.setCharPref("navigator.version", "10.0");
	}

	c.prototype.stop = function () {
		preferences.clearUserPref("appname.override");
		preferences.clearUserPref("appversion.override");
		preferences.clearUserPref("buldID.override");
		preferences.clearUserPref("oscpu.override");
		preferences.clearUserPref("platform.override");
		preferences.clearUserPref("productSub.override");

		preferences.clearUserPref("useragent.override");
		preferences.clearUserPref("useragent.vendor");
		preferences.clearUserPref("useragent.vendorSub");

		preferences.clearUserPref("navigator.platform");
		preferences.clearUserPref("navigator.system");
		preferences.clearUserPref("navigator.appVersion");
		preferences.clearUserPref("navigator.buildID");
		preferences.clearUserPref("navigator.geckoVersion");
		preferences.clearUserPref("navigator.version");
	}

	return c;
})();

var blender;

function install () {
	blender = new Blender();
}

function startup (data, reason) {
	blender.start();
}

function shutdown (data, reason) {
	blender.stop();
}
