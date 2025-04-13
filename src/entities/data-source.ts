import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './user.entity'; // Ensure this is the correct path to your User entity
import { Product } from './product.entity';
dotenv.config();

const AppDataSource = new DataSource({
    
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Keep false for production & migrations
    logging: ['query', 'error'],
    //entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    entities: [User, Product],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    ssl: false,
});
AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

export default AppDataSource;


































// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import * as dotenv from "dotenv";
// import { max } from "lodash";

// dotenv.config();

// export const AppDataSource = new DataSource({
//     type: "postgres",
//     host: process.env.DB_HOST || "localhost",
//     port: parseInt(process.env.DB_PORT || "5432"),
//     username: process.env.DB_USERNAME || "postgres",
//     password: process.env.DB_PASSWORD || "1234",
//     database: process.env.DB_DATABASE || "service_db",
//     synchronize: true, // Set to false in production
//     //logging: true,
//     logging: ['query', 'error'],
//     entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
//     ssl: false,
//     extra: {
//         max: 20, // Maximum number of connections in the pool
//         idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
//     }
// });

// const connectToDatabase = async () => {
//     let retries = 5;
//     while (retries) {
//         try {
//             await AppDataSource.initialize();
//             console.log("Database connected successfully!");
//             break;
//         } catch (err) {
//             console.error("Database connection failed. Retrying...", err);
//             retries -= 1;
//             await new Promise(res => setTimeout(res, 50000)); // Wait for 5 seconds before retrying
//         }
//     }

//     if (!retries) {
//         throw new Error("Unable to connect to the database after multiple retries.");
//     }
// };

// connectToDatabase();