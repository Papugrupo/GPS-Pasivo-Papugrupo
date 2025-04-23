import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { internalIpV4 } from 'internal-ip';

// https://vite.dev/config/
export default defineConfig(async () => {
  const ip = await internalIpV4();
  const devHost = ip || 'localhost'; 

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: devHost,
      port: 5173,
    },
    define: {
      __DEV_IP__: JSON.stringify(`http://${devHost}:5173`),
    },
  };
});
