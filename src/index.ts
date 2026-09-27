import type { Pedido } from "./types/pedido";
import type { Status } from "./types/pedido";
import express = require("express");

const app = express();
app.use(express.json());
app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});
app.get("/pedidos/:id", (req, res) => {
  const id = Number(req.params.id);
  const pedido = buscarPedido(id);
  if (!pedido) {
    res.status(404).json({ mensagem: "Pedido não encontrado" });
    return;
  }
  res.json(pedido);
});
app.post("/pedidos", (req, res) => {
  const pedido = req.body;
  adicionarPedido(pedido);
  res.status(201).json(pedido);
});
app.patch("/pedidos/:id", (req, res) => {
  const editar = req.body.status;
  alterarStatus(Number(req.params.id), editar);
  res.status(200).json(pedidos);
});
app.delete("/pedidos/:id", (req, res) => {
  const id = Number(req.params.id);
  deletarPedido(id);
  res.status(204).send();
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
