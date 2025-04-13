# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Build the app (optional if using start:dev)
RUN npm run build

# Expose the app port
EXPOSE 5005

# Start the app
CMD ["npm", "run", "start:dev"]
