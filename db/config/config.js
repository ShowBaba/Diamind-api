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
    username: 'japqvqwwaeonjy',
    password: 'b9a73f74cb976bf8cb22c0b8a8d71a76ae75234803b9ae51429ad6461e4fbe75',
    database: 'damp6r6scofjfn',
    host: 'ec2-54-159-107-189.compute-1.amazonaws.com',
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
    username: process.env.E_USERNAME,
    password: process.env.E_PASSWORD,
    database: process.env.E_DB,
    host: process.env.E_HOST,
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
