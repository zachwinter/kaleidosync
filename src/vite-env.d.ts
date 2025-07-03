/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module "*.json" {
  const value: any;
  export default value;
}
