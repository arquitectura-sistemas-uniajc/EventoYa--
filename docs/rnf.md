# Requerimientos No Funcionales (RNF) — EventoYa

A continuación se definen los **8 Requerimientos No Funcionales medibles** del sistema **EventoYa**, especificando su métrica, umbral objetivo, condición de carga y mecanismo de verificación.

| ID | Atributo | Métrica | Umbral | Condición de carga | Cómo se verifica |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RNF-01** | **Rendimiento** | Latencia percentil 95 (p95) | < 300 ms | 200 usuarios concurrentes consultando `GET /api/eventos` en apertura de boletería | Prueba de carga con `k6` o `autocannon` |
| **RNF-02** | **Disponibilidad** | Tiempo en servicio (Uptime) | >= 99.5% mensual | Horario de operación comercial (06:00 a 23:00) | Monitoreo periódico cada minuto sobre `GET /health` (respuesta `200 OK`) |
| **RNF-03** | **Seguridad de Red** | Puertos internos expuestos a Internet | 0 puertos internos abiertos | Escaneo externo desde Internet hacia la IP pública del servidor | Verificación de *Security Groups* en AWS y validación de puertos (`3000`, `5432`, `6379` no expuestos) |
| **RNF-04** | **Integridad Transaccional** | Porcentaje de boletas duplicadas o sobrevendidas | 0% (0 duplicados) | 100 peticiones simultáneas de compra sobre el mismo cupo o asiento | Pruebas de concurrencia validando `Idempotency-Key` en Redis y restricción `UNIQUE` en PostgreSQL |
| **RNF-05** | **Enrutamiento y Proxy** | Tasa de peticiones exitosas a través del proxy inverso | >= 99% respuestas válidas sin errores 5xx | Tráfico sostenido de 200 peticiones/segundo hacia los endpoints de consulta | Revisión de logs de `eventoya_proxy` (Nginx) y métricas de respuesta HTTP |
| **RNF-06** | **Observabilidad** | Tiempo de detección y recuperación de contenedor | <= 60 segundos | Detención o fallo simulado de un contenedor (`docker stop`) con política de reinicio | Consulta automatizada a `/health`, estado de contenedores (`docker compose ps`) y `docker compose logs` |
| **RNF-07** | **Costo Operativo** | Gasto mensual estimado en AWS | <= 25 USD/mes | Operación del entorno productivo mínimo en `us-east-2` / `us-east-1` | Estimación en *AWS Pricing Calculator* (`Estimacion_Costos_AWS_EventoYa_G03.pdf`) y consola de facturación |
| **RNF-08** | **Recuperación ante Fallos** | Tiempo objetivo de recuperación (RTO) y punto de recuperación (RPO) | RTO <= 1 h / RPO <= 24 h | Pérdida o corrupción de la instancia EC2 o del volumen de base de datos | Restauración de respaldo (`pg_dump`) sobre volumen de PostgreSQL y levantamiento con `docker compose up -d` |