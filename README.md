# kaleidosync

#### A web-based Spotify visualizer, powered by the Echo Nest.

The Echo Nest prides itself in the comprehensive algorithmic analysis of music. Having been acquired by Spotify, their data resources are publicly available via the Spotify API. 

Each song within Spotify's library have been fully analyzed: broken up into individual beats, segments, tatums, bars, and sections. There are variables assigned to describe mood, pitch, timber, and more – even how "danceable" a track is.

Using the HTML5 canvas I took a procedural approach to creating a visual representation of their efforts. 

[https://kaleidosync.herokuapp.com/](https://kaleidosync.herokuapp.com/)

If you're interested in creating something similar, I've included a template as a starting point.

`/public/js/kaleidosync/template.js`

The templat extends base classes that keep track of your currently playing song, which specific interval is active, and expose event hooks on every interval change: e.g. on every beat change, do {x}.

Feel free to reach out if you have any questions – or, even better, constructive feedback!
