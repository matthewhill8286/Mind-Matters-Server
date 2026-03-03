# Runtime environment
FROM node:24-slim

# Build-time arguments
ARG DATABASE_URL
ARG PORT=3000

# Set environment variables for runtime
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

# Copy only what we need to install dependencies first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies like tsx and typescript)
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure .env exists if not provided
RUN test -f .env || cp .env.local .env

# Generate Prisma client using the build-time DATABASE_URL
RUN npx prisma generate

# Expose the application port
EXPOSE ${PORT}

# Command to run the application using tsx (no dist folder needed)
CMD ["npm", "run", "start"]