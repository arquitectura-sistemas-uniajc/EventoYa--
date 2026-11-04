# Definición de Infraestructura y Nube - Proyecto EventoYa

## 1. Proveedor de Nube y Modelo de Servicio
- **Proveedor:** Amazon Web Services (AWS).
- **Modelo de Servicio:** Infraestructura como Servicio (IaaS).
- **Justificación:** Se utilizarán instancias de máquinas virtuales (EC2) para mantener un control adecuado sobre el entorno de ejecución del servidor backend, puertos, parches y configuraciones de red, optimizando los recursos de la capa gratuita.

## 2. Región y Latencia
- **Región Principal:** Norte de Virginia (`us-east-1`).
- **Justificación de Latencia:** Basado en las pruebas de latencia por red desde Colombia, la región `us-east-1` ofrece la respuesta más rápida (~117 ms) en comparación con otras regiones de Latinoamérica o Europa, garantizando mejor tiempo de respuesta para los usuarios finales.

## 3. Seguridad y Control de Acceso
- **Gestión de Identidad (IAM):** Aplicación del principio del mínimo privilegio para los integrantes del equipo (Daniel Imbachi, Erick Carmona, Jaider Angulo).
- **Autenticación:** Uso obligatorio de Autenticación de Doble Factor (MFA) en la cuenta raíz y usuarios IAM.
- **Grupos de Seguridad (Security Groups):** Configuración de reglas estrictas para permitir acceso únicamente por puertos necesarios (HTTP/HTTPS y SSH restringido).

## 4. Estrategia de Costos y Monitoreo
- Configuración de alertas de presupuesto en el panel de **Billing / Presupuestos** para monitorear el consumo de la capa gratuita.
- Política de apagado y eliminación inmediata de recursos de cómputo y almacenamiento no utilizados al finalizar cada sesión de prueba o laboratorio.

---

## 5. Hoja de Estimación de Tráfico y Recursos (Taller "Estimar Sin Sistema")

> **Leyenda de marcas:**
> - **D** = Dato (obtenido del briefing o cliente)
> - **C** = Cálculo (derivado de otros números de esta hoja)
> - **S** = Supuesto (asumido por el equipo)

### 5.1 Población de Usuarios (D)
- **Clientes / Asistentes:** 5.000 usuarios registrados (D)
- **Organizadores de eventos:** 50 usuarios registrados (D)
- **Personal de control / Validación:** 20 usuarios registrados (D)

### 5.2 Operaciones al Mes (C)
- **Sesiones por usuario al mes:** 5 sesiones (S)
- **Peticiones por sesión:** 20 peticiones (S)
- **Cálculo de peticiones totales al mes (C):**
  $$5.000 \text{ clientes} \times 5 \text{ sesiones} \times 20 \text{ peticiones} = 500.000 \text{ peticiones al mes (C)}$$

### 5.3 Forma del Pico
- **Forma seleccionada:** Con hora punta / Evento concentrado (S).
- **Razón:** Existen franjas de tiempo específicas (lanzamiento de boletería) donde el tráfico se incrementa fuertemente en comparación con el promedio diario.

### 5.4 Peticiones por Segundo (Pet/s)

#### Promedio Mensual (Dimensiona Almacenamiento y Transferencia)
- **Horas de atención diarias:** 16 horas/día (S)
- **Segundos al mes (C):** $16 \text{ horas} \times 3.600 \text{ s} \times 30 \text{ días} = 1.728.000 \text{ segundos (C)}$
- **Promedio de tráfico (C):**
  $$500.000 \text{ peticiones} \div 1.728.000 \text{ segundos} = 0,29 \text{ pet/s (C)}$$

#### Pico de Tráfico (Dimensiona CPU y Cómputo)
- **Usuarios concurrentes en el pico:** 100 usuarios (S)
- **Tiempo de respuesta objetivo:** 0,5 segundos (S)
- **Tiempo de reflexión del usuario:** 5,0 segundos (S)
- **Cálculo del Pico (C):**
  $$\text{PICO} = \frac{100}{0,5 + 5,0} = 18,18 \text{ pet/s (C)}$$


  https://calculator.aws/#/estimate?id=0b4e4cd3eddfbdd7359171c9cb0071f243050c0e