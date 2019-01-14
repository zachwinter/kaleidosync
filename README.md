# kaleidosync

> An HTML5 Spotify visualizer, powered by the Echo Nest.

##### View hosted project [here](https://kaleidosync.herokuapp.com/).

Have you ever wanted a Spotify visualizer? Me too! Shout out to the Echo Nest, the backbone of this project.

The Echo Nest prides itself in the comprehensive algorithmic analysis of music. Having been acquired by Spotify, their data resources are publicly available via the Spotify API. Each song within Spotify's library have been fully analyzed: broken up into individual beats, segments, tatums, bars, and sections. There are variables assigned to describe mood, pitch, timber, and more – even how "danceable" a track is.

This is my take on using their data visually, created with the HTML5 `<canvas>` and modern JavaScript. Feel free to reach out if you have any questions – or, even better, constructive criticism.

#### Run Locally

> Note: this is a bare bones implementation of what's hosted on Heroku – no landing page, tooltip, etc. 

1) Create a new Spotify app in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2) Add `http://localhost:8001/callback` to your app's Redirect URIs.
2) Enter your app's `client_id` and `client_id` to `config.json` in the root directory.
3) Install and run using NPM.

```bash
npm i
npm run dev
```

5) Visit `http://localhost:8000` and log in with your Spotify account. 
6) Play a song in your Spotify client of choice. The visualizer will take a moment to sync before initializing.

##### Version 3.0

* Complete refactor with no front end dependencies.
* Transitioned to webpack from gulp. 
* Reactive data store using ES6 Proxies, semi-inspired by Vuex.
* (Hopefully) less spaghetti and more comments. 

##### Version 2.0

* Re-implemented with `requestAnimationFrame()` 
* Now mobile-friendly, even on older devices.
* Improved tweening.
* Adjusts itself on window resize.
* More accurate syncing with Spotify, including automatic self-correction.