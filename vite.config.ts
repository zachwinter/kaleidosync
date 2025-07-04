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
  return {
    ...baseConfig,
    optimizeDeps: {
      ...baseConfig.optimizeDeps,
      include: [...(baseConfig.optimizeDeps?.include || []), "dayjs", "dayjs/locale/en", "dayjs/esm/locale/en"]
    }
  };
});
