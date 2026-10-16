# Cotuí Express — PWA para viajes y envíos

Aplicación web progresiva (React + TypeScript + Vite) enfocada en Cotuí, Sánchez Ramírez, República Dominicana.

## Incluye este MVP
- Interfaz adaptable a móvil y escritorio e instalable como PWA.
- Solicitudes de viajes y envíos con código de seguimiento.
- Consulta de estado mediante una función SQL.
- Panel administrativo con autenticación de Supabase y actualización de estados.
- Modo demostración local con `localStorage` si Supabase no está configurado.
- Esquema SQL inicial con Row Level Security (RLS).

## Ejecutar localmente
Requiere Node.js 20.19+ y npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sin configurar Supabase, las solicitudes se guardan únicamente en ese navegador/dispositivo. No es almacenamiento compartido.

## Configurar Supabase
1. Crea un proyecto en https://supabase.com/dashboard.
2. En SQL Editor, ejecuta todo el contenido de `supabase/schema.sql`.
3. En Project Settings / Connect, copia la URL del proyecto y la clave publicable.
4. Añade esos valores a `.env.local` como `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. En Authentication, crea el usuario administrador. Copia su UUID y sigue la instrucción comentada al final de `supabase/schema.sql` para asignar el rol admin.
6. Reinicia `npm run dev`.

**Nunca incluyas una clave `service_role` en variables `VITE_*` ni en el navegador.** Usa la clave publicable y las políticas RLS.

## Subir al repositorio GitHub
Repositorio previsto: https://github.com/pintubeservi-star/cotui-express

Descomprime el proyecto y abre una terminal dentro de la carpeta `cotui-express`:

```bash
git init
git add .
git commit -m "Initial Cotuí Express PWA"
git branch -M main
git remote add origin https://github.com/pintubeservi-star/cotui-express.git
git push -u origin main
```

Si `origin` ya existe, usa `git remote set-url origin https://github.com/pintubeservi-star/cotui-express.git` en lugar de `git remote add origin`.

## Publicar con Vercel
1. Entra en https://vercel.com/ y conecta GitHub.
2. Importa `pintubeservi-star/cotui-express` después de subir el código.
3. Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en Environment Variables.
4. Despliega. Configura las URL permitidas en Supabase Authentication si usarás redirecciones de autenticación.

## Antes de producción
- Verificar tarifas, horarios, rutas y operadores reales; los datos incluidos son ejemplos, no disponibilidad confirmada.
- Añadir protección antispam y límites de solicitudes, preferiblemente del lado del servidor.
- Revisar la exposición de datos personales y probar todas las políticas RLS con usuarios anónimos y administradores.
- Añadir política de privacidad, términos, contacto de soporte y procedimientos operativos.
- Probar el flujo completo de solicitudes, seguimiento, acceso administrativo, instalación PWA y modo sin conexión.
