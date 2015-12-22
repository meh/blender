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

	var Observer           = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService),
	    Preferences        = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("extensions.blender."),
	    DefaultPreferences = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getDefaultBranch("extensions.blender.");

	var appInfo = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);

	var Changes  = {
		preferences: {
			general: Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("general."),
			network: Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("network."),
			image:   Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("image."),
			intl:    Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("intl.")
		},

		settings: {
			general: {
				"appname.override":    "Netscape",
				"appversion.override": "5.0 (Windows)",
				"buildID.override":    "20150305021524",
				"oscpu.override":      "Windows NT 6.3; WOW64",
				"platform.override":   "Win32",
				"productSub.override": "20100101",

				"useragent.override":  "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:36.0) Gecko/20100101 Firefox/36.0",
				"useragent.vendor":    "",
				"useragent.vendorSub": "",

				"navigator.platform":     "Win32",
				"navigator.system":       "Windows NT 6.3; WOW64",
				"navigator.appVersion":   "5.0 (Windows)",
				"navigator.buildID":      "20150305021524",
				"navigator.geckoVersion": "36.0",
				"navigator.version":      "36.0",
			},

			network: {
				"accept.default":  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"accept-encoding": "gzip, deflate",
			},

			image: {
				"http.accept": "image/png,image/*;q=0.8,*/*;q=0.5",
			},

			intl: {
				"accept_charsets":  "*",
				"accept_languages": "en-US, en",
				"charset_default":  "",
			},
		}
	};

  DefaultPreferences.setBoolPref("fake-useragent", true);
	DefaultPreferences.setBoolPref("force-headers", false);
	DefaultPreferences.setBoolPref("fake-language", true);
	DefaultPreferences.setBoolPref("disable-fonts", false);
	DefaultPreferences.setBoolPref("disable-plugin", false);

	c.prototype.observe = function (subject, topic, data) {
		if (topic == "http-on-modify-request") {
			var http = subject.QueryInterface(Ci.nsIHttpChannel);

			if (Preferences.getBoolPref("force-headers")) {
				var header;

				if (header = Changes.settings.network["accept.default"]) {
					http.setRequestHeader("Accept", header, false);
				}

				if (header = Changes.settings.intl["accept_charsets"]) {
					http.setRequestHeader("Accept-Charset", header, false);
				}

				if (header = Changes.settings.network["accept-encoding"]) {
					http.setRequestHeader("Accept-Encoding", header, false);
				}

				if (header = Changes.settings.intl["accept_languages"]) {
					http.setRequestHeader("Accept-Language", header, false);
				}
			}
		}
		else if (topic == "nsPref:changed") {
			this.disable();
			this.enable();
		}
	}

	c.prototype.enable = function () {
		for (var type in Changes.preferences) {
			if (type == "intl" && !Preferences.getBoolPref("fake-language")) {
				continue;
			}
			if (type == "general" && !Preferences.getBoolPref("fake-useragent")) {
				continue;
			}

			var preferences = Changes.preferences[type];

			for (var name in Changes.settings[type]) {
				if (!preferences.prefHasUserValue(name)) {
					preferences.setCharPref(name, Changes.settings[type][name]);
				}
			}
		}

		if (Preferences.getBoolPref("disable-fonts") &&
		    !preferences.prefHasUserValue("browser.display.use_document_fonts")) {
			preferences.setIntPref("browser.display.use_document_fonts", 0);
		}

		if (Preferences.getBoolPref("disable-plugins") &&
		    !preferences.prefHasUserValue("plugins.enumerable_names")) {
			preferences.setStringPref("plugins.enumerable_names", "");
		}
	}

	c.prototype.disable = function () {
		for (var type in Changes.preferences) {
			var preferences = Changes.preferences[type];

			for (var name in Changes.settings[type]) {
				if (preferences.getCharPref(name) === Changes.settings[type][name]) {
					preferences.clearUserPref(name);
				}
			}
		}

		if (Preferences.getBoolPref("disable-fonts") &&
		    preferences.getIntPref("browser.display.use_document_fonts") == 0) {
			preferences.clearUserPref("browser.display.use_document_fonts");
		}

		if (Preferences.getBoolPref("disable-plugins") &&
		   preferences.getStringPref("plugins.enumerable_names") == "") {
			preferences.clearUserPref("plugins.enumerable_names");
		}
	}

	c.prototype.start = function () {
		Observer.addObserver(this, "http-on-modify-request", false);
		Preferences.addObserver("fake-language", this, false);

		this.enable();
	}

	c.prototype.stop = function () {
		Observer.removeObserver(this, "http-on-modify-request");
		Preferences.removeObserver("fake-language", this);

		this.disable();
	}

	c.prototype.init = function () {

		// Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:43.0) Gecko/20100101 Firefox/43.0


		// TODO - detect Platform etc.
		// TODO - fetch updated UserAgent data and update data structure.
		//var appname = "name:" + appInfo.name + " vendor:" + appInfo.vendor + " version:" + appInfo.version + " appBuildID:" + appInfo.appBuildID + " platformVersion:" + appInfo.platformVersion + " platformBuildID:" + appInfo.platformBuildID;
		//name:Firefox vendor:Mozilla version:43.0.1 appBuildID:20151216175450 platformVersion:43.0.1 platformBuildID:20151216175450
		// platform = gecko
		var appname = "Netscape";
		var appversion = "5.0 (Windows)";
		var platform = "Win32";
		var oscpu = "Windows NT 6.3; WOW64";
		var buildid = "20150305021524";
		var productsub = "20100101"; // GeckoTrail - fixed value on desktop
		var navigator_platform = platform;
		var navigator_system = oscpu;
		var navigator_buildid = buildid;
		var navigator_appversion = appversion;
		var navigator_geckoversion = "36.0";
		var navigator_version = navigator_geckoversion;

		var useragent = "Mozilla/" + navigator_appversion.split(" ", 1)[0] + " (" + navigator_system + "; rv:" + navigator_geckoversion + ") Gecko/" + productsub + " Firefox/" + navigator_version ;

		Changes.settings.general = {
			"appname.override":    appname,
			"appversion.override": appversion,
			"buildID.override":    buildid,
			"oscpu.override":      oscpu,
			"platform.override":   platform,
			"productSub.override": productsub,

			"navigator.platform":     navigator_platform,
			"navigator.system":       navigator_system,
			"navigator.appVersion":   navigator_appversion,
			"navigator.buildID":      navigator_buildid,
			"navigator.geckoVersion": navigator_geckoversion,
			"navigator.version":      navigator_version,

			"useragent.override":  useragent,
			"useragent.vendor":    "",
			"useragent.vendorSub": ""
		}

	}

	c.prototype.updateUserAgentString = function () {
		Changes.settings.general[""]
	}

	return c;
})();

var blender;

function install (data, reason) {}
function uninstall (data, reason) {}

function startup (data, reason) {
	blender = new Blender();
	blender.init();
	blender.start();
}

function shutdown (data, reason) {
	blender.stop();
}
