var iframes = d3.selectAll('iframe')
  .datum(function() { return {}; })
  .each(function(d) {
    d.sel = d3.select(this);
    d.src = d.sel.attr('src');
    d.visible = false;
    d.sel.attr('src', null);
  });

d3.select(window).on('scroll', renderVisible)
renderVisible();

function renderVisible() {

  var visibleIframes = iframes.filter(function(d) { return d.visible; });
  var invisibleIframes = iframes.filter(function(d) { return !d.visible; });

  // unload iframes if no longer visible
  visibleIframes.each(function(d) {
    var bb = this.getBoundingClientRect();
    if(bb.bottom < 0 || bb.top > innerHeight) {
      d.sel.attr('src', null);
      d.visible = false;
    }
  });

  // load iframes if now visible
  invisibleIframes.each(function(d) {
    var bb = this.getBoundingClientRect();
    if(!(bb.bottom < 0 || bb.top > innerHeight)) {
      d.sel.attr('src', d.src);
      d.visible = true;
    }
  });
}