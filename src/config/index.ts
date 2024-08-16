import dotenv from 'dotenv';

//? CONFIGURE ENVIRONMENT VARIABLES
dotenv.config();

export default {
    host: process.env.HOST,
    database: process.env.DATABASE,
    userName: process.env.USERNAME,
    pass: process.env.PASSWORD,
    port: process.env.PORT,
    dialect: process.env.DIALECT,
    dbUrl: process.env.DATABASE_URL,
}