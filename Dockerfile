FROM oven/bun:1.3.9

WORKDIR /app

COPY .env ./

COPY package*.json bun.lock* ./

COPY client/ .

COPY . .

RUN bun install

RUN bun build src/index.ts --outdir ./ --target bun

RUN cd client && bun install && bun run build


CMD ["bun", "run", "index.js"]

EXPOSE 5000