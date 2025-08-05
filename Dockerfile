# 1. Builder Stage: Instala as dependências e compila a aplicação.
# Usar uma versão específica como `20-alpine` é mais seguro que `latest`.
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copia o package.json e o lock file
# Usar `*` para o lock file funciona para npm, pnpm e yarn
COPY package.json package-lock.json* ./

# Instala todas as dependências (incluindo devDependencies para o build)
RUN npm install

# Copia o restante do código-fonte da aplicação
COPY . .

# Compila a aplicação Next.js para produção
# Isso usará a saída `standalone` se configurada no next.config.js
RUN npm run build

# 2. Runner Stage: Cria a imagem final e leve para produção.
FROM node:20-alpine AS runner

# Define o diretório de trabalho
WORKDIR /app

# Define o ambiente para produção para melhor performance e segurança
ENV NODE_ENV=production
# Desabilita a telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Cria um usuário não-root para maior segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos necessários do estágio de build
# Isso assume que você tem `output: 'standalone'` no seu next.config.js
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Muda para o usuário não-root
USER nextjs

# Expõe a porta em que a aplicação irá rodar
# O padrão do Next.js é 3000. Seu arquivo original usava 8080.
EXPOSE 3000

# Define a variável de ambiente da porta
ENV PORT 3000

# O comando para iniciar a aplicação
# `server.js` é o ponto de entrada para o build standalone
CMD ["node", "server.js"]
