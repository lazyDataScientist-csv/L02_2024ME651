import { Router } from 'express';
import {
  obtenerTodosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  filtrarUsuariosPorNombre,
  filtrarUsuariosPorApellido,
  filtrarUsuariosPorCorreo
} from '../services/usuariosServices.js';

const router = Router();

// Consultas específicas
router.get('/buscar/nombre/:nombre', async (req, res, next) => {
  try {
    const usuarios = await filtrarUsuariosPorNombre(req.params.nombre);
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
});

router.get('/buscar/apellido/:apellido', async (req, res, next) => {
  try {
    const usuarios = await filtrarUsuariosPorApellido(req.params.apellido);
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
});

router.get('/buscar/correo/:correo', async (req, res, next) => {
  try {
    const usuarios = await filtrarUsuariosPorCorreo(req.params.correo);
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
});

// CRUD General
router.get('/', async (req, res, next) => {
  try {
    const usuarios = await obtenerTodosUsuarios();
    res.status(200).json(usuarios);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre, apellido, correo, telefono, direccion } = req.body;
    if (!nombre || !apellido || !correo) {
      return res.status(400).json({ error: 'Nombre, apellido y correo son campos obligatorios.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ error: 'Formato de correo inválido.' });
    }

    const nuevoUsuario = await crearUsuario({ nombre, apellido, correo, telefono, direccion });
    res.status(201).json({ message: 'Usuario creado exitosamente', data: nuevoUsuario });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, apellido, correo, telefono, direccion } = req.body;
    if (!nombre || !apellido || !correo) {
      return res.status(400).json({ error: 'Nombre, apellido y correo son campos obligatorios.' });
    }

    const usuarioActualizado = await actualizarUsuario(req.params.id, { nombre, apellido, correo, telefono, direccion });
    if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });

    res.status(200).json({ message: 'Usuario actualizado exitosamente', data: usuarioActualizado });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'El correo ya pertenece a otro usuario.' });
    }
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const usuarioEliminado = await eliminarUsuario(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado para eliminar.' });
    res.status(200).json({ message: 'Usuario eliminado exitosamente', data: usuarioEliminado });
  } catch (err) {
    next(err);
  }
});

export default router;