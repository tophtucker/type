Crappy ripoff of FizzyText ([seen here](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage), [source here](https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js), [my attempted explanation here](http://bl.ocks.org/tophtucker/978513bc74d0b32d3795)).

Extremely similar to the original FizzyText, except kinda hacked apart and put together more sloppily. Differences:

- Particles pick up the color of the underlying (invisible) canvas. (Could just as easily be used with images or whatever.)  
- Particles slow down while they're atop the letterforms.  
- The flow field oscillates between two different flow fields, giving the appearance of the letters periodically being blown apart and re-cohering.  
- I'm still not randomly seeding the noise generators correctly, so...  