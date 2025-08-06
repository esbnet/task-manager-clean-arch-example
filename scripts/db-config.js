#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const environment = process.argv[2] || 'development';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const envPath = path.join(__dirname, '../.env');

// Configurações por ambiente
const configs = {
    development: {
        provider: 'postgresql',
        hasDirectUrl: true,
        envVars: {
            DATABASE_URL: process.env.DEV_DATABASE_URL,
            DIRECT_URL: process.env.DEV_DATABASE_URL
        }
    },
    production: {
        provider: 'postgresql',
        hasDirectUrl: true,
        envVars: {
            DATABASE_URL: process.env.PROD_DATABASE_URL,
            DIRECT_URL: process.env.PROD_DIRECT_URL
        }
    }
};

const config = configs[environment];

if (!config) {
    console.error(`❌ Ambiente inválido: ${environment}`);
    console.log('Ambientes disponíveis: development, production');
    process.exit(1);
}

// Atualizar schema.prisma
let schema = fs.readFileSync(schemaPath, 'utf8');

const datasourceRegex = /datasource db \{[\s\S]*?\}/;
const newDatasource = config.hasDirectUrl
    ? `datasource db {
            provider  = "${config.provider}"
            url       = env("DATABASE_URL")
            directUrl = env("DIRECT_URL")
        }`
    : `datasource db {
            provider = "${config.provider}"
            url      = env("DATABASE_URL")
        }`;

schema = schema.replace(datasourceRegex, newDatasource);
fs.writeFileSync(schemaPath, schema);

// Atualizar .env
let envContent = fs.readFileSync(envPath, 'utf8');

envContent = envContent.replace(
    /^DATABASE_URL=.*/m,
    `DATABASE_URL="${config.envVars.DATABASE_URL}"`
);

if (config.hasDirectUrl) {
    if (envContent.includes('DIRECT_URL=')) {
        envContent = envContent.replace(
            /^DIRECT_URL=.*/m,
            `DIRECT_URL="${config.envVars.DIRECT_URL}"`
        );
    } else {
        envContent += `\nDIRECT_URL="${config.envVars.DIRECT_URL}"`;
    }
}

fs.writeFileSync(envPath, envContent);

console.log(`✅ Configurado para ambiente: ${environment}`);
console.log(`📊 Provider: ${config.provider}`);
console.log(`🔗 Database URL: ${config.envVars.DATABASE_URL}`);