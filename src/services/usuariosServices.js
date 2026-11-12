import crypto from 'crypto';
import { pool } from '../db.js';

export const obtenerTodosUsuarios = async () => {
  const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY nombre ASC;');
  return rows;
};

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?;', [id]);
  return rows[0] || null;
};

export const crearUsuario = async ({ nombre, apellido, correo, telefono, direccion }) => {
  const id_usuario = crypto.randomUUID();
  const query = `
    INSERT INTO usuarios (id_usuario, nombre, apellido, correo, telefono, direccion)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  await pool.query(query, [id_usuario, nombre, apellido, correo, telefono || null, direccion || null]);
  return await obtenerUsuarioPorId(id_usuario);
};

export const actualizarUsuario = async (id, { nombre, apellido, correo, telefono, direccion }) => {
  const query = `
    UPDATE usuarios
    SET nombre = ?,
        apellido = ?,
        correo = ?,
        telefono = ?,
        direccion = ?
    WHERE id_usuario = ?;
  `;
  const [result] = await pool.query(query, [nombre, apellido, correo, telefono || null, direccion || null, id]);
  if (result.affectedRows === 0) return null;
  return await obtenerUsuarioPorId(id);
};

export const eliminarUsuario = async (id) => {
  const usuario = await obtenerUsuarioPorId(id);
  if (!usuario) return null;
  await pool.query('DELETE FROM usuarios WHERE id_usuario = ?;', [id]);
  return usuario;
};

// Endpoints de filtrado específico
export const filtrarUsuariosPorNombre = async (nombre) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre LIKE ? ORDER BY nombre ASC;', [`%${nombre}%`]);
  return rows;
};

export const filtrarUsuariosPorApellido = async (apellido) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE apellido LIKE ? ORDER BY apellido ASC;', [`%${apellido}%`]);
  return rows;
};

export const filtrarUsuariosPorCorreo = async (correo) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo LIKE ? ORDER BY correo ASC;', [`%${correo}%`]);
  return rows;
};