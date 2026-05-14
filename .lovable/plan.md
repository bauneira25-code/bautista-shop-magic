## Resumen

Construyo un panel admin nuevo en `/admin-panel` con sidebar lateral estilo SaaS. Las 4 secciones core (Dashboard, Pedidos, Personalizados, Producción) quedan funcionando real contra Supabase. Las otras 10 quedan navegables con un placeholder limpio "En construcción — fase 2". El `/admin/machine` actual queda intacto como pantalla de tablet.

## 1. Base de datos (migración única)

Tablas nuevas y extensiones a las existentes:

- `app_role` enum: `admin`, `operations`, `production`, `support`, `finance`
- `user_roles` (user_id, role) — patrón seguro recomendado, con función `has_role()` SECURITY DEFINER
- `profiles` (user_id, full_name, email) + trigger auto-create on signup
- Extender `orders`: nuevo enum con los 16 estados pedidos (`pedido_creado`, `pago_pendiente`, `pago_confirmado`, `pendiente_personalizacion`, `diseno_aprobado`, `cola_produccion`, `en_produccion`, `personalizado_terminado`, `control_calidad`, `listo_empaquetar`, `empaquetado`, `enviado`, `entregado`, `rehacer`, `cancelado`, `reembolsado`); columnas `assigned_to uuid`, `final_photo_url`, `internal_notes`
- `order_status_history` ya existe — agregar columna `changed_by_user_id`
- Storage bucket `qc-photos` (público) para fotos finales del operario
- RLS: solo usuarios con rol en `user_roles` pueden leer/escribir las tablas de admin

## 2. Auth y guard

- Habilitar email/password en Supabase (sin auto-confirm, según reglas)
- Ruta `/admin-login` con login email+password
- Layout protegido `_admin/` (TanStack pathless layout) con `beforeLoad` que valida sesión + `has_role()`. Redirige a `/admin-login` si falla
- Hook `useAdminAuth()` que expone user, role, hasRole

## 3. Shell del panel (`src/routes/_admin.tsx`)

- Sidebar fijo izquierdo, 14 items con íconos (lucide), item activo marcado, colapsable a iconos en mobile
- Header con: nombre del usuario, rol, botón logout
- Dark mode elegante por default en panel admin (usando tokens existentes)
- `<Outlet />` para las páginas hijas

## 4. Secciones REALES (fase 1)

### Dashboard `/_admin/`
KPI cards (ventas día, ingresos mes, pedidos pendientes, en producción, personalizados pendientes, listos empaquetar, reclamos abiertos, grupos activos, stock bajo, ticket promedio). Gráfico de ventas últimos 14 días + pedidos por estado (recharts).

### Pedidos `/_admin/pedidos`
Tabla con filtros por estado (chips), búsqueda por cliente. Modal de detalle con: cliente, producto, personalización, historial completo, notas internas editables, cambio manual de estado.

### Personalizados `/_admin/personalizados`
Tabla solo de pedidos con customization. Estados específicos del workflow de personalización. Modal con preview SVG, archivo descargable, asignar empleado (dropdown de user_roles con rol production), aprobar diseño, enviar a producción, marcar terminado.

### Producción `/_admin/produccion`
Vista cards grandes (no tabla) — pensada para tablet al lado de máquina. Cards con foto/emoji del producto, texto del diseño, botones grandes "Comenzar" / "Terminado" / "Reportar problema". "Comenzar" lockea el trabajo (asigna `assigned_to` al user actual). "Terminado" abre input de subir foto final → bucket `qc-photos` → estado pasa a `control_calidad`.

## 5. Secciones PLACEHOLDER (navegables, fase 2)

10 rutas (`/control-calidad`, `/productos`, `/grupos`, `/clientes`, `/pagos`, `/envios`, `/reclamos`, `/stock`, `/empleados`, `/configuracion`) con un componente compartido `<ComingSoonSection />` que muestra el ícono, título, descripción de qué va a tener y un badge "Fase 2". Sidebar funcional, navegación funcional.

## 6. Setup inicial

Como el primer admin no puede crearse solo, después de la migración te paso el flujo: te registrás en `/admin-login` con email+password, y luego corro un INSERT manual asignándote el rol `admin` para que puedas entrar.

---

## Detalles técnicos

- Server functions con `requireSupabaseAuth` para cada query/mutation del admin (RLS aplicada como el user)
- Middleware de roles: server fn helper `requireRole(['admin','operations'])` que valida `has_role()` en server
- Realtime en Producción y Personalizados (igual que `/admin/machine`)
- Convivencia con tablas actuales: el enum `order_status` existente se reemplaza con `ALTER TYPE ... ADD VALUE` para no romper código actual; se mantienen los 7 estados viejos como sinónimos válidos
- `/admin` y `/admin/machine` viejos quedan intactos (no se tocan)
- Diseño: tokens existentes de `src/styles.css`, sidebar inspirado en Stripe/Linear

---

## Lo que NO entra en esta tanda
Control de calidad como sección dedicada con checklist, productos CRUD, grupos admin, clientes, pagos integrados con MP, envíos con tracking, reclamos, stock con SKUs, empleados CRUD, configuración general. Todo eso queda como placeholder navegable y lo construimos en tandas siguientes.
