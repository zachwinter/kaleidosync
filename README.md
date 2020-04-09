# kaleidosync
> An HTML5 Spotify visualizer, built with [spotify-viz](https://github.com/zachwinter/spotify-viz) and [Vue](https://github.com/vuejs/vue).

####  Try it out at [www.kaleidosync.com](https://www.kaleidosync.com)!

## Background

The Echo Nest prides itself on the comprehensive algorithmic analysis of music. Having been acquired by Spotify, their analysis resources are available publically via the Spotify API. Each song within Spotify's library have been fully analyzed: broken up into individual beats, segments, tatums, bars, and sections. There are variables assigned to describe mood, active volume, pitch, timbre, and more – even how "danceable" a track is.

This project is my take on using their data to produce visual experiences. If you're interested in doing the same, I created [spotify-viz](https://github.com/zachwinter/spotify-viz) as a reasonable starting point.


## Run Locally
1) Create a new Spotify app in your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
2) Add `http://localhost:8001/callback` to your app's Redirect URIs. Make note to save your `Client ID` and `Client Secret`.
3) Create a file named `.env` and place it in the project's root directory. Populate it with the following values:

```bash
CLIENT_ID=YOUR_CLIENT_ID_HERE
CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
REDIRECT_URI=http://localhost:8001/callback
PROJECT_ROOT=http://localhost:8001
NODE_ENV=development
STATE_KEY=KALEIDOSYNC_STATE_KEY
ACCESS_TOKEN=KALEIDOSYNC_ACCESS_TOKEN
REFRESH_TOKEN=KALEIDOSYNC_REFRESH_TOKEN
REFRESH_CODE=KALEIDOSYNC_REFRESH_CODE
```

> Note: `STATE_KEY`, `ACCESS_TOKEN`, `REFRESH_TOKEN`, and `REFRESH_CODE` can all be set to any unique strings. If you use [www.kaleidosync.com](https://www.kaleidosync.com) regularly it might be worth choosing your own values to avoid state conflict.

4) In the project's root directory, install dependencies using NPM:
```bash
npm i
```
5) Then build and serve the project via @vue/cli:
```bash
npm serve
```
6) Once running, visit [http://localhost:8080](http://localhost:8080) and log in with your Spotify account. 
7) Play a song in your Spotify client of choice. The visualizer will take a moment to sync before initializing.

## Changelog

> #### Version 5.0

* Major refactor.
* There are now 5 visualizers to choose from.
* Includes an interface for rendering fragment shaders.

> #### Version 4.0
* Project backbone has been abstracted away into its own library, [spotify-viz](https://github.com/zachwinter/spotify-viz).
* Adoped [@vue/cli](https://cli.vuejs.org) for the UI layer.
* There are now 4 visualizers to choose from.
* User settings now persist when revisiting the site. 
* More graceful error handling and authentication flow. 
* This project now fully represents what's hosted on [www.kaleidosync.com](https://www.kaleidosync.com), instead of the bare-bones implementation that it was before. 


> #### Version 3.0

* Complete refactor with no front end dependencies.
* Transitioned to webpack from gulp. 
* Reactive data store using ES6 Proxies, semi-inspired by Vuex.
* (Hopefully) less spaghetti and more comments. 

> #### Version 2.0

* Re-implemented with `requestAnimationFrame()` 
* Now mobile-friendly, even on older devices.
* Improved tweening.
* Adjusts itself on window resize.
* More accurate syncing with Spotify, including automatic self-correction.

> #### Version 1.0
* Holy shit, it's working... kind of. 