module.exports = {
  apps: [
    {
      name: 'agrishield',
      script: 'src/index.mjs',
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      watch: process.env.NODE_ENV === 'development', 
      autorestart: true, 
      restart_delay: 1000,
      node_args: '--no-warnings',
    },
  ],
};
