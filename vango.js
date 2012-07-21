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
        PI=Math.PI,
        vangoprop = Vango.prototype,
        defaultOptions = {
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
            var finished, startTime, step,
              that=this;
            startTime = new Date();
            finished = -1;
            step = function (timestemp) {
                var progress;
                progress = timestemp - startTime;
                if (progress >= duration) {
                    callback.call(that,finished);
                    return;
                }
                callback.call(that, progress);
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
        cvs = this.canvas = DOC.createElement("canvas");
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
    vangoprop.attr = __overloadGetterSetter.call(vangoprop.attr, function (key) {
        return this.canvas.getAttribute(key);
    });

    vangoprop.css = function (property, value) {
        this.canvas.style[property] = value;
    };
    vangoprop.css = __overloadGetterSetter.call(vangoprop.css, function (property) {
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

    vangoprop.style = __overloadGetterSetter.call(vangoprop.style, function (key) {
        return this.context[key];
    });

    /*
     * void mehtod
     * return tihs
     */

    [
    /*
     * path method
     */
    "beginPath", "closePath", "fill", "stroke", "clip", "moveTo", "lineTo", "arc", "arcTo", "bezierCurveTo", "quadraticCurveTo", "rect",
    /*
     * rectangles
     */
    "clearRect", "fillRect", "strokeRect",
    /*
     * text
     */
    "fillText", "strokeText",
    /*
     * image drawing
     */
    "drawImage",
    /*
     * pixel manipulation
     */
    "putImageData",
    /*
     * 2D Context
     */
    "save", "restore",
    /*
     * transform
     */
    "scale", "rotate", "translate", "transform", "setTransform"].forEach(function (method) {
        vangoprop[method] = function () {
            var ctx = this.context;
            ctx[method].apply(ctx, arguments);
            return this;
        }
    });


    /*
     * return original returns
     */
    [
    /*
     * path
     */
    "isPointInPath",
    /*
     * text
     * measureText Interface
     * width	{float}	readonly
     */
    "measureText",
    /*
     * pixel manipulation
     * imageData	interface
     * 	width	unsigned long	readyonly
     * 	height	unsigned long	readyonly
     * 	data	CanvasPixelArray	readyonly
     * CanvasPixelArray interface
     * 	length	unsigned	readyonly
     */
    "createImageData", "getImageData",
    /*
     * color style & shadow
     * CanvasGradient interface
     * 	void	addColorStop(float offset,string color)
     */
    "createLinearGradient", "createRadialGradient", "createPattern"].forEach(function (method) {
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
            options = __mergeOptions(defaultOptions, options);
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
        sector: function (x, y, radius, startAngle, endAngle, /*[*/ options, counterclockwise/*]*/ ) {
            var that = this;
            counterclockwise = counterclockwise || false;
            __styleFillAndStroke.call(this, options, function () {
                that.beginPath();
                that.arc(x, y, radius, startAngle, endAngle, counterclockwise);
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
        path: function (pathString, options) {
            var that = this,
                ca = _getDataArray(pathString);
            __styleFillAndStroke.call(this, options, function () {
                that.beginPath();
                for (var n = 0; n < ca.length; n++) {
                    var c = ca[n].command;
                    var p = ca[n].points;
                    switch (c) {
                    case 'L':
                        that.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        that.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        that.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        that.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0],
                            cy = p[1],
                            rx = p[2],
                            ry = p[3],
                            theta = p[4],
                            dTheta = p[5],
                            psi = p[6],
                            fs = p[7];

                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        that.translate(cx, cy);
                        that.rotate(psi);
                        that.scale(scaleX, scaleY);
                        that.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        that.scale(1 / scaleX, 1 / scaleY);
                        that.rotate(-psi);
                        that.translate(-cx, - cy);

                        break;
                    case 'z':
                        that.closePath();
                        break;
                    }
                }
                that.closePath();
            });
        },
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
            coordinateDimensioning = coordinateDimensioning || [];
            if (typeof image === "string") {
                __loadImage(image, drawImage);
            } else {
                drawImage(image);
            }

            function drawImage(image) {
                coordinateDimensioning.unshift(image);
                that.drawImage.apply(that, coordinateDimensioning);
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
            options.fill && this.fillText(text, x, y, maxWidth);
            options.stroke && this.strokeText(text, x, y, maxWidth);
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
        },

        /*
         * clear canvas
         */
        clear: function(){
            this.clearRect(0,0, this.attr("width",this.attr("height")));       
        }
    });


    /*
     * native events adapter
     */
    (function(){
        var W3C=!!window.addEventListener;
        Vango.extend({
            on: function (type, listener) {
                var cvs=this.canvas; 
                if (!W3C) {
                    cvs['e'+type+listenner] = fn;
                    cvs[type+listenner] = function(){cvs['e'+type+listenner]( window.event );}
                    obj.attachEvent( 'on'+type, cvs[type+listenner] );
                  } else
                    cvs.addEventListener( type, listener, false );
            },
            off: function (type, listener) {
                var cvs=this.canvas;
                if ( !W3C ) {
                    cvs.detachEvent( 'on'+type, cvs[type+listener] );
                    cvs[type+listener] = null;
                } else{
                    cvs.removeEventListener( type,listener, false );
                }
            }
        });
    })();
    

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
        options = __mergeOptions(defaultOptions, options);
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
        var imageEle = DOC.createElement("image");
        imageEle.onload = function () {
            callback(imageEle);
            delete imageEle;
        }
        imageEle.src = image;
    }

    function __mergeOptions(dest, src) {
        var options={};
        for (var i in dest) {
            options[i] = dest[i];
        }
        for(i in src){
            options[i]=src[i];
        }
        return options;
    }

    /**
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    function _getDataArray(pathString) {

        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

        // command string
        var cs = pathString;

        // return early if data is not defined
        if (!cs) {
            return [];
        }
        // command chars
        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for (var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for (var n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            // remove ,- for consistency
            str = str.replace(new RegExp(',-', 'g'), '-');
            // add commas so that it's easy to split
            str = str.replace(new RegExp('-', 'g'), ',-');
            var p = str.split(',');
            if (p.length > 0 && p[0] === '') {
                p.shift();
            }
            // convert strings to floats
            for (var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }

            while (p.length > 0) {
                if (isNaN(p[0])) // case for a trailing comma before next command
                break;

                var cmd = undefined;
                var points = [];

                // convert l, H, h, V, and v to L
                switch (c) {

                    // Note: Keep the lineTo's above the moveTo's in this switch
                case 'l':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'L':
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;

                    // Note: lineTo handlers need to be above this point
                case 'm':
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'l';
                    // subsequent points are treated as relative lineTo
                    break;
                case 'M':
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'M';
                    points.push(cpx, cpy);
                    c = 'L';
                    // subsequent points are treated as absolute lineTo
                    break;

                case 'h':
                    cpx += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'H':
                    cpx = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'v':
                    cpy += p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'V':
                    cpy = p.shift();
                    cmd = 'L';
                    points.push(cpx, cpy);
                    break;
                case 'C':
                    points.push(p.shift(), p.shift(), p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'c':
                    points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C'
                    points.push(cpx, cpy);
                    break;
                case 'S':
                    var ctlPtx = cpx,
                        ctlPty = cpy;
                    var prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(ctlPtx, ctlPty, p.shift(), p.shift())
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 's':
                    var ctlPtx = cpx,
                        ctlPty = cpy;
                    var prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'C') {
                        ctlPtx = cpx + (cpx - prevCmd.points[2]);
                        ctlPty = cpy + (cpy - prevCmd.points[3]);
                    }
                    points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift())
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'C';
                    points.push(cpx, cpy);
                    break;
                case 'Q':
                    points.push(p.shift(), p.shift());
                    cpx = p.shift();
                    cpy = p.shift();
                    points.push(cpx, cpy);
                    break;
                case 'q':
                    points.push(cpx + p.shift(), cpy + p.shift());
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q'
                    points.push(cpx, cpy);
                    break;
                case 'T':
                    var ctlPtx = cpx,
                        ctlPty = cpy;
                    var prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx = p.shift();
                    cpy = p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 't':
                    var ctlPtx = cpx,
                        ctlPty = cpy;
                    var prevCmd = ca[ca.length - 1];
                    if (prevCmd.command === 'Q') {
                        ctlPtx = cpx + (cpx - prevCmd.points[0]);
                        ctlPty = cpy + (cpy - prevCmd.points[1]);
                    }
                    cpx += p.shift();
                    cpy += p.shift();
                    cmd = 'Q';
                    points.push(ctlPtx, ctlPty, cpx, cpy);
                    break;
                case 'A':
                    var rx = p.shift(),
                        ry = p.shift(),
                        psi = p.shift(),
                        fa = p.shift(),
                        fs = p.shift();
                    var x1 = cpx,
                        y1 = cpy;
                    cpx = p.shift(), cpy = p.shift();
                    cmd = 'A';
                    points = _convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                    break;
                case 'a':
                    var rx = p.shift(),
                        ry = p.shift(),
                        psi = p.shift(),
                        fa = p.shift(),
                        fs = p.shift();
                    var x1 = cpx,
                        y1 = cpy;
                    cpx += p.shift(), cpy += p.shift();
                    cmd = 'A';
                    points = _convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                    break;
                }

                ca.push({
                    command: cmd || c,
                    points: points
                });

            }

            if (c === 'z' || c === 'Z') ca.push({
                command: 'z',
                points: []
            });
        }

        return ca;
    }


    function _convertEndpointToCenterParameterization(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {

        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes

        var psi = psiDeg * (Math.PI / 180.0);

        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if (lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if (fa == fs) f *= -1;
        if (isNaN(f)) f = 0;

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function (v) {
                return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            }
        var vRatio = function (u, v) {
                return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v))
            }
        var vAngle = function (u, v) {
                return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
            }
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);

        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if (vRatio(u, v) <= -1) dTheta = Math.PI;
        if (vRatio(u, v) >= 1) dTheta = 0;

        if (fs == 0 && dTheta > 0) dTheta = dTheta - 2 * Math.PI;
        if (fs == 1 && dTheta < 0) dTheta = dTheta + 2 * Math.PI;

        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    }
    return Vango;
});

