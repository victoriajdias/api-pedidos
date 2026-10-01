import { db } from "./db.js";
import { sql } from "drizzle-orm";

await db.execute(sql`
  CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    produto VARCHAR(255) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL
  )
  `);

// await db.execute(sql`
//     INSERT INTO pedidos (produto, preco, status)
//     VALUES ('Webcam', 300.00, 'processando' )
//     `);

const buscarPedidos = await db.execute(sql`
      SELECT * FROM pedidos
      `);

const buscarStatus = await db.execute(sql`
  SELECT * FROM pedidos WHERE status = 'pendente'
  `);

const alterarValor = await db.execute(sql`
  UPDATE pedidos
  SET "status" = 'processando'
  WHERE produto = 'Notebook'
  `);

const deletarProduto = await db.execute(sql`
  DELETE FROM pedidos
  WHERE produto = 'Webcam'
  `);
console.log(buscarPedidos.rows);
// console.log(buscarStatus.rows);
// console.log(alterarValor.rows);
// console.log(deletarProduto.rows);
