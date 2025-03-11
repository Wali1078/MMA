// index.js (in /GraphQL/resolvers)
const fighterResolvers = require("./fighter");
const eventResolvers = require("./event");
const fightResolvers = require("./fight");
const weightClassResolvers = require("./weightClass");
const rankingResolvers = require("./ranking");

// We can merge them manually:
module.exports = {
  Query: {
    ...fighterResolvers.Query,
    ...eventResolvers.Query,
    ...fightResolvers.Query,
    ...weightClassResolvers.Query,
    ...rankingResolvers.Query,
  },
  Mutation: {
    ...fighterResolvers.Mutation,
    ...eventResolvers.Mutation,
    ...fightResolvers.Mutation,
    ...weightClassResolvers.Mutation,
    ...rankingResolvers.Mutation,
  },
  Fighter: fighterResolvers.Fighter,
  Event: eventResolvers.Event,
  Fight: fightResolvers.Fight,
  WeightClass: weightClassResolvers.WeightClass,
  Ranking: rankingResolvers.Ranking,
};
