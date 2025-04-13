import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';

export const userSchema = {
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
  email: {
    type: 'string',
    required: true,
    propertyType: 'System',
  },
  password: {
    type: 'string',
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

export const userRequestObj = {
  id: nanoid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(), // You can hash it in DAO
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
};

export const getUserIds = (length: number) => {
  const userIds: Array<string> = [];
  for (let index = 0; index < length; index++) {
    userIds.push(nanoid());
  }
  return userIds;
};

export const bulkUserCreatePayload = {
  users: Array.from({ length: 5 }).map(() => ({
    id: nanoid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  })),
};
