import { pool } from '../db.js';

export const obtenerTopProductosMasVendidos = async (limite) => {
  // En MySQL LIMIT no admite marcador ? dentro de prepared statement en ciertas versiones si se pasa como string,
  // por lo que garantizamos un entero parseado seguro
  const query = `
    SELECT 
      pr.nombre AS nombre_producto,
      CAST(IFNULL(SUM(dp.cantidad), 0) AS UNSIGNED) AS cantidad_total_vendida
    FROM productos pr
    INNER JOIN detalles_pedidos dp ON pr.id_producto = dp.producto_id
    GROUP BY pr.id_producto, pr.nombre
    ORDER BY cantidad_total_vendida DESC
    LIMIT ${parseInt(limite, 10)};
  `;
  const [rows] = await pool.query(query);
  return rows;
};