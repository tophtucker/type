// TOTAL RIPOFF OF FIZZYTEXT
// https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js
// (still has a ton of vestigial elements thereof)

function StreakyText(message) {

  var _this = this;

  var width = 960;
  var height = 500;

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  // This is the context we actually use to draw.
  var c = document.createElement('canvas');
  var g = c.getContext('2d');

  r.setAttribute('width', width);
  c.setAttribute('width', width);
  r.setAttribute('height', height);
  c.setAttribute('height', height);

  // Add our demo to the HTML
  document.getElementById('streakytext').appendChild(r);
  document.getElementById('streakytext').appendChild(c);

  var grd = s.createLinearGradient(0, 0, width, 0);
  grd.addColorStop(0.000, 'rgba(10, 0, 178, 1.000)');
  grd.addColorStop(0.500, 'rgba(255, 0, 0, 1.000)');
  grd.addColorStop(1.000, 'rgba(255, 0, 255, 1.000)');

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  // Set g.font to the same font as the bitmap canvas, incase we
  // want to draw some outlines.
  s.textBaseline = g.textBaseline = 'middle';
  s.textAlign = g.textAlign = "center";
  s.font = g.font = "400 150px 'Curlz SD', serif";

  g.globalAlpha = 1;

  // Instantiate some particles
  for (var i = 0; i < 20; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = grd;
    s.fillText(msg, width/2, height/2);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function (t) {

    // g.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      particles[i].render(t);
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

  createBitmap(message);
  d3.timer(render);

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    this.baseT = 0;
    this.fresh = true;
    this.drawRotations = 2*Math.PI * 4;

    // Color of particle
    this.baseC = "#" + Math.floor(Math.random()*0xffffff).toString(16);

    this.constrain = function (v, o1, o2) {
      if (v < o1) v = o1;
      else if (v > o2) v = o2;
      return v;
    };

    // Called every frame
    this.render = function (t) {

      // What color is the pixel we're sitting on top of?
      var c = getColor(this.x, this.y);

      // Are we within the boundaries of the image?
      var onScreen = this.x > 0 && this.x < width &&
          this.y > 0 && this.y < height;

      var isBlack = c != "rgb(255,255,255)" && onScreen;

      // take root at a new spot! pick up the color from the other canvas, set some curve parameters
      if (isBlack && this.fresh) {
        this.fresh = false;
        this.baseC = c;
        this.baseX = this.x;
        this.baseY = this.y;
        this.baseT = t;

        this.drawRotations = Math.random() * 2*Math.PI * 4;
        this.tightness = d3.scale.linear().range([50,75])(Math.random());
        this.clockwise = Math.random() > .5;
      }

      // parameter for our parameterization
      var tt = this.drawRotations - (t - this.baseT) / this.tightness;

      // find a new spot to take root, either cuz time's up or there's nothing here
      if (tt <= 0 || (!isBlack && this.fresh)) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.fresh = true;
        return; // Don't draw!
      }

      // Place marker
      g.strokeStyle = this.baseC;
      g.beginPath();
      g.moveTo(this.x, this.y);

      // Update position
      var magicNumber = 5;
      if(this.clockwise) {
        this.x += (tt/magicNumber) * Math.cos(tt);
        this.y += (tt/magicNumber) * Math.sin(tt);
      } else {
        this.x += (tt/magicNumber) * Math.sin(tt);
        this.y += (tt/magicNumber) * Math.cos(tt);
      }

      // Draw the streak.
      g.lineTo(this.x, this.y);
      g.stroke();

    }

  }

}
