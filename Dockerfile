FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server.js .

# Expose port
EXPOSE 8080

# Set environment variable
ENV PORT=8080

# Run the application
CMD ["node", "server.js"]
