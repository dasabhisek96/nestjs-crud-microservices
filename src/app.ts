import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './utils/appModule';
import { ExpressAdapter } from '@nestjs/platform-express';
import userRoutes from './router/user.router';
import productRoutes from './router/product.router';
import  AppDataSource  from '../src/entities/data-source';
const app: Application = express();
const PORT = process.env.PORT || 5005;

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    // Start the server or proceed with logic
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });


// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the CRUD Microservice!');
});
// User Routes
app.use('/users', userRoutes);

// Product Routes
app.use('/products', productRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Note: To integrate NestJS, you would typically create a separate NestJS application.
// However, if you want to add NestJS functionality to this existing Express app, you can use the NestFactory.


async function bootstrap() {
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));
    await nestApp.init();
}

bootstrap().catch((err) => {
    console.error('Error starting NestJS application:', err);
});


export default app;