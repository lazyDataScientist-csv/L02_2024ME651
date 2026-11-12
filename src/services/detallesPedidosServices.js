import crypto from 'crypto';
import { pool } from '../db.js';

export const obtenerTodosDetalles = async () => {
  const query = `
    SELECT d.*, pr.nombre AS producto_nombre, p.usuario_id
    FROM detalles_pedidos d
    INNER JOIN productos pr ON d.producto_id = pr.id_producto
    INNER JOIN pedidos p ON d.pedido_id = p.id_pedido
    ORDER BY d.id_detalle ASC;
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const obtenerDetallePorId = async (id) => {
  const query = `
    SELECT d.*, pr.nombre AS producto_nombre
    FROM detalles_pedidos d
    INNER JOIN productos pr ON d.producto_id = pr.id_producto
    WHERE d.id_detalle = ?;
  `;
  const [rows] = await pool.query(query, [id]);
  return rows[0] || null;
};

export const crearDetalle = async ({ pedido_id, producto_id, cantidad, precio_unitario }) => {
  const id_detalle = crypto.randomUUID();
  const subtotal = cantidad * precio_unitario;

  const query = `
    INSERT INTO detalles_pedidos (id_detalle, pedido_id, producto_id, cantidad, precio_unitario, subtotal)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  await pool.query(query, [id_detalle, pedido_id, producto_id, cantidad, precio_unitario, subtotal]);

  // Recalcular el total del pedido
  await pool.query(`
    UPDATE pedidos 
    SET total = (SELECT IFNULL(SUM(subtotal), 0) FROM detalles_pedidos WHERE pedido_id = ?) 
    WHERE id_pedido = ?;
  `, [pedido_id, pedido_id]);

  return await obtenerDetallePorId(id_detalle);
};

export const actualizarDetalle = async (id, { pedido_id, producto_id, cantidad, precio_unitario }) => {
  const subtotal = cantidad * precio_unitario;
  const query = `
    UPDATE detalles_pedidos
    SET pedido_id = ?,
        producto_id = ?,
        cantidad = ?,
        precio_unitario = ?,
        subtotal = ?
    WHERE id_detalle = ?;
  `;
  const [result] = await pool.query(query, [pedido_id, producto_id, cantidad, precio_unitario, subtotal, id]);
  if (result.affectedRows === 0) return null;

  await pool.query(`
    UPDATE pedidos 
    SET total = (SELECT IFNULL(SUM(subtotal), 0) FROM detalles_pedidos WHERE pedido_id = ?) 
    WHERE id_pedido = ?;
  `, [pedido_id, pedido_id]);

  return await obtenerDetallePorId(id);
};

export const eliminarDetalle = async (id) => {
  const detalle = await obtenerDetallePorId(id);
  if (!detalle) return null;

  await pool.query('DELETE FROM detalles_pedidos WHERE id_detalle = ?;', [id]);

  await pool.query(`
    UPDATE pedidos 
    SET total = (SELECT IFNULL(SUM(subtotal), 0) FROM detalles_pedidos WHERE pedido_id = ?) 
    WHERE id_pedido = ?;
  `, [detalle.pedido_id, detalle.pedido_id]);

  return detalle;
};

// Detalles por pedido específico
export const obtenerDetallesPorPedido = async (pedidoId) => {
  const query = `
    SELECT d.*, pr.nombre AS producto_nombre
    FROM detalles_pedidos d
    INNER JOIN productos pr ON d.producto_id = pr.id_producto
    WHERE d.pedido_id = ?;
  `;
  const [rows] = await pool.query(query, [pedidoId]);
  return rows;
};

// Detalles donde aparece un producto específico
export const obtenerDetallesPorProducto = async (productoId) => {
  const query = `
    SELECT d.*, pr.nombre AS producto_nombre, p.fecha_pedido, p.usuario_id
    FROM detalles_pedidos d
    INNER JOIN productos pr ON d.producto_id = pr.id_producto
    INNER JOIN pedidos p ON d.pedido_id = p.id_pedido
    WHERE d.producto_id = ?;
  `;
  const [rows] = await pool.query(query, [productoId]);
  return rows;
};