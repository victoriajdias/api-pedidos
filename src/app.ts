import express from "express";
import { db } from "./db/db.js";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
//cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/pedidos", async (req, res) => {
  const buscarPedidos = await db.execute(sql`
    SELECT * FROM pedidos
    `);
  res.json(buscarPedidos.rows);
});
app.get("/pedidos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const buscarPeloId = await db.execute(sql`
    SELECT * FROM pedidos WHERE id = ${id}
    `);
  if (buscarPeloId.rows.length === 0) {
    res.status(404).json({ mensagem: "Pedido não encontrado" });
    return;
  }
  res.json(buscarPeloId.rows[0]);
});
app.post("/pedidos", async (req, res) => {
  const { produto, preco, status } = req.body;
  const criarPedido = await db.execute(sql`
    INSERT INTO pedidos (produto, preco, status)
    VALUES (${produto}, ${preco}, ${status})
    RETURNING *
    `);
  res.status(201).json(criarPedido.rows);
});
app.put("/pedidos/:id", async (req, res) => {
  const { produto, preco, status } = req.body;
  const id = req.params.id;
  const editar = await db.execute(sql`
    UPDATE pedidos
    SET produto = ${produto}, preco = ${preco}, status = ${status}
    WHERE id = ${id}
    RETURNING *
    `);

  res.status(200).json(editar.rows);
});
app.patch("/pedidos/:id", async (req, res) => {
  const status = req.body.status;
  const id = req.params.id;
  const editar = await db.execute(sql`
    UPDATE pedidos 
    SET "status" = ${status}
    WHERE id = ${id}
    RETURNING *
    `);
  res.status(200).json(editar.rows);
});
app.delete("/pedidos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deletar = await db.execute(sql`
    DELETE FROM pedidos
    WHERE id = ${id}
    `);
  res.status(204);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
