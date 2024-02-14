
module.exports = {
    "type": "mariadb",
    "host": "localhost",
    "port": parseInt(process.env.DB_PORT, 10) || 3306,
    "username": "root2",
    "password": "bar",
    "database": "mediagram_db",
    "synchronize": false,
    "logging": false,
    "entities": ["dist/**/*.entity.ts"],
    "migrations": [
      "src/migration/**/*.ts"
    ],
    "subscribers": [
      "src/subscriber/**/*.ts"
    ]
  }