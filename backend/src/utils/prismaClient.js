const { PrismaClient } = require('@prisma/client');

// Create a singleton Prisma client instance
class PrismaClientSingleton {
    constructor() {
        if (!PrismaClientSingleton.instance) {
            this.prisma = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
                errorFormat: 'pretty',
            });
            
            PrismaClientSingleton.instance = this;
        }
        
        return PrismaClientSingleton.instance;
    }

    getInstance() {
        return this.prisma;
    }

    async disconnect() {
        if (this.prisma) {
            await this.prisma.$disconnect();
        }
    }
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClientSingleton().getInstance();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

process.on('beforeExit', async () => {
    console.log('Disconnecting Prisma client...');
    await prisma.$disconnect();
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT, disconnecting Prisma client...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, disconnecting Prisma client...');
    await prisma.$disconnect();
    process.exit(0);
});

// Export the singleton instance
module.exports = prisma;

// Also export the class if needed elsewhere
module.exports.PrismaClientSingleton = PrismaClientSingleton;