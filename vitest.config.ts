import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export default defineConfig({
    test: {
        environment: 'node',
        include: ['**/*.test.ts'],
        setupFiles: ['dotenv/config'],
    },
});
