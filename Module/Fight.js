// entity/Fight.js
const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Fight",
  tableName: "fight",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    eventId: {
      type: "int"
    },
    fighterAId: {
      type: "int"
    },
    fighterBId: {
      type: "int"
    },
    weightClassId: {
      type: "int"
    },
    winnerId: {
      type: "int",
      nullable: true
    },
    resultMethod: {
      type: "enum",
      enum: ["knockout", "submission", "decision", "draw", "no contest", "disqualification"],
      nullable: true
    },
    resultRound: {
      type: "int",
      nullable: true
    },
    resultTime: {
      type: "time",
      nullable: true
    },
    fightStats: {
      type: "jsonb",
      nullable: true
    }
  },
  relations: {
    event: {
      type: "many-to-one",
      target: "Event",
      joinColumn: { name: "eventId" },
      onDelete: "CASCADE"
    },
    fighterA: {
      type: "many-to-one",
      target: "Fighter",
      joinColumn: { name: "fighterAId" }
    },
    fighterB: {
      type: "many-to-one",
      target: "Fighter",
      joinColumn: { name: "fighterBId" }
    },
    weightClass: {
      type: "many-to-one",
      target: "WeightClass",
      joinColumn: { name: "weightClassId" }
    },
    winner: {
      type: "many-to-one",
      target: "Fighter",
      joinColumn: { name: "winnerId" },
      nullable: true
    }
  }
});