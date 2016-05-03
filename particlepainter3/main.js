// TOTAL RIPOFF OF FIZZYTEXT
// https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js
// (still has a ton of vestigial elements thereof)

function ParticlePainter(imgSrcs, container) {

  var globalT = 0;

  var width = 960;
  var height = 500;

  var imgIndex = 0;
  var imgSrc = imgSrcs[imgIndex];
  var switchInterval = 20000;
  var tOfLastSwitch = 0;

  this.decaySpeed = .5;
  var initialRScale = d3.scale.log()
    .domain([1,switchInterval/2])
    .range([100,2])
    .clamp(true);

  this.noiseStrength = 10;      // how turbulent is the flow?
  var noiseScale = 600;
  var noise = noiser(4,.8);

  var initialParticles = 10;
  var maxParticles = 2000;

  var _this = this;

  var mouse = [-1000,-1000];
  var rngDeviation = 40;
  var rngX = d3.random.normal(mouse[0], rngDeviation);
  var rngY = d3.random.normal(mouse[1], rngDeviation);  
  d3.select(container).on('mousemove', function() { 
    mouse = d3.mouse(this); 
    rngX = d3.random.normal(mouse[0], rngDeviation);
    rngY = d3.random.normal(mouse[1], rngDeviation);
  });

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  // This is the context we actually use to draw.
  var c = document.createElement('canvas');
  var g = c.getContext('2d');

  // Aaaand sticky drawing background
  var c2 = document.createElement('canvas');
  var g2 = c2.getContext('2d');

  r.setAttribute('width', width);
  c.setAttribute('width', width);
  c2.setAttribute('width', width);
  r.setAttribute('height', height);
  c.setAttribute('height', height);
  c2.setAttribute('height', height);

  // Add our demo to the HTML
  // document.getElementById('streakytext').appendChild(r);
  container.appendChild(c);
  container.appendChild(c2);

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  g.globalAlpha = 1;
  g2.globalAlpha = .5;

  // Instantiate some particles
  for (var i = 0; i < initialParticles; i++) {
    particles.push(new Particle(Math.random() * width, Math.random() * height));
  }

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function (msg) {

    console.log('creating bitmap...')
    console.log(initialParticles);

    var img = new Image();   // Create new img element
    img.addEventListener("load", function() {
      // execute drawImage statements here
      s.drawImage(img,0,0);
      var imageData = s.getImageData(0, 0, width, height);
      pixels = imageData.data;

      // reset number of particles
      particles = particles.slice(0,0);
      tOfLastSwitch = globalT;
      // debugger
    }, false);
    img.src = msg; // Set source path

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function (t) {

    // if(!pixels.length) return false;

    // debugger

    globalT = t;

    g.clearRect(0,0,width,height);

    g.globalCompositeOperation = "darken";
    g2.globalCompositeOperation = "source-over";

    imgIndex = Math.floor(t/switchInterval) % imgSrcs.length;
    if(imgSrcs[imgIndex] !== imgSrc) {
      console.log('switch images!');
      imgSrc = imgSrcs[imgIndex];
      createBitmap(imgSrc);
    }

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
  d3.timer(render);

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = 0; //_this.initialR * Math.random();
    this.dr = /*Math.random() **/ _this.decaySpeed;

    this.v = 1;

    this.c = undefined;

    // Called every frame
    this.render = function (t) {

      this.r -= this.dr;

      if(this.r <= 0) {
        // this.x = rngX();
        // this.y = rngY();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // this.r = _this.initialR * Math.random();
        this.r = initialRScale((t-tOfLastSwitch) % switchInterval) * Math.random();
        this.dr = /*Math.random() **/ _this.decaySpeed;
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

      g2.fillStyle = this.c;
      g2.beginPath();
      g2.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      g2.fill();

    }

  }

}

function constrain(v, o1, o2) {
  if (v < o1) v = o1;
  else if (v > o2) v = o2;
  return v;
};
