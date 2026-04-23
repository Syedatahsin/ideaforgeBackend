import { Server } from 'http';
import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

let server: Server;

process.on('uncaughtException', (err) => {
  console.log('😈 uncaughtException detected, shutting down...');
  console.error(err);
  process.exit(1);
});

async function main() {
  try {
    await prisma.$connect();
    console.log('🛢️ Database connection established.');
    
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

main();

const gracefulShutdown = async (signal: string) => {
  console.log(`👏 ${signal} received. Shutting down gracefully...`);
  
  try {
    await prisma.$disconnect();
    console.log('🛢️ Database disconnected.');
  } catch (err) {
    console.error('Error during database disconnection:', err);
  }

  if (server) {
    server.close(() => {
      console.log('Process terminated!');
      process.exit(signal === 'unhandledRejection' ? 1 : 0);
    });
  } else {
    process.exit(signal === 'unhandledRejection' ? 1 : 0);
  }
};

process.on('unhandledRejection', (err) => {
  console.log('😈 unhandledRejection detected, shutting down...');
  console.error(err);
  gracefulShutdown('unhandledRejection');
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
