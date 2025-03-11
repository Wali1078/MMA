// data-source.js
const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "MMA",
  synchronize: true, // Set to false in production
  logging: true,
  entities: [
    require("../Module/Fighter"),
    require("../Module/Event"),
    require("../Module/Fight"),
    require("../Module/WeightClass"),
    require("../Module/Ranking")
  ]
});

module.exports = { AppDataSource };