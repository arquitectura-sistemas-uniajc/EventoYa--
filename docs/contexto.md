# Contexto del Negocio y Problemática - EventoYa

## 1. ¿Qué duele hoy al cliente?
El colapso total de la plataforma en los primeros 60 segundos de salida a venta de un evento masivo. Actualmente, 5.000 personas intentan adquirir 500 boletas simultáneamente, lo que ocasiona caídas del servidor, transacciones duplicadas por recarga de página y sobreventa de boletería.

## 2. ¿Quién sufre este dolor?
* **Compradores:** Sufren lentitud extrema, errores al procesar el pago y la pérdida del turno de compra tras hacer fila.
* **Organizadores del evento:** Pierden ingresos por transacciones fallidas, sufren problemas de reputación y enfrentan reclamos legales por sobreventa.
* **Personal de control de acceso:** Sufren congestión en la entrada al evento si se generan códigos de boleta duplicados o no validados.

## 3. ¿Qué pasa si el sistema se cae 1 hora durante el pico?
Se pierde el 100% de la ventana crítica de venta inicial, generando pérdidas económicas directas y cobros inconsistentes en las pasarelas de pago. La disponibilidad alta del sistema se debe garantizar de forma reactiva o programada durante esos 60 segundos críticos.