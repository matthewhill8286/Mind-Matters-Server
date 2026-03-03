# Runtime environment
FROM node:24-slim

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src

# Set build-time arguments (can be overridden with --build-arg)
ARG PORT=8787
ARG NODE_ENV=development
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ARG JWT_SECRET="dev-secret-change-me"
ARG OPENAI_API_KEY
ARG STRIPE_SECRET_KEY

# Set runtime environment variables
ENV PORT=${PORT}
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL=${DATABASE_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}

# Copy only what we need to install dependencies first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies like tsx and typescript)
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure .env exists if not provided
RUN test -f .env || cp .env.example .env

# Generate Prisma client using the build-time DATABASE_URL (or default)
RUN DATABASE_URL=${DATABASE_URL} npx prisma generate

# Expose the application port
EXPOSE ${PORT}

# Command to run the application using tsx (no dist folder needed)
CMD ["npm", "run", "start"]