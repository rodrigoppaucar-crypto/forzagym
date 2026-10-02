# ⚡ FORZAGYM - Sistema Informático de Gestión de Gimnasio (Pallatanga)

> **Software integral, moderno y de alto rendimiento para la administración de ForzaGym en Pallatanga.** Diseñado con una interfaz intuitiva de última generación (Glassmorphism & Neon Sport Theme), listo para ser desplegado en cualquier servidor en línea o utilizado de forma local.

---

## 🚀 Características Principales del Sistema

### 1. 📊 Dashboard Ejecutivo & Analíticas en Tiempo Real
- Métricas clave en vivo: **Socios Activos**, **Ingresos del Mes**, **Asistencias Hoy**, **Membresías por Vencer** y **Caja Actual**.
- Gráficos interactivos de ingresos mensuales (Membresías vs. Tienda POS).
- Gráfico de **Horas Pico** de afluencia para optimizar el personal.
- Monitor de **Aforo en Tiempo Real** con barra dinámica de capacidad.
- Reloj digital en vivo con sincronización por segundo.

### 2. 🪪 Control de Acceso & Torniquete Virtual
- **Escáner QR interactivo** y búsqueda rápida por Cédula / DNI / ID de socio.
- **Validación automática**:
  - 🟢 **Acceso Permitido**: Mensaje de bienvenida, foto del socio, plan activo y sonido sintetizado de confirmación.
  - 🔴 **Acceso Denegado**: Alerta visual y sonora con el motivo exacto (*Membresía vencida*, *Pago pendiente* o *Estado congelado*).
- Log de accesos en tiempo real con registro de fecha, hora y método.
- Exportación del historial de asistencias a **formato CSV / Excel**.

### 3. 👥 Gestión Integral de Socios & Clientes
- Registro completo de socios con foto de perfil, datos personales, teléfono, WhatsApp, contacto de emergencia y observaciones médicas.
- Asignación de plan de membresía y entrenador personal.
- Generación automática de **Pase Digital / Credencial con Código QR único**.
- Impresión en 1 clic de carnet de socio en formato tarjeta.
- Renovación rápida de membresías con cálculo automático de nuevas fechas de vencimiento.
- Filtros por estado (*Todos, Activos, Vencidos, Congelados*).

### 4. 💳 Planes, Membresías & Promociones
- Catálogo de planes: Pase Diario VIP, Plan Mensual Estándar, Plan Mensual PRO + Clases, Plan Trimestral Forza, Plan Anual Elite Black.
- Configuración de tarifas, duración en días y beneficios incluidos.
- Creación de pases de visita sin vencimiento con código único reutilizable para cobros en caja.

### 5. 🛒 Punto de Venta (POS) & Control de Tienda / Suplementos
- Catálogo táctil con categorías: **Suplementos**, **Bebidas**, **Snacks**, **Accesorios & Ropa**.
- Carrito de compras interactivo con cálculo automático de subtotal, IVA y total.
- Control de inventario y stock mínimo.
- Múltiples métodos de pago: Efectivo, Tarjeta de Débito, Crédito, Transferencia.
- Cobro de visitas puntuales por código del plan; registra cada ingreso como una venta sin crear un socio.
- **Generador e impresión de Ticket Térmico (80mm)** con datos fiscales del gimnasio.

### 6. 📅 Clases Grupales & Calendario Semanal
- Cronograma semanal interactivo (Spinning, CrossFit, Yoga, Boxeo, HIIT, etc.).
- Control de cupos máximos y plazas libres en tiempo real.
- Reserva instantánea de cupos para socios.

### 7. 🏋️ Rutinas de Entrenamiento & Fichas Antropométricas
- Visualizador de planes de entrenamiento organizados por días (Series, Repeticiones, Descansos y notas del Coach).
- Registro antropométrico: Peso (kg), % Grasa Corporal, Masa Muscular, Pecho, Brazo, Cintura y Cadera.
- Historial de evolución física por socio.

### 8. 💰 Caja Chica, Finanzas & Arqueos
- Control de ingresos por membresías y ventas de tienda.
- Registro de egresos y gastos operativos (Mantenimiento de máquinas, insumos, servicios, comisiones).
- Balance neto en tiempo real y monto en efectivo disponible en gaveta.
- Exportación de ventas a CSV.

