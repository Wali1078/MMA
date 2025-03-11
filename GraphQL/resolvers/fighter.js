const { AppDataSource } = require("../../DBConnection/Database");

// 1. Queries for Fighter
const fighterQueries = {
  fighter: async (_, { id }) => {
    try {
      const fighter = await AppDataSource.getRepository("Fighter").findOne({
        where: { id },
        relations: ["weightClass"]
      });
      if (!fighter) throw new Error(`Fighter with ID ${id} not found`);
      return fighter;
    } catch (error) {
      throw new Error(`Failed to fetch fighter: ${error.message}`);
    }
  },
  fighters: async () => {
    try {
      return await AppDataSource.getRepository("Fighter").find({
        relations: ["weightClass"]
      });
    } catch (error) {
      throw new Error(`Failed to fetch fighters: ${error.message}`);
    }
  },
  fighterByName: async (_, { firstName, lastName }) => {
    try {
      const query = {};
      if (firstName) query.firstName = firstName;
      if (lastName) query.lastName = lastName;
      const fighters = await AppDataSource.getRepository("Fighter").find({
        where: query,
        relations: ["weightClass"]
      });
      if (!fighters || fighters.length === 0)
        throw new Error(`No fighters found with name ${firstName} ${lastName}`);
      return fighters;
    } catch (error) {
      throw new Error(`Failed to fetch fighters by name: ${error.message}`);
    }
  },
};

// 2. Mutations for Fighter
const fighterMutations = {
  createFighter: async (_, { input }) => {
    try {
      const repository = AppDataSource.getRepository("Fighter");
      const fighter = repository.create(input);
      return await repository.save(fighter);
    } catch (error) {
      throw new Error(`Failed to create fighter: ${error.message}`);
    }
  },
  updateFighter: async (_, { id, input }) => {
    try {
      const repository = AppDataSource.getRepository("Fighter");
      const fighter = await repository.findOne({ where: { id } });
      if (!fighter) throw new Error(`Fighter with ID ${id} not found`);
      repository.merge(fighter, input);
      return await repository.save(fighter);
    } catch (error) {
      throw new Error(`Failed to update fighter: ${error.message}`);
    }
  },
  deleteFighter: async (_, { id }) => {
    try {
      const result = await AppDataSource.getRepository("Fighter").delete(id);
      if (result.affected === 0) {
        throw new Error(`Fighter with ID ${id} not found or could not be deleted`);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete fighter: ${error.message}`);
    }
  },
  updateFighterStats: async (_, { fighterId, wins, losses }) => {
    try {
      const repository = AppDataSource.getRepository("Fighter");
      const fighter = await repository.findOne({ where: { id: fighterId } });
      if (!fighter) throw new Error(`Fighter with ID ${fighterId} not found`);
      // Update stats
      fighter.wins = wins !== undefined ? wins : fighter.wins;
      fighter.losses = losses !== undefined ? losses : fighter.losses;
      return await repository.save(fighter);
    } catch (error) {
      throw new Error(`Failed to update fighter stats: ${error.message}`);
    }
  }
};

// 3. Field Resolvers for Fighter
const fighterFields = {
  weightClass: async (fighter) => {
    try {
      if (fighter.weightClass) return fighter.weightClass;
      return await AppDataSource.getRepository("WeightClass").findOne({
        where: { id: fighter.weightClassId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch weight class for fighter ${fighter.id}: ${error.message}`);
    }
  },
  fights: async (fighter) => {
    try {
      return await AppDataSource.getRepository("Fight").find({
        where: [
          { fighterAId: fighter.id },
          { fighterBId: fighter.id }
        ]
      });
    } catch (error) {
      throw new Error(`Failed to fetch fights for fighter ${fighter.id}: ${error.message}`);
    }
  },
  rankings: async (fighter) => {
    try {
      return await AppDataSource.getRepository("Ranking").find({
        where: { fighterId: fighter.id },
        order: { date: "DESC" }
      });
    } catch (error) {
      throw new Error(`Failed to fetch rankings for fighter ${fighter.id}: ${error.message}`);
    }
  },
};

// Export them all
module.exports = {
  Query: fighterQueries,
  Mutation: fighterMutations,
  Fighter: fighterFields,
};
