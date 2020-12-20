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
  test_local: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'mydiary-test',
    use_env_variables: process.env.DB_CONNECTION_TEST,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    use_env_variable: 'HEROKU_POSTGRESQL_AMBER_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  },
};
