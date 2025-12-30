module.exports = {
  apps: [
    {
      name: "newsbombs-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3455",
      node_args: "--max-old-space-size=256",
      max_memory_restart: "350M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "newsbombs-backend",
      script: "dist/main.js",
      node_args: "--max-old-space-size=256",
      max_memory_restart: "350M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};

