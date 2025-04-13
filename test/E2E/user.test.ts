import http from 'http';
import  app  from './../../src/app'; 
import { jest, describe, it, expect, beforeAll, afterAll } from '@jest/globals';
describe('User End-to-End Tests', () => {
    let server: http.Server;
    let createdUserId: string;

    beforeAll((done) => {
        server = app.listen(3000, done); 
    });

    afterAll((done) => {
        server.close(done); 
    });

    const makeRequest = (options: http.RequestOptions, data?: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => (body += chunk));
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
            });

            req.on('error', reject);

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    };

    it('should create a new user', async () => {
        const options = {
            hostname: 'localhost',
            port: 5005,
            path: '/users',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await makeRequest(options, {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('John Doe');
        createdUserId = response.body.id;
    });

    it('should retrieve the created user', async () => {
        const options = {
            hostname: 'localhost',
            port: 5005,
            path: `/users/${createdUserId}`,
            method: 'GET',
        };

        const response = await makeRequest(options);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', createdUserId);
        expect(response.body.name).toBe('John Doe');
    });

    it('should update the user', async () => {
        const options = {
            hostname: 'localhost',
            port: 5005,
            path: `/users/${createdUserId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const response = await makeRequest(options, {
            name: 'John Updated',
            email: 'john.updated@example.com',
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('John Updated');
        expect(response.body.email).toBe('john.updated@example.com');
    });

    it('should delete the user', async () => {
        const options = {
            hostname: 'localhost',
            port: 5005,
            path: `/users/${createdUserId}`,
            method: 'DELETE',
        };

        const response = await makeRequest(options);

        expect(response.status).toBe(204);
    });

    it('should return 404 for a deleted user', async () => {
        const options = {
            hostname: 'localhost',
            port: 5005,
            path: `/users/${createdUserId}`,
            method: 'GET',
        };

        const response = await makeRequest(options);

        expect(response.status).toBe(404);
    });

    
});