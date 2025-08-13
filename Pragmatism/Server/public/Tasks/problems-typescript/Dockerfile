# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the entire application code first
COPY . .

# instal deps during image creation
RUN npm install

# Keep the container running
CMD ["tail", "-f", "/dev/null"]
