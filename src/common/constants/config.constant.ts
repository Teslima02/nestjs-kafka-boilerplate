export const configConstant = {
  database: {
    host: 'DATABASE_HOST',
    port: 'DATABASE_PORT',
    username: 'DATABASE_USERNAME',
    password: 'DATABASE_PASSWORD',
    name: 'DATABASE_NAME',
  },
  testDB: {
    name: 'TEST_DATABASE_NAME',
  },
  jwtSecret: 'JWT_SECRET',
  expireIn: 'EXPIRE_IN',
  environment: {
    development: 'NODE_ENV',
    staging: 'NODE_ENV',
    production: 'NODE_ENV',
  },
  otp: 'OTP',
  email: {
    emailUrl: 'EMAIL_URL',
    emailApiKey: 'EMAIL_API_KEY',
  },
  resetPasswordToken: 'RESET_PASSWORD_TOKEN',
  roles: {
    admin: 'ADMIN',
    user: 'USER',
  },
  services: {
    profileServiceUrl: 'PROFILE_SERVICE_URL',
    emailServiceUrl: 'EMAIL_SERVICE_URL',
    exchangeServiceUrl: 'EXCHANGE_SERVICE_URL',
  },
  sentry: {
    dns: 'SENTRY_DSN',
  },
  rabbitMQ_URL: 'RABBIT_MQ_URL',
  frontendUrl: 'FRONTEND_URL',
  sendSmsOtp: 'SEND_SMS_OTP',
  rocketGlobalBaseUrl: 'ROCKET_GLOBAL_BASE_URL',
  kafkaBroker: 'KAFKABROKER',
};
