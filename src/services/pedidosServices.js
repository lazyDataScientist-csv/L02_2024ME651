import crypto from 'crypto';
import { pool } from '../db.js';

export const obtenerTodosPedidos = async () => {
  const query = `
    SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.correo AS usuario_correo
    FROM pedidos p
    INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
    ORDER BY p.fecha_pedido DESC;
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const obtenerPedidoPorId = async (id) => {
  const query = `
    SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.correo AS usuario_correo
    FROM pedidos p
    INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
    WHERE p.id_pedido = ?;
  `;
  const [rows] = await pool.query(query, [id]);
  return rows[0] || null;
};

export const crearPedido = async ({ usuario_id, estado, total }) => {
  const id_pedido = crypto.randomUUID();
  const query = `
    INSERT INTO pedidos (id_pedido, usuario_id, estado, total)
    VALUES (?, ?, ?, ?);
  `;
  await pool.query(query, [id_pedido, usuario_id, estado || 'PENDIENTE', total || 0.00]);
  return await obtenerPedidoPorId(id_pedido);
};

export const actualizarPedido = async (id, { usuario_id, estado, total }) => {
  const query = `
    UPDATE pedidos
    SET usuario_id = ?,
        estado = ?,
        total = ?
    WHERE id_pedido = ?;
  `;
  const [result] = await pool.query(query, [usuario_id, estado, total, id]);
  if (result.affectedRows === 0) return null;
  return await obtenerPedidoPorId(id);
};

export const eliminarPedido = async (id) => {
  const pedido = await obtenerPedidoPorId(id);
  if (!pedido) return null;
  await pool.query('DELETE FROM pedidos WHERE id_pedido = ?;', [id]);
  return pedido;
};

// Listado de pedidos por cliente específico
export const obtenerPedidosPorCliente = async (clienteId) => {
  const query = `
    SELECT p.*, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido
    FROM pedidos p
    INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
    WHERE p.usuario_id = ?
    ORDER BY p.fecha_pedido DESC;
  `;
  const [rows] = await pool.query(query, [clienteId]);
  return rows;
};