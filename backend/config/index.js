const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_TTL: process.env.JWT_SECRET || '7d',
};

module.exports = config;
