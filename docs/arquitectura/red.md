# Plan de Red y Seguridad en AWS — EventoYa

> **Regla clave:** Una subred es pública por su ruta hacia el **Internet Gateway (IGW)**, no por su nombre.

## 1. Direccionamiento y Segmentación en VPC
* **VPC del proyecto:** Bloque CIDR `10.0.0.0/16` (65.536 direcciones IP disponibles para crecer), IPv6 deshabilitado (`No`) y *Tenancy* `Default`.
* **Subred Pública (`10.0.1.0/24`):**
  * **Ruta de salida:** `0.0.0.0/0` hacia el **Internet Gateway (IGW)**.
  * **Propósito:** Albergar la instancia EC2 (`t3.micro`, Ubuntu 24.04 LTS) con IP pública autoasignada donde corre el proxy inverso (`Nginx`, puerto `80`) y la administración remota (`SSH`, puerto `22`).
* **Subred Privada (`10.0.2.0/24`):**
  * **Ruta hacia Internet:** Sin ruta directa al Internet Gateway.
  * **Propósito:** Segmentar los servicios internos y datos (`PostgreSQL 15` en `5432/tcp`, `Redis 7` en `6379/tcp` y réplicas internas de la API en `3000/tcp`). En el despliegue mínimo en una sola EC2, la red interna de Docker (`eventoya_backend_net` con `internal: true`) aísla el tráfico entre contenedores sin publicar puertos internos al host ni a Internet.

## 2. Diagrama del Plan de Red

```mermaid
flowchart LR
    Internet["Internet / Usuarios"]
    Admin["Administrador (IP Pública)"]

    subgraph VPC["VPC EventoYa (10.0.0.0/16)"]
        IGW["Internet Gateway (IGW)"]

        subgraph PubSub["Subred Pública (10.0.1.0/24)"]
            EC2["EC2 Ubuntu 24.04 (t3.micro)"]
            Proxy["Nginx Proxy (:80)"]
        end

        subgraph PrivSub["Subred Privada / Red Interna Aislada"]
            API1["API Node/Express #1 (:3000)"]
            API2["API Node/Express #2 (:3000)"]
            Redis["Redis 7 Caché (:6379)"]
            DB["PostgreSQL 15 BD (:5432)"]
        end
    end

    Internet -->|"HTTP TCP/80 (0.0.0.0/0)"| IGW --> Proxy
    Admin -->|"SSH TCP/22 (Solo IP Admin)"| IGW --> EC2
    Proxy -->|"HTTP/JSON TCP/3000"| API1
    Proxy -->|"HTTP/JSON TCP/3000"| API2
    API1 <-->|"TCP/6379"| Redis
    API2 <-->|"TCP/6379"| Redis
    API1 <-->|"TCP/5432"| DB
    API2 <-->|"TCP/5432"| DB