"use strict";
var NTESGLOBAL = NTESGLOBAL ||  {};
NTESGLOBAL.loading = function(obj,flag,callback) {

	var oLoading = document.getElementById(obj);

	var createDots = function() {
		var _html = "";
		var oFrag = document.createDocumentFragment();

		for (var i = 0; i < 5; i++) {
			var oDiv = document.createElement("div");
			oDiv.className = "dot";
			var oSpan = document.createElement("span");
			oSpan.className = "after";
			oDiv.appendChild(oSpan);
			oFrag.appendChild(oDiv);
		}
		oLoading.appendChild(oFrag);
	};

	var surportCSS3 = (function() {
		var div = document.createElement('div'),
			vendors = 'Ms O Moz Webkit'.split(' '),
			len = vendors.length;

		return function(prop) {
			if (prop in div.style) return true;

			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});

			while (len--) {
				if (vendors[len] + prop in div.style) {
					return true;
				}
			}
			return false;
		};
	})();

	var moveCircle = function(obj, r) {
		obj.timer = null;
		var ideg = -45;
		var iTop = 0;
		var iLeft = 0;
		var nowOpacity = 100;

		var go = function() {
			obj.style.opacity = "1";
			obj.style.filter = "alpha(opacity = 100)";
			var absDeg = Math.abs(ideg);
			var ranDeg = 90;
			if (absDeg <= 180 && absDeg >= -45) {
				ideg = ideg - 6;
				animationFrame.request(go);
			} else if (absDeg <= 240 && absDeg > 180) {
				ideg = ideg - 2;
				animationFrame.request(go);
			} else if (absDeg <= 270 && absDeg > 240) {
				ideg = ideg - 4;
				animationFrame.request(go);
			} else if (absDeg <= 540 && absDeg > 270) {
				ideg = ideg - 7;
				animationFrame.request(go);
			} else if (absDeg <= 630 && absDeg > 540) {
				ideg = ideg - 2;
				animationFrame.request(go);
			} else if (absDeg <= 720 && absDeg > 630) {
				ideg = ideg - 4;
				animationFrame.request(go);
			} else if (absDeg > 720 && absDeg <= 850) {
				ideg -= 2;

				var start = 0,
					during = 30;
				start++;
				nowOpacity = Tween.Quad.easeOut(start, nowOpacity, -100, during);
				(nowOpacity < 0) && (nowOpacity = 0);
				obj.style.opacity = nowOpacity / 100;
				animationFrame.request(go);
				obj.style.filter = "alpha(opactiy=" + nowOpacity + ")";
			} else if (absDeg > 850) {
				ideg = -45;
				nowOpacity = 100;
				animationFrame.request(go);
			}
			var x = 0;
			var y = 0;
			x = Math.sin(ideg * Math.PI / 180) * r;
			y = Math.cos(ideg * Math.PI / 180) * r;
			obj.style.top = y + "px";
			obj.style.left = x + "px";

		};

		animationFrame.request(go);
	};

	var circularStart = function() {

		var oDots = tools.getByClass(oLoading, "dot");
		var oLength = (oDots[0].offsetWidth) / 2
		var oRadius = Math.sqrt(Math.pow(oLength, 2) * 2);
		for (var i = 0; i < oDots.length; i++) {
			var delayTime = 230 * i;
			doMove(oDots[i], delayTime);
		}

		function doMove(obj, delay) {
			setTimeout(function() {

					moveCircle(obj, oRadius);

			}, delay);
		}
	};

	var init = function() {

		createDots();

		if (!surportCSS3('animation')) {
			// Not surpport CSS3 Animation
			circularStart();
		} else {
			// surport Animation
		}
	};

	if (flag) {
		init();
	}

	callback && callback();
};