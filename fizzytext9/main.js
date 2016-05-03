// TOTAL RIPOFF OF FIZZYTEXT
// https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js
// (still has a ton of vestigial elements thereof)

function StreakyText(container, titles) {

  var that = this;

  // These are the variables that we manipulate with gui-dat.
  // Notice they're all defined with "this". That makes them public.
  // Otherwise, gui-dat can't see them.

  this.growthSpeed = 0.05;       // how fast do particles change size?
  this.minR = 0;
  this.maxR = 12;
  this.minV = .4;
  this.maxV = 3;          // how big can they get?
  this.noiseStrength = 10;      // how turbulent is the flow?
  
  this.speed = 0;             // how fast do particles move?
  
  this.initialSpeed = 0;
  this.speedDelay = 500;
  this.timeToMaxSpeed = 4000;
  this.maxSpeed = .5;

  ////////////////////////////////////////////////////////////////

  var _this = this;

  var width = container.offsetWidth;

  // var height = container.offsetHeight;

  var height = .5 * width;
  d3.select(container)
    .style("height", height + "px");

  var noiseScale = 300;
  var frameTime = 30;

  var fontSizeScale = d3.scale.linear()
    .domain([1200, 320])
    .range([200, 60]);

  var particleFontSizeScale = d3.scale.linear()
    .domain([1200, 320])
    .range([20, 10]);

  var leftOffsetScale = d3.scale.linear()
    .domain([1200, 320])
    .range([50, 0])

  // var fontSize = 200;
  var fontSize = Math.round(fontSizeScale(width));
  var particleFontSize = Math.round(particleFontSizeScale(width));
  var leftOffset = Math.round(leftOffsetScale(width))

  var noise1 = noiser(4,.8);
  var noise2 = noiser(4,.5);

  // This is the context we use to get a bitmap of text using
  // the getImageData function.
  var r = document.createElement('canvas');
  var s = r.getContext('2d');

  // This is the context we actually use to draw.
  var c = document.createElement('canvas');
  var g = c.getContext('2d');

  // This is the context we actually use to draw streaks.
  var c2 = document.createElement('canvas');
  var g2 = c2.getContext('2d');

  r.setAttribute('width', width);
  c.setAttribute('width', width);
  c2.setAttribute('width', width);
  r.setAttribute('height', height);
  c.setAttribute('height', height);
  c2.setAttribute('height', height);

  // Add our demo to the HTML
  // container.appendChild(r);
  container.appendChild(c2);
  container.appendChild(c);

  // Stores bitmap image
  var pixels = [];

  // Stores a list of particles
  var particles = [];

  // Set g.font to the same font as the bitmap canvas, incase we
  // want to draw some outlines.
  s.font = "400 "+fontSize+"px helvetica, arial, serif";
  s.textBaseline = 'middle';

  g.font = g2.font = "400 "+particleFontSize+"px monospace";
  // g.globalAlpha = 1;
  g.fillStyle = "#000";
  g2.fillStyle = "#ccc";

  g.globalCompositeOperation = "darken";
  g2.globalCompositeOperation = "multiply";

  var mouse = [width/2,height/2];
  d3.select(container).on("mousemove", function() { mouse = d3.mouse(this); });

  // Instantiate some particles
  // for (var i = 0; i < 1500; i++) {
  //   particles.push(new Particle(Math.random() * width, Math.random() * height));
  // }

  titles = titles.slice(0,50);
  titles.forEach(function(d,i) {
    var newH = i * (height / titles.length);
    var newW = Math.random() * width * .3;
    titles.pop().split("").forEach(function(character, i) {
      particles.push(new Particle(newW + i*10, newH, character));
    });
  })
  // console.log(particles.length);

  // This function creates a bitmap of pixels based on your message
  // It's called every time we change the message property.
  var createBitmap = function () {

    s.fillStyle = "#fff";
    s.fillRect(0, 0, width, height);

    s.fillStyle = "#000";
    s.fillText("Best Books", leftOffset, height*.33);
    s.fillText("of 2015", leftOffset, height*.67);

    // Pull reference
    var imageData = s.getImageData(0, 0, width, height);
    pixels = imageData.data;

  };

  // Called once per frame, updates the animation.
  var render = function (t) {

    that.framesRendered ++;

    g.clearRect(0, 0, width, height);

    // speed is piecewise: flat at min, sin wave up to max, flat at max
    // _this.speed = .5;
    if(t < _this.speedDelay) {
      _this.speed = 0;
    } else if (t < _this.speedDelay + _this.timeToMaxSpeed) {
      var tt = t - _this.speedDelay;
      _this.speed = _this.maxSpeed * ( (Math.sin((Math.PI * tt / _this.timeToMaxSpeed) - (Math.PI/2)) + 1) / 2 )
    } else {
      _this.speed = _this.maxSpeed;
    }
    // console.log(t, _this.speed);

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

  createBitmap();
  d3.timer(render);

  // This class is responsible for drawing and moving those little
  // colored dots.
  function Particle(x, y, c) {

    // Position
    this.x = x;
    this.y = y;

    // Size of particle
    this.r = _this.maxR / 1;

    // Speed of particle
    this.v = _this.maxV;

    this.character = c || getRandomChar();

    this.constrain = function (v, o1, o2) {
      if (v < o1) v = o1;
      else if (v > o2) v = o2;
      return v;
    };

    function getRandomChar()
    {
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return possible.charAt(Math.floor(Math.random() * possible.length));
    }

    // Called every frame
    this.render = function (t) {

      // What color is the pixel we're sitting on top of?
      var c = getColor(this.x, this.y);

      // Where should we move?
      var angle1 = noise1(this.x / noiseScale, this.y / noiseScale) * _this.noiseStrength;
      var angle2 = noise2(this.x / noiseScale, this.y / noiseScale) * _this.noiseStrength;

      // Oscillate between two Perlin noise flow fields every 10 seconds
      var noiseInterpolate = d3.scale.linear()
          .range([angle2,angle1]);
      var tt = .5 * Math.cos((2*Math.PI*t)/60000) + .5;
      var angle = noiseInterpolate(tt);

      // var angle = angle1;

      // Are we within the boundaries of the image?
      var onScreen = this.x > 0 && this.x < width &&
          this.y > 0 && this.y < height;

      var isBlack = c != "rgb(255,255,255)" && onScreen;

      // If we're on top of a black pixel, slow.
      // If not, speed up.
      if (isBlack) {
        this.v -= _this.growthSpeed;
        this.r += 10 * _this.growthSpeed * _this.speed;
        // this.r = _this.maxR;
      } else {
        this.v += _this.growthSpeed;
        this.r -= 3 * _this.growthSpeed * _this.speed;
      }

      this.r = this.constrain(this.r, _this.minR, _this.maxR);
      this.v = this.constrain(this.v, _this.minV, _this.maxV);
      

      // Change our position based on the flow field and our
      // explode velocity.
      this.x += Math.cos(angle) * this.v * _this.speed;
      this.y += -Math.sin(angle) * this.v * _this.speed;
      // this.x += 2;

      // If we're off the screen, go over to other side (torus topology)
      // if(this.x < 0) this.x = width;
      // if(this.x > width) this.x = 0;
      // if(this.y < 0) this.y = height;
      // if(this.y > height) this.y = 0;

      if (!onScreen) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = _this.minR;
        return; // Don't draw!
      }

      // If we're tiny, keep moving around until we find a black
      // pixel.
      if (this.r <= _this.minR) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.r = _this.minR;
        return; // Don't draw!
      }

      // Draw the streak.
      // g.font = g2.font = "400 "+this.r+"px monospace";
      g.globalAlpha = this.r / _this.maxR;

      g.fillText(this.character, this.x, this.y);

      if(isBlack) {
        g2.fillText(this.character, this.x, this.y);
      }

    }

  }

}
