-- Crear y seleccionar base de datos
CREATE DATABASE IF NOT EXISTS pedidosDB;
USE pedidosDB;

-- 1. Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- 3. Tabla: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) DEFAULT 0.00,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Tabla: detalles_pedidos
CREATE TABLE IF NOT EXISTS detalles_pedidos (
    id_detalle VARCHAR(36) PRIMARY KEY,
    pedido_id VARCHAR(36) NOT NULL,
    producto_id VARCHAR(36) NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) 
        REFERENCES pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) 
        REFERENCES productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Datos iniciales de prueba
INSERT INTO usuarios (id_usuario, nombre, apellido, correo, telefono, direccion) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Joseph', 'Gomez', 'joseph@correo.com', '7000-0000', 'San Miguel, El Salvador'),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Carlos', 'Martinez', 'carlos@correo.com', '7111-1111', 'San Salvador, El Salvador');

INSERT INTO productos (id_producto, nombre, precio, stock) VALUES
('p1111111-1111-1111-1111-111111111111', 'Laptop Gamer Asus ROG', 1250.00, 15),
('p2222222-2222-2222-2222-222222222222', 'Mouse Inalambrico Logitech', 25.50, 60),
('p3333333-3333-3333-3333-333333333333', 'Monitor Curvo 27 Samsung', 220.00, 20),
('p4444444-4444-4444-4444-444444444444', 'Teclado Mecanico RGB', 65.00, 40);