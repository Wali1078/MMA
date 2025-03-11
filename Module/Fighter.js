//Fighter.js
const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Fighter",
  tableName: "fighter",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    firstName: {
      type: "varchar",
      length: 50
    },
    lastName: {
      type: "varchar",
      length: 50
    },
    nickname: {
      type: "varchar",
      length: 100,
      nullable: true
    },
    dateOfBirth: {
      type: "date"
    },
    nationality: {
      type: "varchar",
      length: 50
    },
    team: {
      type: "varchar",
      length: 100,
      nullable: true
    },
    height: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true
    },
    weight: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true
    },
    reach: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true
    },
    weightClassId: {
      type: "int"
    },
    wins: {
      type: "int",
      default: 0
    },
    losses: {
      type: "int",
      default: 0
    },
    draws: {
      type: "int",
      default: 0
    },
    noContests: {
      type: "int",
      default: 0
    },
    knockoutWins: {
      type: "int",
      default: 0
    },
    submissionWins: {
      type: "int",
      default: 0
    },
    decisionWins: {
      type: "int",
      default: 0
    }
  },
  relations: {
    weightClass: {
      type: "many-to-one",
      target: "WeightClass",
      joinColumn: { name: "weightClassId" },
      onDelete: "SET NULL"
    },
    fights: {
      type: "one-to-many",
      target: "Fight",
      inverseSide: "fighter"
    },
    rankings: {
      type: "one-to-many",
      target: "Ranking",
      inverseSide: "fighter"
    }
  }
});