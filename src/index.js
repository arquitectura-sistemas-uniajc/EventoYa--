const express = require('express');
const Redis = require('ioredis');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Conexión a Redis
const redis = new Redis({
  host: process.env.REDIS_HOST || 'cache',
  port: 6379,
});

// Endpoint de Salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'EventoYa API' });
});

// GET /events - Consulta de eventos (Lectura Frecuente con Caché)
app.get('/events', async (req, res) => {
  try {
    const cachedEvents = await redis.get('events_catalog');
    if (cachedEvents) {
      return res.json({ source: 'cache', data: JSON.parse(cachedEvents) });
    }

    const events = [
      { id: 1, name: 'Concierto Estelar 2026', availableTickets: 500, price: 150000 }
    ];

    await redis.set('events_catalog', JSON.stringify(events), 'EX', 30);
    res.json({ source: 'database', data: events });
  } catch (err) {
    res.status(500).json({ error: 'Error consultando eventos' });
  }
});

// POST /reservations - Reserva temporal con control de aforo
app.post('/reservations', async (req, res) => {
  const { eventId, userId, quantity } = req.body;
  if (!eventId || !userId || !quantity) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  res.status(201).json({
    message: 'Reserva temporal creada con éxito',
    reservationId: `RES-${Date.now()}`,
    expiresInSeconds: 600
  });
});

// POST /tickets/validate - Validación de QR en puerta
app.post('/tickets/validate', (req, res) => {
  const { ticketCode } = req.body;
  if (!ticketCode) {
    return res.status(400).json({ error: 'Código de boleta requerido' });
  }

  res.json({ valid: true, ticketCode, entryTime: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`EventoYa API corriendo en el puerto ${port}`);
});