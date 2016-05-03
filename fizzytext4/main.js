// TOTAL RIPOFF OF FIZZYTEXT
// https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js
// (still has a ton of vestigial elements thereof)

function StreakyText(message) {

  var that = this;

  // These are the variables that we manipulate with gui-dat.
  // Notice they're all defined with "this". That makes them public.
  // Otherwise, gui-dat can't see them.

  this.growthSpeed = 0.03;       // how fast do particles change size?
  this.minR = 0.2;
  this.maxR = 1.5;
  this.minV = .4;
  this.maxV = 2;          // how big can they get?
  this.noiseStrength = 10;      // how turbulent is the flow?
  this.speed = 0.4;             // how fast do particles move?
  this.displayOutline = true;  // should we draw the message as a stroke?
  this.framesRendered = 0;

  ////////////////////////////////////////////////////////////////

  var _this = this;

  var width = 550;
  var height = 200;
  var textAscent = 101;
  var textOffsetLeft = 20;
  var noiseScale = 300;
  var frameTime = 30;

  // var colors = ["#00aeff", "#0fa954", "#54396e", "#e61d5f"];
  var colors = ["#00aeff"]

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  // This is the context we actually use to draw.
  var c = document.createElement('canvas');
  var g = c.getContext('2d');

  // And this one is used to leave behind the 'streaks'; it doesn't get cleared, see...
  var c2 = document.createElement('canvas');
  var g2 = c2.getContext('2d');

  r.setAttribute('width', width);
  c.setAttribute('width', width);
  c2.setAttribute('width', width);
  r.setAttribute('height', height);
  c.setAttribute('height', height);
  c2.setAttribute('height', height);

  // Add our demo to the HTML
  document.getElementById('streakytext').appendChild(c);
  document.getElementById('streakytext').appendChild(c2);

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  // Set g.font to the same font as the bitmap canvas, incase we
  // want to draw some outlines.
  s.font = g.font = g2.font = "800 82px helvetica, arial, sans-serif";

  // g2.fillStyle = 'rgba(0, 0, 0, 0.2)';
  g2.globalAlpha = .1;

  // Instantiate some particles
  for (var i = 0; i < 100; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = "#222";
    s.fillText(msg, textOffsetLeft, textAscent);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function () {

    that.framesRendered ++;

    g.clearRect(0, 0, width, height);

    if (_this.displayOutline) {
      g.globalCompositeOperation = "source-over";
      g.strokeStyle = "#000";
      g.lineWidth = .5;
      g.strokeText(message, textOffsetLeft, textAscent);
      g.fillText(message, textOffsetLeft, textAscent);
    }

    g.globalCompositeOperation = "darken";
    g2.globalCompositeOperation = "darker";

    for (var i = 0; i < particles.length; i++) {
      g.fillStyle = colors[i % colors.length];
      g2.fillStyle = colors[i % colors.length];
      particles[i].render();
    }

  };

  // Returns x, y coordinates for a given index in the pixel array.
  var getPosition = function (i) {
    return {
      x: (i - (width * 4) * Math.floor(i / (width * 4))) / 4,
      y: Math.floor(i / (width * 4))
    };
  };

  // Returns a color for a given pixel in the pixel array.
  var getColor = function (x, y) {
    var base = (Math.floor(y) * width + Math.floor(x)) * 4;
    var c = {
      r: pixels[base + 0],
      g: pixels[base + 1],
      b: pixels[base + 2],
      a: pixels[base + 3]
    };

    return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
  };

  this.message = message;
  createBitmap(message);

  var loop = function() {
    requestAnimationFrame(loop);
    render();
  }

  // This calls the render function every 30 milliseconds.
  loop();

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = 0.2;

    this.v = 0.1;

    this.constrain = function (v, o1, o2) {
      if (v < o1) v = o1;
      else if (v > o2) v = o2;
      return v;
    };

    // Called every frame
    this.render = function () {

      // What color is the pixel we're sitting on top of?
      var c = getColor(this.x, this.y);

      // Where should we move?
      var angle = noise(this.x / noiseScale, this.y / noiseScale) * _this.noiseStrength;

      // Are we within the boundaries of the image?
      var onScreen = this.x > 0 && this.x < width &&
          this.y > 0 && this.y < height;

      var isBlack = c != "rgb(255,255,255)" && onScreen;

      // If we're on top of a black pixel, slow.
      // If not, speed up.
      if (isBlack) {
        // this.v -= _this.growthSpeed;
        this.r += 10 * _this.growthSpeed;
      } else {
        // this.v += _this.growthSpeed;
        this.r -= _this.growthSpeed;
      }

      this.r = this.constrain(this.r, _this.minR, _this.maxR);
      this.v = this.constrain(this.v, _this.minV, _this.maxV);
      this.y += this.v;


      // Change our position based on the flow field and our
      // explode velocity.
      this.x += Math.cos(angle) * this.v;
      this.y += -Math.sin(angle) * this.v;

      // Once we fall off the bottom, respawn at random x-coord along top
      // if(this.y > height) {
      //   this.x = Math.random() * width;
      //   this.y = 0;
      // }

      // If we're off the screen, go over to other side
      if(this.x < 0) this.x = width;
      if(this.x > width) this.x = 0;
      if(this.y < 0) this.y = height;
      if(this.y > height) this.y = 0;

      // If we're tiny, keep moving around until we find a black
      // pixel.
      if (this.r <= .2) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        return; // Don't draw!
      }

      // Draw the circle.
      g.beginPath();
      g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g.fill();

      // Draw the streak.
      g2.beginPath();
      g2.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g2.fill();

    }

  }

}
