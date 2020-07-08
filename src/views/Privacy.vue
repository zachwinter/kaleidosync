<template lang="pug">
.privacy
  h1 Privacy Policy
  p Kaleidosync leverages #[a(href="https://analytics.google.com/analytics/web/") Google Analytics] for insights into website traffic and the behavior of users on the site.
  p Third party vendors, including Google, use cookies to serve ads based on your previous visits to Kaleidosync, or other websites.
  p Change your Google Ad Settings #[a(href="https://www.google.com/settings/ads") here]. Opt out of some third-party vendors' uses of cookies for personalized advertising by visiting #[a(href="https://www.aboutads.info") https://www.aboutads.info]
  router-link(to="/").link Return Home
</template>

<style lang="scss" scoped>
.privacy {
  @include scale(width 50% 100%);
  padding: $outer-padding;
}

h1 {
  margin-bottom: 30px;
}

p {
  margin-bottom: 10px;
}

.link {
  @include button;
  width: 200px;
  margin-top: 30px;
}
</style>