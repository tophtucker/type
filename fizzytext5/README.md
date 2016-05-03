Crappy ripoff of FizzyText ([seen here](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage), [source here](https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js), [my attempted explanation here](http://bl.ocks.org/tophtucker/978513bc74d0b32d3795)).

Improvements:

- Particles pick up the background color from the underlying canvas, which is hidden here  
- I like when the particles draw the letterforms without just `fillText`ing as a crutch  
- Refactored improvedNoise.js a bit to return a noise generator, so you can get different seeds or whatever, instead of just a single global noise() function. But that's not really being used yet here...