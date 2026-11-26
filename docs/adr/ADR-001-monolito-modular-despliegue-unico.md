# ADR-001: Despliegue de monolito modular contenerizado en una sola instancia EC2 en vez de microservicios distribuidos

- **Estado:** Aceptado · 25-nov-2026
- **Contexto:** Equipo de desarrollo académico con un solo dominio de negocio (**EventoYa**: gestión y venta de boletería para eventos) y presupuesto objetivo de **<= 25 USD/mes** en AWS (RNF-07).
- **Decisión:** Desplegar una aplicación modular en contenedores Docker (`Nginx`, réplicas `api1` y `api2` en Node.js/Express, `Redis 7` y `PostgreSQL 15`) dentro de una única instancia EC2 (`t3.micro` en la práctica de despliegue) orquestada con Docker Compose y redes internas aisladas.
- **Alternativas descartadas:**
  - **Microservicios distribuidos en múltiples instancias/ECS:** Requiere múltiples despliegues independientes, balanceadores administrados y subredes adicionales; rompe el RNF-07 de presupuesto mensual y aumenta la complejidad operativa.
  - **Arquitectura Serverless (AWS Lambda + API Gateway):** Presenta arranques en frío (*cold starts*) durante picos repentinos de apertura de boletería, afectando la latencia objetivo (RNF-01).
- **Criterio:** RNF-07 (costo mensual <= 25 USD/mes) y RNF-01 (latencia p95 < 300 ms).
- **Consecuencias aceptadas:** Un fallo crítico a nivel de la instancia EC2 o un despliegue defectuoso afecta simultáneamente a todos los contenedores del nodo.
- **Reversión:** Si el tráfico sostenido supera los 1.000 usuarios concurrentes o la latencia p95 > 300 ms con la instancia al 80 % de CPU/RAM, se migrará la base de datos a Amazon RDS y las instancias de API a un grupo de autoescalado.