#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco...');
    
    // Teste básico de conexão
    await prisma.$connect();
    console.log('✅ Conectado ao banco com sucesso!');
    
    // Teste de query simples
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 Versão do PostgreSQL:', result[0].version);
    
    // Verificar se as tabelas existem
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Tabelas encontradas:', tables.length);
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('🔧 Detalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();