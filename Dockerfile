# Use Node.js 18 Alpine base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package files and install root dependencies
COPY package*.json ./
RUN npm install

# Copy client package files and install client dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy server package files and install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy all source code
COPY . .

# Build client
RUN cd client && npm run build

# Expose ports for backend and frontend
EXPOSE 3000
EXPOSE 3001

# Start backend and frontend concurrently
CMD ["sh", "-c", "cd server && npm run dev & cd ../client && npm run dev"]
