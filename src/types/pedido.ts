export type Status = "pendente" | "processando" | "concluido";
export type Pedido = {
  id: number;
  produto: string;
  preco: number;
  status: Status;
};
