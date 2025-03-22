module.exports = {
  apps : [{
    name: "app",
    script: "./src/server.ts",
    interpreter: "node",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}