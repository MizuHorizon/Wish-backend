# First stage: Build stage
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install curl and other necessary tools

RUN apk update
RUN apk upgrade
RUN apk add bash
RUN mkdir -p /app/bin

# Download wait-for-it.sh using curl
RUN wget -O /app/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && \
    chmod +x /app/bin/wait-for-it.sh



# Install dependencies
RUN npm install

RUN npx puppeteer browsers install chrome

# Copy the entire source code
COPY src src

# Change working directory to src
WORKDIR /app/src

# Run Prisma generate
RUN npx prisma generate



# Second stage: Production stage
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the previous stage
COPY --from=builder /app /app

# Expose port
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]
