
module.exports = {
    "type": "mariadb",
    "host": "localhost",
    "port": 3306,
    "username": "root",
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