import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({ plugins: [react(), VitePWA({ registerType: 'autoUpdate', includeAssets: [], manifest: { name: 'Cotuí Express', short_name: 'Cotuí Express', description: 'Viajes y envíos desde Cotuí', theme_color: '#0b6b4b', background_color: '#f5f7f6', display: 'standalone', start_url: '/', icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] } })] });
