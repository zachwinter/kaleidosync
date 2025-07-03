# KALEIDOSYNC: music visualzation for the web

#### Try it out at [https://www.kaleidosync.com](https://www.kaleidosync.com)!

![](https://beta.kaleidosync.com/images/og.jpg)

## Background

`The Echo Nest`, before their acquisition by Spotify, represented the comprehensive algorithmic analysis of music. Each song within Spotify's [track analysis API](https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/) has been meticulously pre-analyzed: broken up into individual beats, segments, tatums, bars, and sections. With some clever elbow grease, it's possible to leverage these values with enough granularity to create meaningful visual experiences.

Since then, moving beyond the Echo Nest: I've developed a suite of tooling for _realtime_ audio analysis, right in the browser: on **any** device.

## Changelog

#### Version 10.0

> this one's actually [kaleidosync.com](https://www.kaleidosync.com), y'all

- Introduces the infrastructure for a Web3-native, realtime creative coding platform – supporting Spotify, Audius, Radio Paradise, KEXP, and more. Working on / coming soon: ShaderToy interoperability, our first browser extension, realtime creative coding events, educational workshops, and more.

#### Version 6.2 - 9.9

_~ frustrated apple noises ~_

#### Version 6.1

- Introduces dev mode, allowing live-editing of shaders and the creation of editable uniforms.

#### Version 6.0

- Complete re-write.
- Sketches have been removed from the codebase and are now stored in a database.
- New architecture connects directly with my visualizer authoring tools, enabling the publishing of new visualizers with the push of a button.
- Leverages the Spotify Web Playback SDK ([when available](https://developer.spotify.com/documentation/web-playback-sdk/#supported-browsers)), and falls back to legacy polling in browsers that are unsupported.

#### Version 5.5

- Cleanup / bug fixes.
- There are now 8 visualizers to choose from.

#### Version 5.4

- Reduces the complexity of adding new visualizers.
- Reverts back to the traditional polling when running the dev server.
- Surfaces a control interface for WebGL scenes.

#### Version 5.3

- There are now 7 visualizers to choose from.

#### Version 5.2

- Refactor / rate limit debugging.

#### Version 5.1

- There are now 6 visualizers to choose from.

#### Version 5.0

- Major refactor.
- There are now 5 visualizers to choose from.
- Includes an interface for rendering fragment shaders.

#### Version 4.0

- Project backbone has been abstracted away into its own library, [spotify-viz](https://github.com/zachwinter/spotify-viz).
- Adoped [@vue/cli](https://cli.vuejs.org) for the UI layer.
- There are now 4 visualizers to choose from.
- User settings now persist when revisiting the site.
- More graceful error handling and authentication flow.
- This project now fully represents what's hosted on [www.kaleidosync.com](https://www.kaleidosync.com), instead of the bare-bones implementation that it was before.

#### Version 3.0

- Complete refactor with no front end dependencies.
- Transitioned to webpack from gulp.
- Reactive data store using ES6 Proxies, semi-inspired by Vuex.
- (Hopefully) less spaghetti and more comments.

#### Version 2.0

- Re-implemented with `requestAnimationFrame()`
- Now mobile-friendly, even on older devices.
- Improved tweening.
- Adjusts itself on window resize.
- More accurate syncing with Spotify, including automatic self-correction.

#### Version 1.0

- Holy shit, it's working... kind of.

#### Version 0.1

- [( leaving this here )](https://codepen.io/anon/pen/RgZMPN)
