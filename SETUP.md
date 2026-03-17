# Server Admin Setup

## 1. Variables de entorno

Copia `.env.example` a `.env` y completa:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_NAME=Administrador Paris
ADMIN_EMAIL=admin@parisboutique.com
ADMIN_PASSWORD=Admin123*
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Crear datos iniciales

```bash
npm run seed
```

## 4. Levantar servidor

```bash
npm run dev
```

## Endpoints principales

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET/POST/PUT/DELETE /api/products`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/orders`
- `GET/POST/PUT/DELETE /api/suppliers`
- `GET/POST/PUT/DELETE /api/sales`
- `GET/POST/PUT/DELETE /api/reports`
- `GET/POST/PUT/DELETE /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET/PUT /api/settings`

## Cloudinary

- Los productos aceptan hasta 3 imágenes por `multipart/form-data`
- Configuración acepta un `logo`
