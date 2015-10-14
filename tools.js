var tools = {
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	getByClass: function(obj, clsName) {
		var elements = obj.getElementsByTagName("*");
		var result = [];
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].className.indexOf(clsName) != -1) {
				result.push(elements[i]);
			}
		}
		return result;
	}
};

var Tween = {
    Linear: function(t, b, c, d) { return c*t/d + b; },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
             return -c / 2 * ((--t) * (t-2) - 1) + b;
         }
     }
};

//写了一个全兼容的requestAnimationFrame, cancelRequestAnimationFrame模块
var animationFrame = (function () {
    var animationFrameClass = function () {
        var animationFrameManager = {
            request : window.requestAnimationFrame,
            cancel : window.cancelRequestAnimationFrame
        };

        var vendors = ["webkit","moz","o","ms"];
        for(var x = 0; x < vendors.length && !animationFrameManager.request && !animationFrameManager.cancel; x++) {
            animationFrameManager.request = window[vendors[x] + 'RequestAnimationFrame'];
            animationFrameManager.cancel = window[vendors[x] + 'CancelRequestAnimationFrame'] || window[vendors[x] + 'CancelAnimationFrame'];
        }
        if( window.webkitRequestAnimationFrame ) {
            animationFrameManager.request = function (callback,element) {
                return window.webkitRequestAnimationFrame(function (){return callback(new Date().getTime());},element);
            }
        }

        if( !animationFrameManager.request || !animationFrameManager.cancel  ) {
            var millisec = 16.7;	 //60fps;
            var requestQueue = [];
            var id = 0;
            var cursor = 0;

            function popAll() {
                var copyRequestQueue = requestQueue.slice(0);
                cursor += requestQueue.length;
                requestQueue.length = 0;

                for(var i = 0; i < copyRequestQueue.length; i++) {
                    if( typeof copyRequestQueue[i] == "function" ) {
                        copyRequestQueue[i](new Date());
                    }
                }
            }

            window.setInterval(popAll, millisec);

            animationFrameManager.request = function (callback) {  //兼容模式舍去element
                requestQueue.push(callback);
                return id++;
            }
            animationFrameManager.cancel = function (id) {
                requestQueue[id-cursor] = "cancelled";
            }
        }

        this.request = function (callback,element) {
            return animationFrameManager.request.call(window,callback,element);
        }

        this.cancel = function (id) {
            return animationFrameManager.cancel.call(window,id);
        }
    }

    return new animationFrameClass();
}());