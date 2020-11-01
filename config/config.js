require('dotenv').config();

module.exports = {
  development: {
    username: 'me',
    password: 'password',
    database: 'mydiary-dev',
    use_env_variables: 'DB_CONNECTION_DEV',
    dialect: 'postgres',
  },
  test: {
    username: 'me',
    password: 'password',
    database: 'mydiary-test',
    use_env_variables: 'DB_CONNECTION_TEST',
    dialect: 'postgres',
  },
  production: {
    username: 'me',
    password: 'password',
    database: 'mydiary-prod',
    use_env_variables: 'DB_CONNECTION_PRODUCTION',
    dialect: 'postgres',
  },
};
