import { createApp } from "@wearesage/vue";
import * as generatedRoutes from "./routes.generated";
import App from "./App.vue";

const originalWriteText = navigator.clipboard?.writeText;
if (originalWriteText) {
  navigator.clipboard.writeText = function (...args) {
    console.trace("CLIPBOARD WRITE ATTEMPT:", args);
    return originalWriteText.apply(this, args);
  };
}

async function initializeApp() {
  const { app, router, pinia } = await createApp(App, { routes: generatedRoutes });

  return { app, router, pinia };
}

initializeApp().catch(console.error);
