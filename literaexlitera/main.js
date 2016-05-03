function split(selection) {
  selection.each(function(d,i) {
    var text = this.innerText.split("");
    this.innerHTML = '';
    text.forEach(function(letter,j) {
      this.innerHTML += "<span>" + letter + "</span>";
    }, this);
    d3.select(this).selectAll("span")
      .each(function(dd,ii) {
        var data = {"bb": this.getBoundingClientRect()};
        data.x = data.bb.left;
        data.y = data.bb.top;
        d3.select(this).datum(data);
      });
  });
}


function positionAbsolutely(selection) {
  selection.each(function(d,i) {
    d3.select(this)
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + "px"; })
      .style('position', 'absolute');
  })
}

var noiseScale = 300;
var noiseStrength = 10;
var v = 0;
var noise = noiser(4,.8);
var graf = d3.select("p")
  .call(split)
  .style('height', function(d,i) { return this.getBoundingClientRect().height + 'px'; });
var letters = d3.selectAll("p span").call(positionAbsolutely);
var touchdown = false;

graf.on("mouseenter", function() { 
  if(touchdown) return;
  touchdown = true; 
  d3.timer(render); 
});
graf.on("mouseleave", function() { 
  console.log('hello');
  touchdown = false;
});

function render(t) {

  if(!touchdown) {
    v = 0;
    noise = noiser(4,.8);
    letters
      .each(function(d) { d.x = d.bb.left; d.y = d.bb.top; })
      .transition()
      .duration(1000)
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + "px"; });
    return true;
  }

  v += .005;

  letters.each(function(d,i) {

    var angle = noise(d.x / noiseScale, d.y / noiseScale) * noiseStrength;
    d.x += Math.cos(angle) * v;
    d.y += -Math.sin(angle) * v;

    d3.select(this)
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + "px"; });
  })
}