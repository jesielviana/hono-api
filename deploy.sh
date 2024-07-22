#!/usr/bin/env bash
set -e

echo "Bun install"
bun install
echo "Setup/update Prisma"
bun run prisma
echo "copy env"
cp .env.example  .env
echo "Bun deploy"
nohub bun deploy &
echo "finished!"