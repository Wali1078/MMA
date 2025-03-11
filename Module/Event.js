// entity/Event.js
const EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Event",
  tableName: "event",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      length: 100
    },
    date: {
      type: "date"
    },
    venue: {
      type: "varchar",
      length: 100
    },
    city: {
      type: "varchar",
      length: 50
    },
    country: {
      type: "varchar",
      length: 50
    },
    promotion: {
      type: "varchar",
      length: 50
    },
    status: {
      type: "enum",
      enum: ["upcoming", "completed", "canceled"],
      default: "upcoming"
    }
  },
  relations: {
    fights: {
      type: "one-to-many",
      target: "Fight",
      inverseSide: "event"
    }
  }
});