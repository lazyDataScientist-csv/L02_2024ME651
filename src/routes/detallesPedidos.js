import { Router } from 'express';
import {
  obtenerTodosDetalles,
  obtenerDetallePorId,
  crearDetalle,
  actualizarDetalle,
  eliminarDetalle,
  obtenerDetallesPorPedido,
  obtenerDetallesPorProducto
} from '../services/detallesPedidosServices.js';

const router = Router();

// Consultas específicas
router.get('/pedido/:pedidoId', async (req, res, next) => {
  try {
    const detalles = await obtenerDetallesPorPedido(req.params.pedidoId);
    res.status(200).json(detalles);
  } catch (err) {
    next(err);
  }
});

router.get('/producto/:productoId', async (req, res, next) => {
  try {
    const detalles = await obtenerDetallesPorProducto(req.params.productoId);
    res.status(200).json(detalles);
  } catch (err) {
    next(err);
  }
});

// CRUD General
router.get('/', async (req, res, next) => {
  try {
    const detalles = await obtenerTodosDetalles();
    res.status(200).json(detalles);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const detalle = await obtenerDetallePorId(req.params.id);
    if (!detalle) return res.status(404).json({ error: 'Detalle no encontrado' });
    res.status(200).json(detalle);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
    if (!pedido_id || !producto_id || !cantidad || precio_unitario === undefined) {
      return res.status(400).json({ error: 'pedido_id, producto_id, cantidad y precio_unitario son requeridos.' });
    }
    if (parseInt(cantidad, 10) <= 0 || parseFloat(precio_unitario) < 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0 y el precio no puede ser negativo.' });
    }

    const nuevoDetalle = await crearDetalle({
      pedido_id,
      producto_id,
      cantidad: parseInt(cantidad, 10),
      precio_unitario: parseFloat(precio_unitario)
    });
    res.status(201).json({ message: 'Detalle de pedido registrado exitosamente', data: nuevoDetalle });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El pedido_id o producto_id proporcionado no existe.' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { pedido_id, producto_id, cantidad, precio_unitario } = req.body;
    if (!pedido_id || !producto_id || !cantidad || precio_unitario === undefined) {
      return res.status(400).json({ error: 'pedido_id, producto_id, cantidad y precio_unitario son requeridos.' });
    }

    const detalleActualizado = await actualizarDetalle(req.params.id, {
      pedido_id,
      producto_id,
      cantidad: parseInt(cantidad, 10),
      precio_unitario: parseFloat(precio_unitario)
    });

    if (!detalleActualizado) return res.status(404).json({ error: 'Detalle no encontrado para actualizar.' });
    res.status(200).json({ message: 'Detalle actualizado exitosamente', data: detalleActualizado });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El pedido_id o producto_id no existe.' });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const detalleEliminado = await eliminarDetalle(req.params.id);
    if (!detalleEliminado) return res.status(404).json({ error: 'Detalle no encontrado para eliminar.' });
    res.status(200).json({ message: 'Detalle eliminado exitosamente', data: detalleEliminado });
  } catch (err) {
    next(err);
  }
});

export default router;