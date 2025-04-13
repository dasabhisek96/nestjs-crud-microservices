import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';


export const productSchema = {
    id: {
        type: 'string',
        required: false,
        propertyType: 'System',
    },
    name: {
        type: 'string',
        required: true,
        propertyType: 'System',
    },
    description: {
        type: 'string',
        required: false,
        propertyType: 'System',
    },
    price: {
        type: 'number',
        required: true,
        propertyType: 'System',
    },
    stock: {
        type: 'number',
        required: true,
        propertyType: 'System',
    },
    createdAt: {
        type: 'datetime',
        required: false,
        propertyType: 'System',
    },
    updatedAt: {
        type: 'datetime',
        required: false,
        propertyType: 'System',
    },
};

export const productRequestObj = {
    id: nanoid(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
};

export const getProductIds = (length: number) => {
    const productIds: Array<string> = [];
    for (let index = 0; index < length; index++) {
        productIds.push(nanoid());
    }
    return productIds;
};

export const bulkProductCreatePayload = {
    products: Array.from({ length: 5 }).map(() => ({
        id: nanoid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int({ min: 0, max: 100 }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    })),
};