import { defineConfig } from "vite";
import { createSageConfig } from "@wearesage/vue/vite";
import { config } from "dotenv";

config();

// Pure magic - one function call!
export default defineConfig(() => createSageConfig({
  router: true,
  apiProxy: {
    target: process.env.VITE_API_BASE_URL || "http://localhost:2223",
  }
}));
