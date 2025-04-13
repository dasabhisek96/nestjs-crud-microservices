import { User } from '@/entities/user.entity';
import AppDataSource from '@/entities/data-source';
import  redisClient  from '@/middleware/redis.client'; // Make sure the path is correct
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import 'reflect-metadata';

export class UserDAO {
    private userRepository = AppDataSource.getRepository(User);
    private cacheTTL = 60; // seconds

    async saveUser(payload: Partial<User>) {
        try {
            const user = this.userRepository.create(payload);
            const saved = await this.userRepository.save(user);

            // Invalidate related cache
            await redisClient.del('users:all');

            return saved;
        } catch (error: any) {
            console.error(`[UserDAO_saveUser] Error:`, error);
            throw new Error(error?.message || 'Failed to save user');
        }
    }

    async getUserById(id: string) {
        const cacheKey = `user:${id}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const user = await this.userRepository.findOne({ where: { id } });

            if (user) {
                await redisClient.setex(cacheKey, this.cacheTTL, JSON.stringify(user));
            }

            return user;
        } catch (error: any) {
            console.error(`[UserDAO_getUserById] Error:`, error);
            throw new Error(error?.message || 'Failed to get user');
        }
    }

    async updateUser(id: string, payload: Partial<User>) {
        try {
            await this.userRepository.update(id, payload);

            // Invalidate cache
            await redisClient.del(`user:${id}`);
            await redisClient.del('users:all');

            return await this.getUserById(id);
        } catch (error: any) {
            console.error(`[UserDAO_updateUser] Error:`, error);
            throw new Error(error?.message || 'Failed to update user');
        }
    }

    async deleteUser(id: string) {
        try {
            const result = await this.userRepository.delete(id);

            // Invalidate cache
            await redisClient.del(`user:${id}`);
            await redisClient.del('users:all');

            return result.affected ? true : false;
        } catch (error: any) {
            console.error(`[UserDAO_deleteUser] Error:`, error);
            throw new Error(error?.message || 'Failed to delete user');
        }
    }

    async getAllUsers() {
        const cacheKey = 'users:all';
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);

            const users = await this.userRepository.find();

            await redisClient.setex(cacheKey, this.cacheTTL, JSON.stringify(users));
            return users;
        } catch (error: any) {
            console.error(`[UserDAO_getAllUsers] Error:`, error);
            throw new Error(error?.message || 'Failed to get all users');
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error: any) {
            console.error(`[UserDAO_hashPassword] Error:`, error);
            throw new Error(error?.message || 'Failed to hash password');
        }
    }

    async generateJwtToken(user: User): Promise<string> {
        try {
            const secretKey = process.env.JWT_SECRET || 'defaultSecretKey';
            const payload = { id: user.id, email: user.email };
            const options = { expiresIn: '1h' as jwt.SignOptions['expiresIn'] };
            return jwt.sign(payload, secretKey, options);
        } catch (error: any) {
            console.error(`[UserDAO_generateJwtToken] Error:`, error);
            throw new Error(error?.message || 'Failed to generate JWT token');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            console.error('[UserDAO_findUserByEmail] Error:', error);
            throw error;
        }
    }

    async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error: any) {
            console.error(`[UserDAO_comparePassword] Error:`, error);
            throw new Error(error?.message || 'Failed to compare password');
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            return await userRepository.findOne({ where: { id } });
        } catch (error: any) {
            console.error(`[UserDAO_findUserById] Error: `, error);
            throw new Error(error?.message || 'Failed to find user by ID');
        }
    }

    async findAllUsers(): Promise<User[]> {
        try {
            const userRepository = AppDataSource.getRepository(User);
            return await userRepository.find();
        } catch (error: any) {
            console.error(`[UserDAO_findAllUsers] Error: `, error);
            throw new Error(error?.message || 'Failed to find all users');
        }
    }
}




