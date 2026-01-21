🏗️ 1. FILOSOFÍA VISUAL: "TECHNICAL MINIMALISM"

El diseño debe transmitir Autoridad Técnica, Eficiencia Energética y Confianza.

Layout: Basado en Bento Grids (rejillas modulares) para organizar datos complejos (calculadoras, gráficas, specs técnicos).

Espaciado: Uso generoso de padding y gap (mínimo gap-6 en grids) para evitar la fatiga visual.

Bordes: Estética suave con rounded-2xl (16px) o rounded-3xl (24px) para contenedores principales.

🎨 2. PALETA DE COLORES (SISTEMA DE DISEÑO)

Utilizar variables de Tailwind CSS con los siguientes tonos:

Primary (Energy Gold): #FACC15 (Yellow-400) - Para botones de acción principal (CTA) y acentos de "energía".

Secondary (Deep Trust): #0F172A (Slate-900) - Para fondos principales y navegación. Transmite profesionalidad.

Accent (Clean Green): #22C55E (Green-500) - Exclusivamente para indicadores de ahorro y beneficios ecológicos.

Surface (Glass): rgba(255, 255, 255, 0.05) con backdrop-blur-md. Para tarjetas sobre fondos oscuros.

✍️ 3. TIPOGRAFÍA

Titulares: Sans-serif moderna y geométrica (ej. Inter o Geist). font-bold con tracking-tight.

Cuerpo: Sans-serif de alta legibilidad. Tamaño base text-base (16px).

Datos Numéricos: Usar una fuente monoespaciada o de ancho fijo para los resultados de la calculadora de ahorro.

🧩 4. COMPONENTES CLAVE

A. Tarjetas de Producto (Kits Solares)

Fondo: bg-slate-800/50 con borde sutil border-white/10.

Efecto: hover:scale-[1.02] y transition-all.

Contenido: Imagen técnica en la parte superior, título en text-xl, y un "Badge" destacando el ahorro anual.

B. Calculadora Interactiva

Inputs: Sliders modernos y campos numéricos limpios.

Visualización: Gráficos de barras simples (SVG) que muestren la comparativa "Antes vs. Después de la Instalación".

Feedback: Micro-interacciones (framer-motion) al cambiar los valores.

C. Botones (CTAs)

Principal: Fondo amarillo, texto negro, sombra pesada al hacer hover.

Secundario: Outline blanco con efecto de transparencia.

🛠️ 5. REGLAS TÉCNICAS DE IMPLEMENTACIÓN

Iconos: Usar exclusivamente lucide-react. Grosor de línea strokeWidth={1.5}.

Imágenes: Si no hay imagen real, generar un contenedor con un gradiente lineal sutil y un icono centrado.

Responsive: Diseño "Mobile First". En móviles, los Bento Grids pasan de 3 columnas a 1 columna vertical.

Sombras: Evitar negros puros. Usar sombras con el color del fondo (ej. shadow-slate-950/50).

Nota para el Agente: Prioriza siempre la claridad sobre la decoración. Cada elemento visual debe ayudar al usuario a entender su ahorro potencial.