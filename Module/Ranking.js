// entity/Ranking.js
const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Ranking",
  tableName: "ranking",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    weightClassId: {
      type: "int"
    },
    fighterId: {
      type: "int"
    },
    position: {
      type: "int"
    },
    date: {
      type: "date",
      default: () => "CURRENT_DATE"
    }
  },
  relations: {
    weightClass: {
      type: "many-to-one",
      target: "WeightClass",
      joinColumn: { name: "weightClassId" },
      onDelete: "CASCADE"
    },
    fighter: {
      type: "many-to-one",
      target: "Fighter",
      joinColumn: { name: "fighterId" },
      onDelete: "CASCADE"
    }
  },
  indices: [
    {
      name: "unique_ranking",
      columns: ["weightClassId", "fighterId", "date"],
      unique: true
    }
  ]
});