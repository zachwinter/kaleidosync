# kaleidosync

#### A web-based Spotify visualizer, powered by the Echo Nest.

Have you ever wanted a Spotify visualizer? Me too! Shout out to the Echo Nest, the backbone of this project.

The Echo Nest prides itself in the comprehensive algorithmic analysis of music. Having been acquired by Spotify, their data resources are publicly available via the Spotify API. Each song within Spotify's library have been fully analyzed: broken up into individual beats, segments, tatums, bars, and sections. There are variables assigned to describe mood, pitch, timber, and more – even how "danceable" a track is.

This is my take on using their data visually, created with the HTML5 `<canvas>` and modern JavaScript. 

[Kaleidosync: A Spotify Visualizer](https://kaleidosync.herokuapp.com/)

Feel free to reach out if you have any questions – or, even better, constructive feedback!

##### Version 2.0
• Re-implemented with `requestAnimationFrame()` 

• Now mobile-friendly, even on older devices 

• Improved tweening 

• Adjusts itself on window resize

• More accurate syncing with Spotify, including automatic self-correction