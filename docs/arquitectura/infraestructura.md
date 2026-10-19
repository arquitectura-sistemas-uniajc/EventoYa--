# Definición de Infraestructura y Nube - Proyecto EventoYa

## 1. Proveedor de Nube y Modelo de Servicio
* **Proveedor:** Amazon Web Services (AWS).
* **Modelo de Servicio:** Infraestructura como Servicio (IaaS)[cite: 2].
* **Justificación:** Se utilizarán instancias de máquinas virtuales (EC2) para mantener un control adecuado sobre el entorno de ejecución del servidor backend, puertos, parches y configuraciones de red, optimizando los recursos de la capa gratuita[cite: 2].

## 2. Región y Latencia
* **Región Principal:** Norte de Virginia (`us-east-1`)[cite: 2].
* **Justificación de Latencia:** Basado en las pruebas de latencia por red desde Colombia, la región `us-east-1` ofrece la respuesta más rápida (~117 ms) en comparación con otras regiones de Latinoamérica o Europa, garantizando mejor tiempo de respuesta para los usuarios finales[cite: 2].

## 3. Seguridad y Control de Acceso
* **Gestión de Identidad (IAM):** Aplicación del principio del mínimo privilegio para los integrantes del equipo (Daniel Imbachi, Erick Carmona, Jaider Angulo)[cite: 2].
* **Autenticación:** Uso obligatorio de Autenticación de Doble Factor (MFA) en la cuenta raíz y usuarios IAM[cite: 2].
* **Grupos de Seguridad (Security Groups):** Configuración de reglas estrictas para permitir acceso únicamente por puertos necesarios (HTTP/HTTPS y SSH restringido)[cite: 2].

## 4. Estrategia de Costos y Monitoreo
* Configuración de alertas de presupuesto en el panel de **Billing / Presupuestos** para monitorear el consumo de la capa gratuita[cite: 2].
* Política de apagado y eliminación inmediata de recursos de cómputo y almacenamiento no utilizados al finalizar cada sesión de prueba o laboratorio[cite: 2].