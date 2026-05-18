# Panel Admin NEIBA — Funcional y Real

Convertir el panel admin en una herramienta de gestión real conectada a Supabase, manteniendo el estilo actual (blanco + naranja rojizo, minimalista).

## 1. Base de datos (Supabase)

Nuevas tablas y cambios vía migración:

**`products`** (catálogo gestionable)
- name, description, price_individual, price_wholesale
- category (enum: tecnologia, electrodomesticos, hogar, joyeria, moda)
- is_customizable (bool), customization_type (enum: laser, uv, sublimacion, bordado, estampado, null)
- stock, location (texto: "A1", "Joyería-2")
- is_active (bool), badges (array: destacado, viral, nuevo, stock_bajo)
- emoji, gradient (mantener compatibilidad visual)
- slug (único, autogenerado)

**`product_media`**
- product_id (FK), url, type (image/video), sort_order

**`live_cameras`**
- name, machine (laser/uv/sublimacion/empaquetado)
- video_url, thumbnail_url, is_active, sort_order

**`orders`** — agregar columnas:
- production_photo_url, production_video_url ya existen parcialmente (`final_photo_url`); agregar `production_started_at`, `production_finished_at`
- Ampliar enum `order_status` con los nuevos estados pedidos (pedido_recibido, picking, en_personalizacion, control_calidad, empaquetado, enviado, entregado)

**Storage buckets nuevos:**
- `product-media` (público) — imágenes/videos de productos
- `live-videos` (público) — videos de demostración para En Vivo
- `production-files` ya existe — se reutiliza para fotos/videos del resultado

**RLS:**
- Lectura pública en products, product_media, live_cameras (catálogo público)
- Escritura solo para usuarios con rol admin/operations/production según corresponda
- Storage: lectura pública; escritura con rol staff

## 2. Admin → Productos (`/admin-panel/productos`)

Reemplaza el placeholder actual. Lista todos los productos con filtros (categoría, activo, personalizable). Botón "Nuevo producto" abre formulario completo:

- Nombre, descripción, precios (individual/mayorista)
- Categoría (select)
- Toggle personalizable + select tipo personalización
- Stock + ubicación física
- Toggle activo
- Multi-select badges (destacado/viral/nuevo/stock_bajo)
- Uploader múltiple de imágenes y videos (subida a bucket `product-media`)
- Preview en vivo del producto

Editar producto reutiliza el mismo formulario. Eliminar con confirmación.

## 3. Admin → Pedidos (`/admin-panel/pedidos`)

Mejorar la vista existente:
- Orden cronológico (más reciente primero) con filtros por estado
- Card por pedido: cliente, teléfono, productos, badge "personalizable", monto
- Selector de estado con los 7 estados nuevos
- Detalle expandible con timeline de `order_status_history`

## 4. Admin → Producción (`/admin-panel/produccion`)

Vista enfocada al operario:
- Solo pedidos con `is_customized=true` en estados pre-producción
- Cada card muestra: cliente, producto, máquina detectada (función `machineForProduct` ya existe), preview del diseño (SVG de `customizations`)
- Botón **Iniciar producción** → estado `en_produccion`, registra `production_started_at`
- Mientras está en producción: uploader para foto/video del resultado (bucket `production-files`)
- Botón **Finalizar producción** → estado `personalizado_terminado`, registra `production_finished_at`

## 5. Admin → En Vivo (`/admin-panel/en-vivo`)

Gestión de cámaras de la sección pública /en-vivo:
- Lista de cámaras existentes con preview de thumbnail
- Crear cámara: nombre, máquina asignada, upload de video demo, upload de thumbnail, toggle activo
- Editar/eliminar cámara
- Reordenar (sort_order)

La página pública `/en-vivo` pasa a leer `live_cameras` desde Supabase (en vez del array hardcoded `LIVE_MACHINES`), con fallback a las 3 máquinas por defecto si no hay datos.

## 6. Frontend público

- `/index`, `/personalizables`, `/ofertas`, `/categorias/*` leen productos desde Supabase en vez de `MOCK_PRODUCTS` (mantener `MOCK_PRODUCTS` como seed inicial)
- `/en-vivo` y `/en-vivo/$machineId` leen `live_cameras`

## 7. Seed inicial

Migración inserta los productos actuales de `MOCK_PRODUCTS` en la tabla `products`, y las 3 máquinas de `LIVE_MACHINES` en `live_cameras`, para no romper la experiencia actual.

## Diseño

Mantener exactamente el estilo actual del admin (dark sidebar + acentos naranja `#ff6b35`) y el del frontend público (blanco + naranja rojizo, minimalista). Formularios usando shadcn/ui ya instalado. Uploads con preview y barra de progreso.

## Detalles técnicos

- Migración única con todas las tablas, enums, RLS y seed
- Buckets de storage creados en la misma migración
- Subidas hechas desde el cliente con el `supabase` client del navegador, autenticado con rol admin (RLS valida)
- Realtime ya configurado en `orders`; agregar a `products` y `live_cameras` para reflejar cambios en vivo
- Toda la lógica nueva en frontend (componentes admin) — sin server functions adicionales

## Fuera de scope (lo decimos para ser claros)

- No se agregan reportes nuevos al panel (Análisis, Stock ya existen y siguen funcionando con datos reales)
- No se cambia el flujo de checkout ni el carrito
- No se agrega bordado/estampado como máquinas en /en-vivo más allá del select de personalización (las máquinas en vivo siguen siendo láser/UV/sublimación + empaquetado opcional)
