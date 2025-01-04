# Use the official Node.js LTS image as the base
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
# Expose port 8080
EXPOSE 5000

ENV GOOGLE_CREDENTIALS_BASE64=${GOOGLE_CREDENTIALS_BASE64}


# Set the command to start the application
CMD ["node", "server.js"]
