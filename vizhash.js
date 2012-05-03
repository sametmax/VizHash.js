/**
  Visual Hash javascript implementation (V 0.1)

  Based and compatible with VizHash_GD:
    http://sebsauvage.net/wiki/doku.php?id=php:vizhash_gd

  This is free software under the zlib/libpng licence:
    http://www.opensource.org/licenses/zlib-license.php

  Requires:
    http://pajhome.org.uk/crypt/md5/2.2/sha1-min.js
    http://pajhome.org.uk/crypt/md5/2.2/md5-min.js

  Usage:

    if (vizhash.supportCanvas()) {
      var width = 128; // max 256
      var height = 128; // max 256
      var vhash = vizhash.canvasHash(text, width, height);
      document.body.appendChild(vhash.canvas);
    }


*/

vizhash = {

    textHash: function(text) {

    var that = {};

    /** Hash the input and add more data to make graphics */
    function hashString(text) {
      var hash = hex_sha1(text) + hex_md5(text);
      return hash + hash.split('').reverse().join('');
    }

    /*
      Turn the hash into an array of integer by taking each 2 caracters
      and considering each pair as an hexadecimal value.
    */
    function toIntArray(){
      var hash = that.value;
      var values = []
      for (var i = 0; i < hash.length; i += 2) {
        values.push(parseInt(hash.substr(i, 2), 16));
      };
      return values;
    }

    that.toString = function() {return that.value};

    that.value = hashString(text);

    /**
      The textHash represented as an array of integers.
      It's used to generate a sequences of integer that appear random to the
      human eye while beeing perfectly deterministic.
    */
    that.intArray = function(){
      var self = {values: toIntArray(), index:0};
      /* Returns an integer from the integer array and increment
         the index using modulus, so you can call next()
         indefinitly and always get a value from somewhere in the array.
      */
      self.next = function() {
          var value = self.values[self.index];
          self.index += 1;
          self.index %= self.values.length;
          return value;
      };
      return self;
    }();

    return that;
  },

  canvasHash: function(text, width, height){

    /*********************
      Base variables
    **********************/

    if (width > 256 || height > 256) {throw "Max image size is 256 x 256"}

    var that = {hash: vizhash.textHash(text)},
        intArray = that.hash.intArray,
        baseColor = vizhash.color(intArray.next(),
                                   intArray.next(),
                                   intArray.next());
    width = that.width = width || 80;
    height = that.height = height || 80;
    var canvas = that.canvas = vizhash.createCanvas(width, height);
    var context = that.context = canvas.getContext("2d");

    /*********************
      Methods
    **********************/

    /** Returns a single integer from the textHash Int Array
        (roughly mapped to image width or height) */
    function getX() {
      var i = intArray.next();
      return width * i / 256;
    }
    function getY() {
      var i = intArray.next();
      return height * i / 256;
    }

    /** Close javascript equivalent of the PHP DG ImageFilledEllipse
        function */
    function drawEllipse(context, centerX, centerY, width, height, color) {

      var x = centerX - width / 2,
          y = centerY - height / 2,
          kappa = .5522848;

      var  ox = (width / 2) * kappa, // control point offset horizontal
           oy = (height / 2) * kappa, // control point offset vertical
           xe = x + width,           // x-end
           ye = y + height,           // y-end
           xm = x + width / 2,       // x-middle
           ym = y + height / 2;       // y-middle

      context.beginPath();
      context.moveTo(x, ym);
      context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      context.fillStyle = color.toString();
      context.fill();
      context.closePath();
    }

    /** Close javascript equivalent of the PHP DG ImageFilledPolygon
        function */
    function drawPolygone(context, points, color) {
      context.beginPath();

      for (var i = 0; i < points.length; i = i+2) {
        context.lineTo(points[i], points[i + 1]);
      };

      context.fillStyle = color.toString();
      context.fill();
      context.closePath();
    }

    /** Close javascript equivalent of the PHP DG ImageFilledArc
        function. Unfortunatly, it uses radius instead of height
        and width, resulting in a significantly different output. */
    function drawArc(context, centerX, centerY, width,
                      height, start, end, color) {
      context.beginPath();
      context.arc(centerX, centerY, width / 2,  start,  end, false);
      context.fillStyle = color.toString();
      context.fill();
      context.closePath();
    }

    /** Close javascript equivalent of the PHP DG ImageFilledRectangle
        function */
    function drawRectangle(context, x1, y1, x2, y2, color) {
      context.beginPath();
      context.rect(x1, y1, x2 - x1, y2 - y1);
      context.fillStyle = color.toString();
      context.fill();
      context.closePath();
    }

    /** Cover the whole canvas with a linear gradient.
        Coordinates generated using the textual hash integer array state. */
    function addGradient() {

      if (intArray.next() % 2) { /* Vertical or horizontal gradient ? */
         var grd = context.createLinearGradient(0, 0, 0, height);
      } else {
         var grd = context.createLinearGradient(0, 0, width, height);
      }

      grd.addColorStop(0, baseColor.toString());
      grd.addColorStop(1, 'rgb(0,0,0)');
      context.rect(0, 0, width, height);
      context.fillStyle = grd;
      context.fill();
    }

    /** Draw a shape into the canvas. The resulting shape depends of the
        passed integer and the color. Coordinates generated using the
        textual hash integer array state. */
    function addShape(shape, color){

      switch (shape % 7){
        case 0:
          drawRectangle(context, getX(), getY(), getX(), getY(), color);
        break;
        case 1:
        case 2:
          drawEllipse(context, getX(), getY(), getX(), getY(), color);
        break;
        case 3:
          var points = [getX(), getY(), getX(), getY(),
                        getX(), getY(), getX(), getY()]
          drawPolygone(context, points, color);
        break;
        case 4:
        case 5:
        case 6:
          var start = intArray.next() * 2 * Math.PI / 256;
          var end = start + intArray.next() *  Math.PI  / 256;
          drawArc(context, getX(), getY(), getX(), getY(), start, end, color);
        break;
      }

    }

    /** Draw 8 shapes into the canvas. Colors and shapes are generated using
        the textual hash integer array state.*/
    function addShapes() {
      for(var i = 0; i <= 7; i++) {
        var shape = intArray.next();

        baseColor.r = Math.round((baseColor.r + intArray.next() / 25) % 256);
        baseColor.g = Math.round((baseColor.g + intArray.next() / 25) % 256);
        baseColor.b = Math.round((baseColor.b + intArray.next() / 25) % 256);
        addShape(shape, baseColor);
      }
      var color = vizhash.color(intArray.next(), intArray.next(), intArray.next());
      addShape(intArray.next(), color);
    }

    /** Turn the visual has into a image DOM element*/
    that.toImage = function() {
      var img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      return img;
    }

    /*********************************
      Create visual hash in canvas
    **********************************/

    addGradient();
    addShapes();

    return that;
  },

  /** Create a canvas DOM element */
  createCanvas: function(width, height) {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      return canvas;
  },

  /** Check if browser supports canvas */
  supportCanvas: function(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  },

  /** A RGB color object with the ability to serialize */
  color: function(r, g, b){
    var that = {r: r, g: g, b: b};
    that.toString = function(){
      return "rgb(" + that.r + "," + that.g + "," + that.b + ")";
    };
    return that;
  }
};