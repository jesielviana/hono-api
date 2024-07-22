#!/usr/bin/env bash
set -e

echo "Bun install"
bun install
echo "Setup/update Prisma"
bun run prisma
echo "copy env"
cp .env.example  .env
echo "Encerra processos da porta 80"
# Verifica se há processos escutando na porta 80
if sudo lsof -t -i:80 > /dev/null; then
  # Se houver processos, mata os processos escutando na porta 80
  sudo kill -9 $(sudo lsof -t -i:80)
  echo "Processos na porta 80 foram terminados."
else
  # Se não houver processos, exibe uma mensagem informativa
  echo "Nenhum processo encontrado na porta 80."
fi

echo "Bun deploy"
nohup bun run deploy &
echo "finished!"
