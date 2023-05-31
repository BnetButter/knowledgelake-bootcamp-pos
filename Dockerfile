# Base Image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install system dependencies for Tauri
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libappindicator1


# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Setup Rust environment
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy package.json and package-lock.json
COPY package*.json ./

# Install node dependencies
RUN npm install

# Copy Tauri dependencies
COPY . .

# Install Tauri CLI
RUN npm install -g @tauri-apps/cli

EXPOSE 1420

# Run the development server
ENTRYPOINT ["npm", "run", "dev"]
