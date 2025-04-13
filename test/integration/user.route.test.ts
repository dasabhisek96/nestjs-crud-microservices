import { createUser, getAllUsers, getUser, updateUser, deleteUser, loginUser } from './../../src/router/user.router';
import * as userController from './../../src/controller/user.controller';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
describe('User Router Integration (No Supertest)', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should create a user', async () => {
    req.body = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };

    await createUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User created successfully',
        data: expect.anything()
      })
    );
  });

  it('should get all users', async () => {
    await getAllUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Users retrieved successfully',
        data: expect.anything()
      })
    );
  });

  it('should get user by id', async () => {
    req.params = { id: 'test-id' };

    await getUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User retrieved successfully',
        data: expect.anything()
      })
    );
  });

  it('should update a user', async () => {
    req.params = { id: 'test-id' };
    req.body = { name: 'Updated Name' };
    req.body = { email: 'updatedemail@example.com'},

    await updateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User updated successfully',
        data: expect.anything()
      })
    );
  });

  it('should delete a user', async () => {
    req.params = { id: 'test-id' };

    await deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User deleted successfully',
        data: expect.anything()
      })
    );
  });

  it('should login a user', async () => {
    req.body = {
      email: 'test@example.com',
      password: '123456'
    };

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'User logged in successfully',
        data: expect.anything()
      })
    );
  });

  it('should call next on createUser error (missing body)', async () => {
    req.body = undefined;

    await createUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next on getUser error (missing id)', async () => {
    req.params = {}; // missing id

    await getUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next on updateUser error (missing body)', async () => {
    req.params = { id: 'some-id' };
    req.body = undefined;

    await updateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next on deleteUser error (missing id)', async () => {
    req.params = {}; // no id

    await deleteUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should call next on login error (invalid credentials)', async () => {
    req.body = { email: 'wrong@example.com', password: 'wrong' };

    await loginUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
