module.exports = {
  title: 'Kaleidosync',

  /**
   * Your application `client_id` and `client_secret`.
   * Manage in your Spotify developer dashboard.
   */
  client_id: 'YOUR CLIENT ID HERE',
  client_secret: 'YOUR CLIENT SECRET HERE',

  /**
   * Set your application's Redirect URI to the following:
   */
  redirect_uri: 'http://localhost:8001/callback',

  /**
   * Don't change these.
   */
  scope: 'user-read-playback-state',
  state_key: 'KALEIDOSYNC_AUTH_ID',
  access_token: 'KALEIDOSYNC_ACCESS_TOKEN',
  refresh_token: 'KALEIDOSYNC_REFRESH_TOKEN',
  refresh_code: 'KALEIDOSYNC_REFRESH_CODE'
}