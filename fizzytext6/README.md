Crappy ripoff of FizzyText ([seen here](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage), [source here](https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js), [my attempted explanation here](http://bl.ocks.org/tophtucker/978513bc74d0b32d3795)).

Compared to the last, this one just has particles everywhere, randomly colored, that pick up the color of the (invisible) text when they go over its "shadow", so you can see the text by its color coherence. A color-blind person's nightmare, I guess.

N.b. that this has a downward bias, `this.y += this.v;`. As opposed to just following Perlin-derived flow field in any direction.