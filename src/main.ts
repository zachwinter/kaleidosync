import { createApp } from "@wearesage/vue";
import * as generatedRoutes from "./routes.generated";
import App from "./App.vue";

createApp(App, { routes: generatedRoutes });
