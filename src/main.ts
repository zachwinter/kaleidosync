import { createApp } from "@wearesage/vue";
import * as generatedRoutes from "./routes.generated";
import App from "./App.vue";

async function initializeApp() {
  const { app, router, pinia } = await createApp(App, { routes: generatedRoutes });

  return { app, router, pinia };
}

initializeApp().catch(console.error);