### 9. 📱 Portal del Socio (Self-Service)
- Vista especializada para el socio (móvil o tablet).
- Carnet virtual con código QR para ingreso al gimnasio.
- Check-list interactivo de la rutina del día para marcar ejercicios completados durante el entrenamiento.

### 10. ⚙️ Configuración & Respaldos (Backup)
- Personalización de Nombre del Gimnasio, RUC/NIT, Slogan, Teléfono, Dirección, Moneda y Tasa de IVA.
- Tres interfaces predefinidas: Forza Pro (recomendada), Titanio Oscuro e Impulso Verde.
- Descarga de **Copia de Seguridad completa en JSON**.
- Restauración de copias de seguridad con 1 clic.
- Opción para recargar datos de demostración realistas.

---

## 🌐 Guía de Despliegue en Servidor en Línea

Este sistema está desarrollado en **HTML5, CSS3 y JavaScript Vanilla moderno**, lo que significa que **NO requiere bases de datos pesadas ni configuraciones complejas de Node/Python/PHP**. Funciona de inmediato en cualquier servidor web del mundo.

### Opción A: Hosting Tradicional (cPanel / Hostinger / GoDaddy / Apache / Nginx)
1. Comprime todos los archivos del proyecto en un archivo `.zip`.
2. Ingresa al **Administrador de Archivos** de tu hosting (o conecta por FTP/SFTP).
3. Sube y extrae el contenido dentro de la carpeta pública (`public_html` o `www`).
4. ¡Listo! Accede a tu dominio (ej: `https://tugimnasio.com`) y el sistema estará 100% operativo.

### Opción B: Despliegue Gratuito en la Nube (Vercel / Netlify / Cloudflare Pages / GitHub Pages)
- **Vercel**: Conecta el repositorio de GitHub o arrastra la carpeta a la consola de Vercel. Ya incluye el archivo `vercel.json` preconfigurado.
- **Netlify**: Arrastra la carpeta del proyecto a la sección *Sites* de Netlify.
- **GitHub Pages**: Sube el código a un repositorio en GitHub y activa *Pages* desde la rama `main`.

### Opción C: Uso Local en Recepción (Sin Servidor)
- Simplemente haz doble clic en el archivo `index.html` en el navegador de la computadora de recepción (Google Chrome, Edge, Firefox, Safari).

---

## 📁 Estructura del Proyecto

```
PROYECTO GIMNASIO/
│
├── index.html              # Aplicación principal Single Page Application (SPA)
├── .htaccess               # Configuración para servidores Apache/cPanel (GZIP + Rutas)
├── vercel.json             # Configuración para despliegue en Vercel
├── README.md               # Documentación y manual del sistema
│
├── css/
│   └── style.css           # Sistema de diseño, Glassmorphism, variables CSS y temas
│
└── js/
    ├── db.js               # Motor de base de datos local + Datos iniciales + CRUD
    ├── audio.js            # Motor de efectos de sonido Web Audio API (Torniquete, Beeps, Caja)
    ├── qr.js               # Generador de Códigos QR para credenciales digitales
    ├── pdf-ticket.js       # Impresión de tickets térmicos 80mm y carnets de socios
    ├── charts.js           # Gráficos estadísticos interactivos en Canvas
    └── app.js              # Controlador principal, lógica de negocio y navegación
```

---

## 🛠️ Tecnologías Utilizadas
- **HTML5 Semántico**: Accesibilidad, estructura modular y soporte para dispositivos móviles.
- **CSS3 Moderno**: Variables CSS, Glassmorphism, Flexbox, CSS Grid y animaciones fluidas.
- **JavaScript (ES6+)**: Lógica desacoplada y reactiva sin dependencias externas obligatorias.
- **Web Audio API**: Efectos sonoros sintetizados para validación de accesos en recepción.
- **Canvas API**: Renderizado nítido de gráficos de rendimiento y códigos QR.
- **LocalStorage API**: Persistencia de datos inmediata y segura.

---

Desarrollado con ❤️ para llevar la administración y experiencia fitness al siguiente nivel.
