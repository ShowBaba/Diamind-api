require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'mydiary-dev',
    use_env_variables: process.env.DB_CONNECTION_DEV,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'mydiary-test',
    use_env_variables: process.env.DB_CONNECTION_TEST,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: '',
    password: '',
    database: 'mydiary-prod',
    use_env_variables: 'DATABASE_URL',
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
  },
};
