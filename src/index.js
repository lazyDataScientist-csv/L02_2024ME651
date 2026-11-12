import express from 'express';
import dotenv from 'dotenv';
import usuariosRouter from './routes/usuarios.js';
import pedidosRouter from './routes/pedidos.js';
import detallesRouter from './routes/detallesPedidos.js';
import reportesRouter from './routes/reportes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API RESTful pedidosDB activa (MySQL / SQLyog)',
    endpoints: {
      usuarios: '/usuarios',
      pedidos: '/pedidos',
      detalles: '/detalles-pedidos',
      reportes: '/reportes/top-productos/:n'
    }
  });
});

app.use('/usuarios', usuariosRouter);
app.use('/pedidos', pedidosRouter);
app.use('/detalles-pedidos', detallesRouter);
app.use('/reportes', reportesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor pedidosDB corriendo en http://localhost:${PORT}`);
});

