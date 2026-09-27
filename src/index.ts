import express from "express";
import type { Status } from "./types/pedido.ts";
import type { Pedido } from "./types/pedido.ts";
import { db } from "./db/db.js";
import { sql } from "drizzle-orm";

const app = express();
app.use(express.json());
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
  if (!pedidos) {
    res.status(404).json({ mensagem: "Pedido não encontrado" });
    return;
  }
  res.json(buscarPeloId.rows);
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
  res.status(204).send(deletar);
});

const pedidos: Pedido[] = [
  { id: 1, produto: "Notebook", preco: 3500, status: "pendente" },
  { id: 2, produto: "Webcam", preco: 300, status: "processando" },
];
function buscarPedido(id: number): Pedido | undefined {
  return pedidos.find((pedido) => pedido.id === id);
}
function buscarPorStatus(status: Status): Pedido[] {
  return pedidos.filter((pedido) => pedido.status === status);
}
function adicionarPedido(pedido: Pedido): void {
  console.log("pedido recebido", pedido);
  pedidos.push(pedido);
}
function alterarStatus(id: number, status: Status) {
  const pedido = pedidos.find((pedido) => pedido.id === id);
  if (pedido) {
    pedido.status = status;
  }
}
function deletarPedido(id: number) {
  const indice = pedidos.findIndex((pedido) => pedido.id === id);
  if (indice !== -1) {
    pedidos.splice(indice, 1);
  }
}
// alterarStatus(1, "processando");
// console.log(pedidos);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
