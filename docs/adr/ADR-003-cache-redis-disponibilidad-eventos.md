# ADR-003: Uso de caché en memoria con Redis 7 para consulta de catálogo y disponibilidad de eventos

* **Estado:** Aceptado · 25-nov-2026
* **Contexto:** Las consultas de listado de eventos y cupos disponibles representan más del 80 % del tráfico de lectura de **EventoYa**, generando contención en PostgreSQL durante picos de tráfico (RNF-01 y RNF-05).
* **Decisión:** Incorporar **Redis 7 (`eventoya_cache`)** en la red interna privada (`backend_net`, puerto `6379`) bajo el patrón *Cache-Aside* con expiración (TTL) corta de 30 segundos e invalidación al confirmar una compra.
* **Alternativas descartadas:**
  * **Consultar directamente PostgreSQL en cada petición:** Satura las conexiones de la base de datos bajo 200 usuarios concurrentes y degrada la latencia por encima de 300 ms.
  * **Réplica de lectura de PostgreSQL en AWS:** Duplica el costo de almacenamiento y cómputo de base de datos, superando el presupuesto mensual definido (RNF-07).
* **Criterio:** RNF-01 (latencia $p95 < 300\text{ ms}$ con 200 usuarios concurrentes) y RNF-07 (costo $\le 25\text{ USD/mes}$).
* **Consecuencias aceptadas:** Puede existir una ventana máxima de hasta 30 segundos de inconsistencia eventual en el contador visual del catálogo si falla la invalidación explícita.
* **Reversión:** Si el conjunto de datos en caché supera la memoria asignada al contenedor en la instancia EC2 o el porcentaje de aciertos (*cache hit ratio*) cae por debajo del 60 %, se ajustarán las políticas de evicción (`allkeys-lru`) o se migrará a Amazon ElastiCache.