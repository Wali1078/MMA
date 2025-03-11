// entity/WeightClass.js
const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "WeightClass",
  tableName: "weight_class",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 50
    },
    upperLimit: {
      type: "decimal",
      precision: 5,
      scale: 2
    },
    lowerLimit: {
      type: "decimal",
      precision: 5,
      scale: 2,
      nullable: true
    },
    gender: {
      type: "varchar",
      length: 10
    }
  },
  relations: {
    fighters: {
      type: "one-to-many",
      target: "Fighter",
      inverseSide: "weightClass"
    },
    rankings: {
      type: "one-to-many",
      target: "Ranking",
      inverseSide: "weightClass"
    }
  }
});