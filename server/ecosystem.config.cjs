module.exports = {
  apps: [
    {
      name: 'agrishield',
      script: './src/index.mjs',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001, 
      },
      watch: true, 
      autorestart: true, 
      restart_delay: 1000,
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log', 
      log_date_format: 'DD-MM-YYYY HH:mm:ss', 
      node_args: '--no-warnings',
    },
  ],
};
