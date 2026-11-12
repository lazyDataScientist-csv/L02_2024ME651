import { Router } from 'express';
import { obtenerTopProductosMasVendidos } from '../services/reportesServices.js';

const router = Router();

// GET /reportes/top-productos/:n
router.get('/top-productos/:n?', async (req, res, next) => {
  try {
    const nParam = req.params.n || req.query.n;
    const limite = parseInt(nParam, 10);

    if (isNaN(limite) || limite <= 0) {
      return res.status(400).json({ error: 'El parámetro N debe ser un número entero mayor a 0.' });
    }

    const productos = await obtenerTopProductosMasVendidos(limite);
    res.status(200).json({
      top: limite,
      productos_mas_vendidos: productos
    });
  } catch (err) {
    next(err);
  }
});

export default router;