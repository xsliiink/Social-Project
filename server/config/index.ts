import dotenv from 'dotenv';
dotenv.config();

export const config = {
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_test_secret',
    port: process.env.PORT || 5000,
    isProd: process.env.NODE_ENV === 'production'
};

if (config.isProd && config.JWT_SECRET === 'fallback_test_secret') {
    throw new Error('FATAL ERROR: JWT_SECRET is missing in production!');
}