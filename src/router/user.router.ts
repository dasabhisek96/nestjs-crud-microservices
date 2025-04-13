import express from 'express';
import {UserController} from '../controller/user.controller';
import { UserDAO } from '../dao/user.dao';


const router = express.Router();



const userDAO = new UserDAO();
const userController = new UserController(userDAO);


const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;
        
        userController.registerUser(body)
            .then((response: any) => {
                res.status(201).json({
                    status: 201,
                    message: 'User created successfully',
                    data: response,
                });
            })
    } catch (error: any) {
        next(error);
    }
};

const getAllUsers = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        userController.getAllUsers()
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'Users retrieved successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while retrieving users:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const getUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;
        userController.getUserById(id)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'User retrieved successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while retrieving user:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const updateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;
        const body = req.body;

        userController.updateUser(id, body)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'User updated successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while updating user:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const deleteUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const id = req.params.id;

        userController.deleteUser(id)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'User deleted successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while deleting user:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

const loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const body = req.body;

        userController.loginUser(body)
            .then((response: any) => {
                res.status(200).json({
                    status: 200,
                    message: 'User logged in successfully',
                    data: response,
                });
            })
            .catch((error: unknown) => {
                console.error('Error while logging in user:', error);
                next(error);
            });
    } catch (error: any) {
        next(error);
    }
};

router.post('/', createUser);              
router.get('/', getAllUsers);              
router.get('/:id', getUser);               
router.patch('/:id', updateUser);         
router.delete('/:id', deleteUser);         
router.post('/login', loginUser);          


export { createUser, getAllUsers, getUser, updateUser, deleteUser, loginUser };
export default router;