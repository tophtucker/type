// TOTAL RIPOFF OF FIZZYTEXT
// https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js
// (still has a ton of vestigial elements thereof)

function ParticlePainter(imgSrc, container) {

  var width = 960;
  var height = 600;

  this.initialR = 3;
  this.decaySpeed = 0.1;

  this.minR = 0.2;
  this.maxR = 1.5;

  this.noiseStrength = 10;      // how turbulent is the flow?
  var noiseScale = 600;
  var noise = noiser(4,.8);

  var initialParticles = 10;
  var maxParticles = 2000;

  var _this = this;

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
  // document.getElementById('streakytext').appendChild(r);
  container.appendChild(c);

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  g.globalAlpha = 1;

  // Instantiate some particles
  for (var i = 0; i < initialParticles; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    var img = new Image();   // Create new img element
    img.addEventListener("load", function() {
      // execute drawImage statements here
      s.drawImage(img,0,0);
      var imageData = s.getImageData(0, 0, width, height);
      pixels = imageData.data;
      d3.timer(render);
    }, false);
    img.src = msg; // Set source path

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function (t) {

    g.globalCompositeOperation = "darken";
    // g.globalCompositeOperation = "source-over";

    if(particles.length < maxParticles) {
      particles.push(new Particle(Math.random() * width, Math.random() * height));
    }

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

  createBitmap(imgSrc);

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = _this.initialR;
    this.dr = Math.random() * _this.decaySpeed;

    this.v = 1;

    this.c = undefined;

    // Called every frame
    this.render = function (t) {

      this.r -= this.dr;

      if(this.r <= 0) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = _this.initialR;
        this.dr = Math.random() * _this.decaySpeed;
        this.c = undefined;
      }

      // this.c = this.c === undefined ? getColor(this.x, this.y) : d3.interpolate(this.c, getColor(this.x, this.y))(.01);
      if(this.c === undefined) this.c = getColor(this.x, this.y);

      // Where should we move?
      var angle = noise(this.x / noiseScale, this.y / noiseScale) * _this.noiseStrength;

      // Change our position based on the flow field and our
      // explode velocity.
      this.x += Math.cos(angle) * this.v;
      this.y += -Math.sin(angle) * this.v;

      // Draw the streak.
      g.fillStyle = this.c;
      g.beginPath();
      g.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g.fill();

    }

  }

}

function constrain(v, o1, o2) {
  if (v < o1) v = o1;
  else if (v > o2) v = o2;
  return v;
};
