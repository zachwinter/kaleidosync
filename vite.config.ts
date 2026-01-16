import { defineConfig } from "vite";
import { createSageConfig } from "@wearesage/vue/vite";
import { config } from "dotenv";

config();

// Pure magic - one function call!
export default defineConfig(async () => {
  const baseConfig = await createSageConfig({
    router: true
  });

  // Fix dayjs ES module issue from AppKit - merge configs properly
  // Pre-bundle packages with CommonJS dependencies so Vite converts them to ESM
  return {
    ...baseConfig,
    optimizeDeps: {
      ...baseConfig.optimizeDeps,
      include: [
        ...(baseConfig.optimizeDeps?.include || []).filter(dep => dep !== 'phone'),
        "dayjs",
        "dayjs/locale/en",
        "dayjs/esm/locale/en",
        "socket.io-client",
        "music-metadata"
      ]
    }
  };
});
