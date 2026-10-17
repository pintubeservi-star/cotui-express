/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Aquí puedes declarar tus variables personalizadas, por ejemplo:
  // readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
