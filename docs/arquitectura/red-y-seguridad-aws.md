# Arquitectura de Red, Puertos y Seguridad (AWS & Docker) — EventoYa

## 1. Mapa de Puertos y Exposición de Servicios

Siguiendo el principio de menor privilegio, únicamente el proxy inverso recibe tráfico externo, mientras que los servicios de aplicación y persistencia operan en redes internas aisladas.

| Servicio | Contenedor | Puerto Interno | Puerto Expuesto (Host) | Red Asignada | Acceso |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Proxy Inverso (Nginx)** | `eventoya_proxy` | `80` | `80` | `frontend_net` | Público (HTTP) |
| **API Backend (Instancia 1)** | `eventoya_api_1` | `3000` | Ninguno | `frontend_net`, `backend_net` | Interno (vía Nginx) |
| **API Backend (Instancia 2)** | `eventoya_api_2` | `3000` | Ninguno | `frontend_net`, `backend_net` | Interno (vía Nginx) |
| **Base de Datos (PostgreSQL)** | `eventoya_db` | `5432` | Ninguno | `backend_net` (`internal: true`) | Privado (solo APIs) |
| **Caché (Redis)** | `eventoya_cache` | `6379` | Ninguno | `backend_net` (`internal: true`) | Privado (solo APIs) |

---

## 2. Diseño de Red en AWS (VPC y Subredes)

Para trasladar la topología local de Docker Compose a un entorno de nube en AWS:

* **VPC (Virtual Private Cloud):** Red virtual aislada con bloque CIDR `10.0.0.0/16`.
* **Subred Pública (`10.0.1.0/24`):**
  * Conectada a un **Internet Gateway (IGW)** mediante su tabla de rutas (`0.0.0.0/0 -> igw`).
  * Aloja el punto de entrada (instancia EC2 con Nginx / Balanceador) con IP pública/elástica para atender peticiones de los usuarios.
* **Subred Privada (`10.0.2.0/24`):**
  * Sin ruta directa desde Internet (aislada).
  * Aloja los servicios de datos (PostgreSQL / Redis) y nodos internos de aplicación, comunicándose únicamente con la subred pública.

---

## 3. Reglas de Security Groups (Firewall por Servicio)

### SG-Proxy-Web (Capa Pública)
* **Inbound (Entrada):**
  * `TCP 80` (HTTP) desde `0.0.0.0/0` (tráfico web de clientes).
  * `TCP 443` (HTTPS) desde `0.0.0.0/0` (tráfico seguro).
  * `TCP 22` (SSH) restringido únicamente a la IP pública del administrador (`Mi_IP/32`).
* **Outbound (Salida):**
  * Permitido hacia `SG-Backend-App` en el puerto `3000`.

### SG-Backend-App (Capa de Aplicación)
* **Inbound (Entrada):**
  * `TCP 3000` exclusivamente desde `SG-Proxy-Web`.
* **Outbound (Salida):**
  * Permitido hacia `SG-Database` en los puertos `5432` y `6379`, y salida controlada para actualizaciones.

### SG-Database (Capa de Datos — PostgreSQL & Redis)
* **Inbound (Entrada):**
  * `TCP 5432` (PostgreSQL) exclusivamente desde `SG-Backend-App`.
  * `TCP 6379` (Redis) exclusivamente desde `SG-Backend-App`.
* **Outbound (Salida):**
  * Restringido (sin acceso directo a Internet).

---

## 4. Orquestación y Fases de Despliegue

El arranque del sistema sigue una secuencia controlada mediante `depends_on` y aislamiento de red:
1. **Fase 1 (Persistencia y Caché):** Se inicializan `eventoya_db` (con volumen persistente `postgres_data`) y `eventoya_cache` dentro de `backend_net`.
2. **Fase 2 (Microservicios Backend):** Se levantan `eventoya_api_1` y `eventoya_api_2` conectadas tanto a `backend_net` (para consultar datos) como a `frontend_net` (para recibir peticiones).
3. **Fase 3 (Proxy y Balanceo):** Se inicia `eventoya_proxy` (Nginx) en el puerto `80`, distribuyendo el tráfico entrante entre ambas instancias de la API.