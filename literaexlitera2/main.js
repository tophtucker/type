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

var container = d3.select("body");
var text = container.select(".text");
var graf = text.selectAll("p")
  .call(split)
  .style('height', function(d,i) { return this.getBoundingClientRect().height + 'px'; });
var letters = text.selectAll("span").call(positionAbsolutely);

var canvasText = new CanvasText(container.node(), 'KUNDERA');

text.on("mousemove", function() {
  console.log(canvasText.getColor(d3.mouse(this)[0], d3.mouse(this)[1]));
})

var maxX = container.node().offsetWidth;
var maxY = container.node().offsetHeight;

text.on("mouseenter", function() {

  var targets = d3.range(letters.size()).map(function(d) {
    r = {};
    do {
      r.x = Math.floor(Math.random() * maxX);
      r.y = Math.floor(Math.random() * maxY);
      r.c = canvasText.getColor(r.x, r.y);
    } while (r.c == "rgb(255,255,255)");
    return r;
  });

  // semi-random sort by distance from top left corner
  targets = targets.sort(function(a,b) {
    return Math.random()*(Math.pow(a.x,2) + Math.pow(a.y,2)) - Math.random()*(Math.pow(b.x,2) + Math.pow(b.y,2));
  })

  letters
    .transition()
    .duration(2000)
    .delay(function(d,i) { return 2*i; })
    .style('left', function(d,i) { return targets[i].x + "px"; })
    .style('top', function(d,i) { return targets[i].y + "px"; });
});

text.on("mouseleave", function() { 
  letters
    .transition()
    .duration(1000)
    .delay(function(d,i) { return i; })
    .style('left', function(d) { return d.x + "px"; })
    .style('top', function(d) { return d.y + "px"; });
});