# Requerimientos No Funcionales (RNF) — EventoYa

A continuación se definen los **8 Requerimientos No Funcionales medibles** del sistema **EventoYa**, especificando su métrica, umbral objetivo, condición de carga y mecanismo de verificación.

| ID | Atributo | Métrica | Umbral | Condición de carga | Cómo se verifica |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **RNF-01** | **Rendimiento** | Latencia percentil 95 ($p95$) | $< 300\text{ ms}$ | 200 usuarios concurrentes consultando `GET /api/eventos` en apertura de boletería | Prueba de carga con `k6` / `autocannon` |
| **RNF-02** | **Disponibilidad** | Tiempo en servicio (*Uptime*) | $\ge 99.5\%$ mensual | Horario de operación comercial (06:00 a 23:00) | Monitoreo periódico cada minuto sobre `GET /health` (`200 OK`) |
| **RNF-03** | **Seguridad de Red** | Puertos internos expuestos a Internet | $0$ puertos internos abiertos | Escaneo externo desde Internet hacia la IP pública del servidor | Verificación de *Security Groups* en AWS y escaneo de puertos (`3000`, `5432`, `6379` cerrados) |
| **RNF-04** | **Integridad Transaccional** | Porcentaje de boletas duplicadas o sobrevendidas | $0\%$ ($0$ duplicados) | 100 peticiones simultáneas de compra sobre el mismo cupo/asiento | Pruebas de concurrencia validando `Idempotency-Key` en Redis y restricción `UNIQUE` en PostgreSQL |
| **RNF-05** | **Escalabilidad Horizontal** | Balanceo de peticiones entre réplicas de API | Distribución $\approx 50\% / 50\%$ sin errores `5xx` | Tráfico sostenido de 200 peticiones/segundo a través del proxy inverso | Logs de `eventoya_proxy` (Nginx) repartiendo carga entre `eventoya_api_1` y `eventoya_api_2` |
| **RNF-06** | **Observabilidad** | Tiempo de detección de caída de servicio | $\le 60\text{ segundos}$ | Caída simulada de una instancia de API (`docker stop eventoya_api_1`) | Consulta automatizada a `/health` y revisión de logs de contenedores (`docker compose logs`) |
| **RNF-07** | **Costo Operativo** | Gasto mensual estimado en AWS | $\le 25\text{ USD/mes}$ | Operación continua del entorno productivo mínimo (720 horas/mes en `us-east-1`) | Estimación en *AWS Pricing Calculator* (`Estimacion_Costos_AWS_EventoYa_G03.pdf`) y consola de facturación |
| **RNF-08** | **Recuperación ante Fallos** | Tiempo objetivo de recuperación ($RTO$) y punto de recuperación ($RPO$) | $RTO \le 1\text{ h}$ / $RPO \le 24\text{ h}$ | Pérdida o corrupción de la instancia EC2 o del contenedor de base de datos | Restauración de respaldo diario (`pg_dump`) sobre volumen `postgres_data` y redespliegue con `docker compose up -d` |