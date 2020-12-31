
# kaleidosync
> An WebGL Spotify visualizer made with [Vue](https://github.com/vuejs/vue), [D3](https://github.com/d3/d3), and [Three.js](https://github.com/mrdoob/three.js/).

#### Try it out at [www.kaleidosync.com](https://www.kaleidosync.com)!

## Background
The Echo Nest represents the comprehensive algorithmic analysis of music. Having been acquired by Spotify, their analysis resources are available via the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/). Each song within Spotify's library have been fully analyzed: broken up into individual beats, segments, tatums, bars, and sections. There are variables assigned to describe mood, active volume, pitch, timbre, and more – even how "danceable" a track is. One can even derive realtime volume information, all without processing the audio stream directly. 

This project is my take on using this data to produce visual experiences.

## Running Locally
As of version 6.0.0, you will not be able to run this project locally in any reasonable way due to its dependencies on my (unpublished) authoring tools. If you absolutely must get this running on your machine, feel free to reach out to me and I'll walk you through the hurdles and what you'll need to build in order for it to be useful. 

## Changelog
>  #### Version 6.0
* Complete re-write.
* Sketches have been removed from the codebase and are now stored in a database.
* New architecture connects directly with my visualizer authoring tools, enabling the publishing of new visualizers with the push of a button.
* Leverages the Spotify Web Playback SDK ([when available](https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers)), and falls back to legacy polling in browsers that are unsupported.

>  #### Version 5.5
* Cleanup / bug fixes.
* There are now 8 visualizers to choose from.

>  #### Version 5.4
* Reduces the complexity of adding new visualizers.
* Reverts back to the traditional polling when running the dev server.
* Surfaces a control interface for WebGL scenes.

>  #### Version 5.3
* There are now 7 visualizers to choose from.

>  #### Version 5.2
* Refactor / rate limit debugging.

>  #### Version 5.1
* There are now 6 visualizers to choose from.

>  #### Version 5.0
* Major refactor.
* There are now 5 visualizers to choose from.
* Includes an interface for rendering fragment shaders.

>  #### Version 4.0
* Project backbone has been abstracted away into its own library, [spotify-viz](https://github.com/zachwinter/spotify-viz).
* Adoped [@vue/cli](https://cli.vuejs.org) for the UI layer.
* There are now 4 visualizers to choose from.
* User settings now persist when revisiting the site.
* More graceful error handling and authentication flow.
* This project now fully represents what's hosted on [www.kaleidosync.com](https://www.kaleidosync.com), instead of the bare-bones implementation that it was before.
>  #### Version 3.0
* Complete refactor with no front end dependencies.
* Transitioned to webpack from gulp.
* Reactive data store using ES6 Proxies, semi-inspired by Vuex.
* (Hopefully) less spaghetti and more comments.

>  #### Version 2.0
* Re-implemented with `requestAnimationFrame()`
* Now mobile-friendly, even on older devices.
* Improved tweening.
* Adjusts itself on window resize.
* More accurate syncing with Spotify, including automatic self-correction.
>  #### Version 1.0
* Holy shit, it's working... kind of.