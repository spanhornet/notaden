module.exports = {
  apps: [
    {
      name: "nota-mcp-server",
      script: "build/index.js",
      cwd: "/Users/ayushkumar/Documents/notaden",
      node_args: "--env-file=.env",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: "nota-mcp-tunnel",
      script: "cloudflared",
      args: "tunnel run nota",
      cwd: "/Users/ayushkumar/Documents/notaden",
      interpreter: "none",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};

