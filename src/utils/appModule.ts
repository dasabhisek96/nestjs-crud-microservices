import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/controller/user.controller';
import { ProductController } from '@/controller/product.controller';
import { UserDAO } from '@/dao/user.dao';
import { ProductDAO } from '@/dao/product.dao';
import { User } from '@/entities/user.entity';
import { Product } from '@/entities/product.entity';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            logging: true,
            synchronize: true,
            autoLoadEntities: true,
            ssl: false,
        }),
        TypeOrmModule.forFeature([User, Product]),
    ],
    controllers: [UserController, ProductController],
    providers: [UserDAO, ProductDAO],
})
export class AppModule {}
