# Use the official Node.js image with Alpine Linux
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files (except node_modules) to the container
COPY . .

# Build the React app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose the port that serve will use
EXPOSE 3000

# Command to run the app using serve
CMD ["serve", "-s", "build"]