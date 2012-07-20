/*
 *vango.js a light lib extending from canvas API
 */
/*
 * lang
 */;
(function () {
  /*
   *https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
   */
  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.com/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback, thisArg) {

      var T, k;

      if (this == null) {
        throw new TypeError("this is null or not defined");
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0; // Hack to convert O.length to a UInt32

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if ({}.toString.call(callback) != "[object Function]") {
        throw new TypeError(callback + " is not a function");
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (thisArg) {
        T = thisArg;
      }

      // 6. Let k be 0
      k = 0;

      // 7. Repeat, while k < len
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as the this value and
          // argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined
    };
  }
})();
/*
 * wrapper for browser,nodejs or AMD loader evn
 */

(function (root, factory) {
  if (typeof exports === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    root.Vango = factory();
  }
})(this, function () {

  var __hasProp = Object.prototype.hasOwnProperty,
    DOC = document,
    vangoprop = Vango.prototype,
    defaultoptions = {
      fill: true,
      stroke: false
    },
    __animate;

  __animate = (function () {
    var requestAnimationFrame;
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
      setTimeout(function () {
        callback(new Date());
      }, 1000 / 60);
    };
    animate = function (duration, callback) {
      var finished, startTime, step;
      startTime = new Date();
      finished = -1;
      step = function (timestemp) {
        var progress;
        progress = timestemp - startTime;
        if (progress >= duration) {
          callback(finished);
          return;
        }
        callback(progress);
        return requestAnimationFrame(step);
      };
      return requestAnimationFrame(step);
    };
    return animate;
  })();


  /*
   * Vango instance constructor
   */
  function Vango(container, width, height) {
    var cvs;
    if (container == null) {
      return;
    }
    cvs = this.canvas = DOC.createElementByTagName("canvas");
    cvs.width = width;
    cvs.height = height;
    this.context = cvs.getContext("2d");
    container.appendChild(cvs);
  }

  /*
   * canvas DOM
   */
  vangoprop.attr = function (key, value) {
    this.canvas.setAttribute(key, value);
  }
  vangoprop.attr = __overloadGetterSetter.call(Vango.attr, function (key) {
    this.canvas.getAttribute(key);
  });

  vangoprop.css = function (property, value) {
    this.canvas.style[property] = value;
  };
  vangoprop.css = __overloadGetterSetter.call(Vango.css, function (property) {
    return this.canvas.style[property];
  });

  ["getContext", "toDataURL"].forEach(function (method) {
    vangoprop[method] = function () {
      var cvs = this.canvas;
      return cvs[method].apply(cvs, arguments);
    }
  });


  /*
   * Context
   */

  /*
		attrName					attrValue				option
		
		canvas						--						readonly
		fillStyle					{String}
									{linearGradient}
									{radialGradient}
									{canvasPattern}
		font						{String}				css Font syntax
		globalAlpha					{Nnumber}				0.0	1.0
		globalCompositeOperation	{String}
		lineCap						{String}
		lineJoin					{String}
		lineWidth					{Number}
		miterLimit					{Number}
		textAlign					{String}
		textBaseline				{String}
		shadowBlur					{float}
		shadowColor					{String}				css Color String
		shadowOffsetX, shadowOffsetY{float}
		strokeStyle					{String}
									{linearGradient}
									{radialGradient}
									{canvasPattern}
	*/
  vangoprop.style = function (key, value) {
    this.context[key] = value;
  };

  vangoprop.style = __overloadGetterSetter.call(Vango.style, function (key) {
    return this.context[key];
  });

  /*
   * void mehtod
   * return tihs
   */

  [
  /*
   * path method
   */"beginPath", "closePath", "fill", "stroke", "clip", "moveTo", "lineTo", "arc", "arcTo", "bezierCurveTo", "quadraticCurveTo", "rect",
  /*
   * rectangles
   */"clearRect", "fillRect", "strokeRect",
  /*
   * text
   */"fillText", "strokeText",
  /*
   * image drawing
   */"drawImage",
  /*
   * pixel manipulation
   */"putImageData",
  /*
   * 2D Context
   */"save", "restore",
  /*
   * transform
   */"scale", "rotate", "translate", "transform", "setTransform"].forEach(function (method) {
    vangoprop[method] = function () {
      var ctx = this.context;
      ctx[method].apply(ctx, arguments);
      return this;
    }
  });


  /*
   * return original returns
   */ [
  /*
   * path
   */"isPointInPath",
  /*
   * text
   * measureText Interface
   * width	{float}	readonly
   */"measureText",
  /*
   * pixel manipulation
   * imageData	interface
   * 	width	unsigned long	readyonly
   * 	height	unsigned long	readyonly
   * 	data	CanvasPixelArray	readyonly
   * CanvasPixelArray interface
   * 	length	unsigned	readyonly
   */"createImageData", "getImageData",
  /*
   * color style & shadow
   * CanvasGradient interface
   * 	void	addColorStop(float offset,string color)
   */"createLinearGradient", "createRadialGradient", "createPattern"].forEach(function (method) {
    vangoprop[method] = function () {
      var ctx = this.context;
      return ctx[method].apply(ctx, arguments);
    }
  });



  /*
   * extend Canvas
   */
  Vango.extend = function (name, method) {
    vangoprop[name] = method;
  }
  Vango.extend = __overloadGetterSetter.call(Vango.extend);


  Vango.extend("extend", __overloadGetterSetter.call(function (name, method) {
    this[name] = method;
  }));

  /*
   * extend context
   */
  Vango.extend({
    /*
     * graph extends
     */
    line: function (sx, sy, ex, ey, options) {
      var that = this;
      __styleFillAndStroke.call(this, options, function () {
        that.beginPath();
        that.moveTo(sx, sy);
        that.lineTo(ex, ey);
      });
      return this;
    },
    circle: function (x, y, radius, options) {
      var that = this;
      __styleFillAndStroke.call(this, options, function () {
        that.beginPath();
        that.arc(x, y, radius, 0, PI * 2);
      });
      return this;
    },
    rectangle: function (x, y, width, height, options) {
      var ss;
      options = options || {};
      options = __mergeOptions(options, defaultOptions);
      ss = options.styles;
      this.save();
      if (ss) {
        this.style(ss);
      }
      options.fill && this.fillRect(x, y, width, height);
      options.stroke && this.strokeRect(x, y, width, height);
      this.restore();
      return this;

    },
    /*
     * http://www.williammalone.com/briefs/how-to-draw-ellipse-html5-canvas/
     */
    ellipse: function (x, y, radiusX, radiusY, options) {
      var that = this;
      __styleFillAndStroke.call(this, options, function () {
        that.beginPath();
        that.moveTo(x, y - radiusY);
        that.bezierCurveTo(
        x + radiusX, y - radiusY,
        x + radiusX, y + radiusY,
        x, y + radiusY);
        that.bezierCurveTo(
        x - radiusX, y + radiusY,
        x - radiusX, y - radiusY,
        x, y - radiusY);
        that.closePath();
      });
      return this;
    },
    polygon: function (x, y, n, radius, angle, counterclockwise, options) {
      var that = this;
      angle = angle || 0;
      counterclockwise = counterclockwise || false;
      __styleFillAndStroke.call(this, options, function () {
        that.beginPath();
        // Compute vertex position and begin a subpath there
        that.moveTo(x + radius * Math.sin(angle),
        y - radius * Math.cos(angle));
        var delta = 2 * Math.PI / n; // Angle between vertices
        for (var i = 1; i < n; i++) { // For remaining vertices
          // Compute angle of this vertex
          angle += counterclockwise ? -delta : delta;
          // Compute position of vertex and add a line to it
          that.lineTo(x + radius * Math.sin(angle),
          y - radius * Math.cos(angle));
        }
        that.closePath(); // Connect last vertex back to the first
      });
      return this;
    },
    sector: function (x, y, radius, startAngle, endAngle, /*[*/ counterclockwise, options /*]*/ ) {
      var that = this;
      counterclockwise = counterclockwise || false;
      __styleFillAndStroke.call(this, options, function () {
        that.beginPath();
        that.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        that.lineTo(x, y);
        that.closePath();
      });
      return this;
    },
    /*@params pathString {String}	path string in SVG format.	"M10,20L30,40"
		Command	Name								Parameters
		M		moveto								(x y)+
		Z		closepath							(none)
		L		lineto								(x y)+
		H		horizontal lineto					x+
		V		vertical lineto						y+
		C		curveto								(x1 y1 x2 y2 x y)+
		S		smooth curveto						(x2 y2 x y)+
		Q		quadratic Bézier curveto			(x1 y1 x y)+
		T		smooth quadratic Bézier curveto	(x y)+
		A		elliptical arc						(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
		R		Catmull-Rom curveto*				x1 y1 (x y)+
		*/
    /*
    path: function (pathString,options) {
			var 			
		},
		*/
    /*
     * http://blog.csdn.net/csharp25/article/details/6659855
     *drawImage(image, dx, dy) 
     *drawImage(image, dx, dy, dw, dh) 
     *drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
     * @params image {String}	src
     * 							 {Object}	HTMLImageElement	HTMLCanvasElement	HTMLVideoElement
     * @params 	coordinateDimensioning {Array}
     *	[ dx, dy]	[dx, dy, dw, dh] [sx, sy, sw, sh, dx, dy, dw, dh]
     *
     */
    image: function (image, coordinateDimensioning, /*[*/ callback /*]*/ ) {
      var that = this;
      if (typeof image === "string") {
        __loadImage(image, drawImage);
      } else {
        drawImage(image);
      }

      function drawImage(image) {
        coordinateDimensioning.unshift(image);
        that.drawImage.apply(that, args);
        callback && callback.call(null, coordinateDimensioning);
      }
      return this;
    },
    /*
     * @params	options
     * 					.maxWidth	{float}
     */
    text: function (x, y, text, options) {
      var ss, maxWidth;
      options = options || {};
      options = __mergeOptions(options, defaultOptions);
      ss = options.styles;
      this.save();
      if (ss) {
        this.style(ss);
      }
      maxWidth = options.maxWidth;
      options.fill && this.fillText(text, x, y, width, height, maxWdith);
      options.stroke && this.strokeText(text, x, y, width, height, maxWidth);
      this.restore();
      return this;
    },

    /*
     * transform extends
     */
    /*
     * copy from Canvas Pocket Reference
     */
    shear: function (kx, ky) {
      this.transform(1, ky, kx, 1, 0, 0);
      return this;
    },
    rotateAbout: function (x, y, theta) {
      var ct = Math.cos(theta);
      var st = Math.sin(theta);
      this.transform(ct, - st, st, ct, - x * ct - y * st + x,
      x * st - y * ct + y);
      return this;
    }
  });


  /*
   * native events adapter
   */
  Vango.extend({
    on: function (type, listener) {},
    off: function (type, listener) {}
  });

  /*
   * animate
   */
  vangoprop.animate = __animate;


  /*
   * util
   */
  function __extend(target, source) {
    for (var key in source) {
      if (__hasProp.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  function __overloadGetterSetter(getter) {
    var that = this;
    return function (a, b) {
      if (a == null) return this;
      if (typeof a === "string" && arguments.length === 1 && getter) {
        return getter.call(this, a);
      }
      if (typeof a === "object") {
        for (var k in a) {
          that.call(this, k, a[k]);
        }
      } else {
        that.call(this, a, b);
      }
      return this;
    }
  }

  function __styleFillAndStroke(options, pathBuilder) {
    var ss;
    options = options || {};
    options = __mergeOptions(options, defaultOptions);
    ss = options.styles;

    this.save();
    if (ss) {
      this.style(ss);
    }
    pathBuilder && pathBuilder();
    options.fill && this.fill();
    options.stroke && this.stroke();
    this.restore();
  }

  function __loadImage(image, callback) {
    var imageEle = DOC.createElememnt(img);
    imageEle.onload = function () {
      callback(imageEle);
      delete imageEle;
    }
    image.src = image;
  }

  function __mergeOptions(dest, src) {
    for (var i in src) {
      dest[i] = src;
    }
    return dest;
  }

  /*
   * from Raphael
   */
  /*
	function __parsePathString(pathString) {
        if (!pathString) {
            return null;
        }
        var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0},
            data = [];
        if (!data.length) {
            pathString.replace(pathCommand, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(pathValues, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b][concat](params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                if (name == "r") {
                    data.push([b][concat](params));
                } else while (params.length >= paramCounts[name]) {
                    data.push([b][concat](params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        return data;
    }*/

  return Vango;
});

