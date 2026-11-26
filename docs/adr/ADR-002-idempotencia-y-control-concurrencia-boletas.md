# ADR-002: Control de concurrencia y prevención de sobreventa mediante llave de idempotencia en Redis y restricción única en PostgreSQL

- **Estado:** Aceptado · 25-nov-2026
- **Contexto:** En **EventoYa**, durante la apertura de venta de un evento de alta demanda, múltiples usuarios (o reintentos de red de un mismo cliente) pueden intentar reservar la misma boleta o ejecutar el mismo pago al mismo milisegundo (RNF-04).
- **Decisión:** Implementar una **llave de idempotencia (`Idempotency-Key`) en Redis con TTL** para evitar procesar dos veces la misma solicitud de compra, respaldada por una **restricción `UNIQUE` y transacciones ACID en PostgreSQL** sobre el asiento o cupo reservado.
- **Alternativas descartadas:**
  - **Fila virtual externa administrada (SQS / Waiting Room):** Añade infraestructura adicional, costos extra y mayor complejidad en el cliente para gestionar turnos antes de entrar al flujo de compra.
  - **Escalar horizontalmente sin control de bloqueo a nivel de datos:** Aumentar réplicas de la API sin idempotencia ni restricciones únicas multiplica las condiciones de carrera (*race conditions*) y provoca sobreventa de boletas.
- **Criterio:** RNF-04 (integridad transaccional: 0 % de boletas duplicadas o sobrevendidas) y RNF-01 (tiempo de respuesta p95 < 300 ms).
- **Consecuencias aceptadas:** Se requiere que el cliente envíe un identificador único por intento de transacción y que Redis esté disponible para validar llaves activas; en el prototipo actual de `src/index.js` queda pendiente conectar la persistencia definitiva con PostgreSQL y validación de llave en Redis.
- **Reversión:** Si los eventos superan los 5.000 compradores simultáneos en el primer minuto, se antepondrá una cola de mensajes (Amazon SQS) con trabajadores asíncronos para drenar las órdenes de compra.