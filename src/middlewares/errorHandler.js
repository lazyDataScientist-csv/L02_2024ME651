export const errorHandler = (err, req, res, next) => {
  console.error('[Error Centralizado MySQL]:', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message,
    detalles: err.detalles || null
  });
};