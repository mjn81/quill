# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Create a directory to hold the application code inside the image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock if you use yarn)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Run your schema push command
RUN npm run db:push

# Build your Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
