TOTALLY SUPER DUPER NOT MY WORK! Trying to illuminate how FizzyText ([seen here](https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage), [source here](https://github.com/dataarts/dat.gui/blob/gh-pages/docs/demo.js), isolated from dat.GUI dependency [here](http://bl.ocks.org/tophtucker/3ebb9f8ec9ac77d0273f)) works. Original appears to have been written by George Michael Brower. 

In the original, which I find brilliant:

- Solid black text is drawn onto an invisible canvas, from which it gets bitmap data  
- The bitmap data is read like a collision detection array, where black means "you're on top of text" and white means "you're not"  
- Particles of size r=0 are randomly spawned on a visible canvas  
- The particles grow if they're on top of a (non-rendered) black pixel, and shrink till they disappear if not  
- When they shrink to r=0, they respawn randomly somewhere  
- The particles follow a Perlin noise flow field, a very sensible and fluid kind of random movement, in which nearby particles move similarly  

I've made two changes:

- Particles don't disappear all the way  
- They loop around the canvas like a torus instead of respawning (so eventually fall into 'attractor' channels or whatever)  

This just serves to illustrate (for my own benefit) how the original works, in the hopes of maybe ripping it off in some cool way.

I think the whole thing is brilliant — using a particle system to render text, using an invisible canvas's color data as collision detection, and the Perlin flow field.