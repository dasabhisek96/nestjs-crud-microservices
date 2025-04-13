
import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { UserDAO } from '@/dao/user.dao';
import { CreateUserDto, UpdateUserDto } from '@/dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly UserDAO: UserDAO) {}

    @Post('register')
    async registerUser(@Body() dto: CreateUserDto) {
        try {
            const { name, email, password } = dto;

            // Check if the user already exists
            const existingUser = await this.UserDAO.findUserByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Hash the password (you can use bcrypt or any other library)
            const hashedPassword = await this.UserDAO.hashPassword(password);

            // Create the user object
            const user = {
                name,
                email,
                password: hashedPassword,
            };

            // Save the user using the DAO
            const savedUser = await this.UserDAO.saveUser(user);

            // Generate a JWT token
            const token = await this.UserDAO.generateJwtToken(savedUser);

            
            // Return a success message
            return { message: 'User registered successfully', user: savedUser, token };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred during registration' };
        }
    }

    @Post('login')
    async loginUser(@Body() dto: { email: string; password: string }) {
        try {
            const { email, password } = dto;

            // Validate email and password
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Check if the user exists
            const user = await this.UserDAO.findUserByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify the password
            const isPasswordValid = await this.UserDAO.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate a JWT token
            const token = await this.UserDAO.generateJwtToken(user);

            return { message: 'User Login Successfully', user, token };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred during login' };
        }
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        try {
            // Fetch the user by ID using the DAO
            const user = await this.UserDAO.findUserById(id);

            // Check if the user exists
            if (!user) {
                throw new Error('User not found');
            }

            return { user };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred while fetching the user' };
        }
    }

    @Get()
    async getAllUsers() {
        try {
            // Fetch all users using the DAO
            const users = await this.UserDAO.findAllUsers();

            return { users };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred while fetching users' };
        }
    }

    @Patch(':id')
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        try {
            // Fetch the user by ID using the DAO
            const existingUser = await this.UserDAO.findUserById(id);

            // Check if the user exists
            if (!existingUser) {
                throw new Error('User not found');
            }

            // Update the user details
            const updatedUser = await this.UserDAO.updateUser(id, dto);

            return { user: updatedUser };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred while updating the user' };
        }
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        try {
            // Fetch the user by ID using the DAO
            const existingUser = await this.UserDAO.findUserById(id);

            // Check if the user exists
            if (!existingUser) {
                throw new Error('User not found');
            }

            // Delete the user using the DAO
            await this.UserDAO.deleteUser(id);

            return { message: 'User deleted successfully' };
        } catch (error) {
            // Handle errors and return a meaningful response
            return { error: (error as Error).message || 'An error occurred while deleting the user' };
        }
    }

}
