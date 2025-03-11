const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Fighter {
    id: ID!
    firstName: String!
    lastName: String!
    nickname: String
    dateOfBirth: String!
    nationality: String!
    team: String
    height: Float
    weight: Float
    reach: Float
    weightClassId: Int!
    wins: Int!
    losses: Int!
    draws: Int!
    noContests: Int!
    knockoutWins: Int!
    submissionWins: Int!
    decisionWins: Int!
    weightClass: WeightClass
    fights: [Fight]
    rankings: [Ranking]
  }

  type Event {
    id: ID!
    name: String!
    date: String!
    venue: String!
    city: String!
    country: String!
    promotion: String!
    status: String!
    fights: [Fight]
  }

  type Fight {
    id: ID!
    eventId: Int!
    fighterAId: Int!
    fighterBId: Int!
    weightClassId: Int!
    winnerId: Int
    resultMethod: String
    resultRound: Int
    resultTime: String
    fightStats: String
    event: Event
    fighterA: Fighter
    fighterB: Fighter
    weightClass: WeightClass
    winner: Fighter
  }

  type WeightClass {
    id: ID!
    name: String!
    upperLimit: Float!
    lowerLimit: Float
    gender: String!
    fighters: [Fighter]
    rankings: [Ranking]
  }

  type Ranking {
    id: ID!
    weightClassId: Int!
    fighterId: Int!
    position: Int!
    date: String!
    weightClass: WeightClass
    fighter: Fighter
  }

  type Query {
    fighter(id: ID!): Fighter
    fighters: [Fighter]
    fighterByName(firstName: String, lastName: String): [Fighter]
    event(id: ID!): Event
    events: [Event]
    upcomingEvents: [Event]
    fight(id: ID!): Fight
    fights: [Fight]
    fighterFights(fighterId: ID!): [Fight]
    weightClass(id: ID!): WeightClass
    weightClasses: [WeightClass]
    rankings(weightClassId: ID!): [Ranking]
  }

  input FighterInput {
    firstName: String!
    lastName: String!
    nickname: String
    dateOfBirth: String!
    nationality: String!
    team: String
    height: Float
    weight: Float
    reach: Float
    weightClassId: Int!
  }

  input EventInput {
    name: String!
    date: String!
    venue: String!
    city: String!
    country: String!
    promotion: String!
    status: String
  }

  input FightInput {
    eventId: Int!
    fighterAId: Int!
    fighterBId: Int!
    weightClassId: Int!
  }

  input FightResultInput {
    winnerId: Int
    resultMethod: String
    resultRound: Int
    resultTime: String
    fightStats: String
  }

  input WeightClassInput {
    name: String!
    upperLimit: Float!
    lowerLimit: Float
    gender: String!
  }

  # ✅ New input type for setting rankings manually
  input RankingInput {
    weightClassId: Int!
    fighterId: Int!
    position: Int!
    date: String!
  }

  type Mutation {
    createFighter(input: FighterInput!): Fighter
    updateFighter(id: ID!, input: FighterInput): Fighter
    deleteFighter(id: ID!): Boolean
    updateFighterStats(fighterId: ID!, wins: Int, losses: Int): Fighter
    
    createEvent(input: EventInput!): Event
    updateEvent(id: ID!, input: EventInput): Event
    deleteEvent(id: ID!): Boolean
    
    createFight(input: FightInput!): Fight
    updateFight(id: ID!, input: FightInput): Fight
    setFightResult(id: ID!, result: FightResultInput!): Fight
    deleteFight(id: ID!): Boolean
    
    createWeightClass(input: WeightClassInput!): WeightClass
    updateWeightClass(id: ID!, input: WeightClassInput): WeightClass
    deleteWeightClass(id: ID!): Boolean

    updateRankings(weightClassId: ID!): Boolean
    updateRankingsAfterFight(fightId: ID!): Boolean

    # ✅ New mutation for manually setting rankings
    setRanking(input: RankingInput!): Ranking
  }
`;

module.exports = { typeDefs };
