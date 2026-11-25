# C4 Nivel 2 — Contenedores y Protocolos de EventoYa

El siguiente diagrama de **C4 Nivel 2** muestra los componentes internos del sistema **EventoYa**, la tecnología de cada uno y el protocolo/puerto de comunicación en cada conexión.

```mermaid
flowchart LR
    Usuario["Usuario / Cliente Web\n[Persona]"]

    subgraph SistemaEventoYa["Sistema EventoYa"]
        Portal["Portal Web / Proxy Inverso\n[Nginx Alpine]"]
        API["API EventoYa (x2 réplicas)\n[Node.js · Express]"]
        Cache["Caché de Eventos e Idempotencia\n[Redis 7]"]
        BD["Base de Datos Transaccional\n[PostgreSQL 15]"]
    end

    Usuario -->|"HTTPS / HTTP TCP/80"| Portal
    Portal -->|"HTTP/JSON TCP/3000"| API
    API -->|"RESP TCP/6379"| Cache
    API -->|"PostgreSQL Wire Protocol TCP/5432"| BD