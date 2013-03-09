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

	Preferences.QueryInterface(Ci.nsIPrefBranch2);

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
				"buldID.override":     "20130215130331",
				"oscpu.override":      "Windows NT 6.1; WOW64",
				"platform.override":   "Win32",
				"productSub.override": "20100101",

				"useragent.override":  "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:19.0) Gecko/20100101 Firefox/19.0",
				"useragent.vendor":    "",
				"useragent.vendorSub": "",

				"navigator.platform":     "Win32",
				"navigator.system":       "Windows NT 6.1; WOW64",
				"navigator.appVersion":   "5.0 (Windows)",
				"navigator.buildID":      "20130215130331",
				"navigator.geckoVersion": "19.0",
				"navigator.version":      "19.0",
			},

			network: {
				"accept.default":  "text/html,application/xml,*/*",
				"accept-encoding": "gzip, deflate",
			},

			image: {
				"http.accept": "image/png,image/*;q=0.8,*/*;q=0.5",
			},

			intl: {
				"accept_charsets":  "*",
				"accept_languages": "en-US,en;q=0.5",
				"charset_default":  "",
			},
		}
	};

	DefaultPreferences.setBoolPref("force-headers", false);
	DefaultPreferences.setBoolPref("fake-language", true);
	DefaultPreferences.setBoolPref("disable-fonts", false);

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
