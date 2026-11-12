import { Router } from 'express';
import {
  obtenerTodosPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido,
  obtenerPedidosPorCliente
} from '../services/pedidosServices.js';

const router = Router();

// Consulta específica: Pedidos por cliente
router.get('/cliente/:clienteId', async (req, res, next) => {
  try {
    const pedidos = await obtenerPedidosPorCliente(req.params.clienteId);
    res.status(200).json(pedidos);
  } catch (err) {
    next(err);
  }
});

// CRUD General
router.get('/', async (req, res, next) => {
  try {
    const pedidos = await obtenerTodosPedidos();
    res.status(200).json(pedidos);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const pedido = await obtenerPedidoPorId(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.status(200).json(pedido);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { usuario_id, estado, total } = req.body;
    if (!usuario_id) return res.status(400).json({ error: 'El campo usuario_id es obligatorio.' });

    const nuevoPedido = await crearPedido({ usuario_id, estado, total });
    res.status(201).json({ message: 'Pedido creado exitosamente', data: nuevoPedido });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El usuario_id no existe en la base de datos.' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { usuario_id, estado, total } = req.body;
    if (!usuario_id) return res.status(400).json({ error: 'El campo usuario_id es obligatorio.' });

    const pedidoActualizado = await actualizarPedido(req.params.id, { usuario_id, estado, total });
    if (!pedidoActualizado) return res.status(404).json({ error: 'Pedido no encontrado para actualizar.' });

    res.status(200).json({ message: 'Pedido actualizado exitosamente', data: pedidoActualizado });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El usuario_id no existe en la base de datos.' });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const pedidoEliminado = await eliminarPedido(req.params.id);
    if (!pedidoEliminado) return res.status(404).json({ error: 'Pedido no encontrado para eliminar.' });
    res.status(200).json({ message: 'Pedido eliminado exitosamente', data: pedidoEliminado });
  } catch (err) {
    next(err);
  }
});

export default router;