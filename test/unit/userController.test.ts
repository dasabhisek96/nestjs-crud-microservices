import { jest, describe, it, expect, beforeEach, beforeAll, afterAll } from '@jest/globals';
import { UserController } from './../../src/controller/user.controller';
import { UserDAO }  from './../../src/dao/user.dao';
import AppDataSource from './../../src/entities/data-source';
import {
  userRequestObj,
  bulkUserCreatePayload,
} from './../constant/user.constant';
beforeAll(async () => {
    await AppDataSource.initialize(); 
});

afterAll(async () => {
    await AppDataSource.destroy(); 
});
describe('UserController', () => {
  let userController: UserController;
  let userDAO: jest.Mocked<UserDAO>;

  beforeEach(() => {
    // Mock UserDAO methods
    userDAO = {
      findUserByEmail: jest.fn(),
      hashPassword: jest.fn(),
      saveUser: jest.fn(),
      generateJwtToken: jest.fn(),
      comparePassword: jest.fn(),
      findUserById: jest.fn(),
      findAllUsers: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as unknown as jest.Mocked<UserDAO>;

    // Inject the mocked UserDAO into the UserController
    userController = new UserController(userDAO);
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      userDAO.findUserByEmail.mockResolvedValue(null);
      userDAO.hashPassword.mockResolvedValue('hashedPassword123');
      userDAO.saveUser.mockResolvedValue({ ...userRequestObj, password: 'hashedPassword123' });
      userDAO.generateJwtToken.mockResolvedValue('fake-jwt-token');

      const response = await userController.registerUser(userRequestObj);

      expect(userDAO.findUserByEmail).toHaveBeenCalledWith(userRequestObj.email);
      expect(userDAO.saveUser).toHaveBeenCalled();
      expect(response).toEqual({
        message: 'User registered successfully',
        user: expect.any(Object),
        token: 'fake-jwt-token',
      });
    });

    it('should return error if email already exists', async () => {
      userDAO.findUserByEmail.mockResolvedValue(userRequestObj);

      const response = await userController.registerUser(userRequestObj);

      expect(response).toEqual({
        error: 'User with this email already exists',
      });
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      userDAO.findUserByEmail.mockResolvedValue({ ...userRequestObj });
      userDAO.comparePassword.mockResolvedValue(true);
      userDAO.generateJwtToken.mockResolvedValue('fake-jwt-token');

      const response = await userController.loginUser({
        email: userRequestObj.email,
        password: userRequestObj.password,
      });

      expect(userDAO.findUserByEmail).toHaveBeenCalledWith(userRequestObj.email);
      expect(response).toEqual({
        message: 'User Login Successfully',
        user: expect.any(Object),
        token: 'fake-jwt-token',
      });
    });

    it('should return error for invalid login', async () => {
      userDAO.findUserByEmail.mockResolvedValue(null);

      const response = await userController.loginUser({
        email: 'nonexistent@example.com',
        password: 'wrongpass',
      });

      expect(response).toEqual({
        error: 'Invalid email or password',
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userDAO.findUserById.mockResolvedValue(userRequestObj);

      const response = await userController.getUserById(userRequestObj.id);

      expect(response).toEqual({ user: userRequestObj });
    });

    it('should return error if user not found', async () => {
      userDAO.findUserById.mockResolvedValue(null);

      const response = await userController.getUserById('invalid-id');

      expect(response).toEqual({ error: 'User not found' });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      userDAO.findAllUsers.mockResolvedValue(bulkUserCreatePayload.users);

      const response = await userController.getAllUsers();

      expect(response).toEqual({ users: bulkUserCreatePayload.users });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updatedDto = { name: 'Updated Name' };
      userDAO.findUserById.mockResolvedValue(userRequestObj);
      userDAO.updateUser.mockResolvedValue({ ...userRequestObj, ...updatedDto });

      const response = await userController.updateUser(userRequestObj.id, updatedDto);

      expect(response).toEqual({ user: { ...userRequestObj, ...updatedDto } });
    });

    it('should return error if user not found', async () => {
      userDAO.findUserById.mockResolvedValue(null);

      const response = await userController.updateUser('invalid-id', { name: 'Name' });

      expect(response).toEqual({ error: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userDAO.findUserById.mockResolvedValue(userRequestObj);
      userDAO.deleteUser.mockResolvedValue(false);

      const response = await userController.deleteUser(userRequestObj.id);

      expect(response).toEqual({ message: 'User deleted successfully' });
    });

    it('should return error if user not found', async () => {
      userDAO.findUserById.mockResolvedValue(null);

      const response = await userController.deleteUser('invalid-id');

      expect(response).toEqual({ error: 'User not found' });
    });
  });
});

















// //import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from '@/src/controllers/user.controller';
// import { UserDAO } from './';
// import {
//   userRequestObj,
//   bulkUserCreatePayload,
// } from './../constant/user.constant';
// import { jest, describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from '@jest/globals';

// describe('UserController', () => {
//   let userController: UserController;
//   let userDAO: jest.Mocked<UserDAO>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [
//         {
//           provide: UserDAO,
//           useValue: {
//             findUserByEmail: jest.fn(),
//             hashPassword: jest.fn(),
//             saveUser: jest.fn(),
//             generateJwtToken: jest.fn(),
//             comparePassword: jest.fn(),
//             findUserById: jest.fn(),
//             findAllUsers: jest.fn(),
//             updateUser: jest.fn(),
//             deleteUser: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     userController = module.get<UserController>(UserController);
//     userDAO = module.get(UserDAO);
//   });

//   describe('registerUser', () => {
//     it('should register a user successfully', async () => {
//       userDAO.findUserByEmail.mockResolvedValue(null);
//       userDAO.hashPassword.mockResolvedValue('hashedPassword123');
//       userDAO.saveUser.mockResolvedValue({ ...userRequestObj, password: 'hashedPassword123' });
//       userDAO.generateJwtToken.mockResolvedValue('fake-jwt-token');

//       const response = await userController.registerUser(userRequestObj);

//       expect(userDAO.findUserByEmail).toHaveBeenCalledWith(userRequestObj.email);
//       expect(userDAO.saveUser).toHaveBeenCalled();
//       expect(response).toEqual({
//         message: 'User registered successfully',
//         user: expect.any(Object),
//         token: 'fake-jwt-token',
//       });
//     });

//     it('should return error if email already exists', async () => {
//       userDAO.findUserByEmail.mockResolvedValue(userRequestObj);

//       const response = await userController.registerUser(userRequestObj);

//       expect(response).toEqual({
//         error: 'User with this email already exists',
//       });
//     });
//   });

//   describe('loginUser', () => {
//     it('should login user successfully', async () => {
//       userDAO.findUserByEmail.mockResolvedValue({ ...userRequestObj });
//       userDAO.comparePassword.mockResolvedValue(true);
//       userDAO.generateJwtToken.mockResolvedValue('fake-jwt-token');

//       const response = await userController.loginUser({
//         email: userRequestObj.email,
//         password: userRequestObj.password,
//       });

//       expect(userDAO.findUserByEmail).toHaveBeenCalledWith(userRequestObj.email);
//       expect(response).toEqual({
//         message: 'User Login Successfully',
//         user: expect.any(Object),
//         token: 'fake-jwt-token',
//       });
//     });

//     it('should return error for invalid login', async () => {
//       userDAO.findUserByEmail.mockResolvedValue(null);

//       const response = await userController.loginUser({
//         email: 'nonexistent@example.com',
//         password: 'wrongpass',
//       });

//       expect(response).toEqual({
//         error: 'Invalid email or password',
//       });
//     });
//   });

//   describe('getUserById', () => {
//     it('should return user by id', async () => {
//       userDAO.findUserById.mockResolvedValue(userRequestObj);

//       const response = await userController.getUserById(userRequestObj.id);

//       expect(response).toEqual({ user: userRequestObj });
//     });

//     it('should return error if user not found', async () => {
//       userDAO.findUserById.mockResolvedValue(null);

//       const response = await userController.getUserById('invalid-id');

//       expect(response).toEqual({ error: 'User not found' });
//     });
//   });

//   describe('getAllUsers', () => {
//     it('should return all users', async () => {
//       userDAO.findAllUsers.mockResolvedValue(bulkUserCreatePayload.users);

//       const response = await userController.getAllUsers();

//       expect(response).toEqual({ users: bulkUserCreatePayload.users });
//     });
//   });

//   describe('updateUser', () => {
//     it('should update user successfully', async () => {
//       const updatedDto = { name: 'Updated Name' };
//       userDAO.findUserById.mockResolvedValue(userRequestObj);
//       userDAO.updateUser.mockResolvedValue({ ...userRequestObj, ...updatedDto });

//       const response = await userController.updateUser(userRequestObj.id, updatedDto);

//       expect(response).toEqual({ user: { ...userRequestObj, ...updatedDto } });
//     });

//     it('should return error if user not found', async () => {
//       userDAO.findUserById.mockResolvedValue(null);

//       const response = await userController.updateUser('invalid-id', { name: 'Name' });

//       expect(response).toEqual({ error: 'User not found' });
//     });
//   });

//   describe('deleteUser', () => {
//     it('should delete user successfully', async () => {
//       userDAO.findUserById.mockResolvedValue(userRequestObj);
//       userDAO.deleteUser.mockResolvedValue(undefined);

//       const response = await userController.deleteUser(userRequestObj.id);

//       expect(response).toEqual({ message: 'User deleted successfully' });
//     });

//     it('should return error if user not found', async () => {
//       userDAO.findUserById.mockResolvedValue(null);

//       const response = await userController.deleteUser('invalid-id');

//       expect(response).toEqual({ error: 'User not found' });
//     });
//   });
// });
