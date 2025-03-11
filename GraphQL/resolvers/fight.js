const { AppDataSource } = require("../../DBConnection/Database");

const fightQueries = {
  fight: async (_, { id }) => {
    try {
      const fight = await AppDataSource.getRepository("Fight").findOne({
        where: { id },
        relations: ["event", "fighterA", "fighterB", "weightClass", "winner"]
      });
      if (!fight) throw new Error(`Fight with ID ${id} not found`);
      return fight;
    } catch (error) {
      throw new Error(`Failed to fetch fight: ${error.message}`);
    }
  },
  fights: async () => {
    try {
      return await AppDataSource.getRepository("Fight").find({
        relations: ["event", "fighterA", "fighterB"]
      });
    } catch (error) {
      throw new Error(`Failed to fetch fights: ${error.message}`);
    }
  },
  fighterFights: async (_, { fighterId }) => {
    try {
      return await AppDataSource.getRepository("Fight").find({
        where: [
          { fighterAId: fighterId },
          { fighterBId: fighterId }
        ],
        relations: ["event", "fighterA", "fighterB", "weightClass", "winner"]
      });
    } catch (error) {
      throw new Error(`Failed to fetch fights for fighter ${fighterId}: ${error.message}`);
    }
  },
};

const fightMutations = {
  createFight: async (_, { input }) => {
    try {
      const repository = AppDataSource.getRepository("Fight");
      const fight = repository.create(input);
      return await repository.save(fight);
    } catch (error) {
      throw new Error(`Failed to create fight: ${error.message}`);
    }
  },
  updateFight: async (_, { id, input }) => {
    try {
      const repository = AppDataSource.getRepository("Fight");
      const fight = await repository.findOne({ where: { id } });
      if (!fight) throw new Error(`Fight with ID ${id} not found`);
      repository.merge(fight, input);
      return await repository.save(fight);
    } catch (error) {
      throw new Error(`Failed to update fight: ${error.message}`);
    }
  },
  setFightResult: async (_, { id, result }) => {
    try {
      const repository = AppDataSource.getRepository("Fight");
      const fight = await repository.findOne({
        where: { id },
        relations: ["fighterA", "fighterB"]
      });
      if (!fight) throw new Error(`Fight with ID ${id} not found`);

      // Update fight result
      repository.merge(fight, result);
      const updatedFight = await repository.save(fight);

      // (Additional logic for updating winner/loser records can be added here)

      return updatedFight;
    } catch (error) {
      throw new Error(`Failed to set fight result: ${error.message}`);
    }
  },
  deleteFight: async (_, { id }) => {
    try {
      const result = await AppDataSource.getRepository("Fight").delete(id);
      if (result.affected === 0) {
        throw new Error(`Fight with ID ${id} not found or could not be deleted`);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete fight: ${error.message}`);
    }
  },
};

const fightFields = {
  event: async (fight) => {
    try {
      if (fight.event) return fight.event;
      return await AppDataSource.getRepository("Event").findOne({
        where: { id: fight.eventId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch event for fight ${fight.id}: ${error.message}`);
    }
  },
  fighterA: async (fight) => {
    try {
      if (fight.fighterA) return fight.fighterA;
      return await AppDataSource.getRepository("Fighter").findOne({
        where: { id: fight.fighterAId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch fighterA for fight ${fight.id}: ${error.message}`);
    }
  },
  fighterB: async (fight) => {
    try {
      if (fight.fighterB) return fight.fighterB;
      return await AppDataSource.getRepository("Fighter").findOne({
        where: { id: fight.fighterBId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch fighterB for fight ${fight.id}: ${error.message}`);
    }
  },
  weightClass: async (fight) => {
    try {
      if (fight.weightClass) return fight.weightClass;
      return await AppDataSource.getRepository("WeightClass").findOne({
        where: { id: fight.weightClassId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch weightClass for fight ${fight.id}: ${error.message}`);
    }
  },
  winner: async (fight) => {
    try {
      if (!fight.winnerId) return null;
      if (fight.winner) return fight.winner;
      return await AppDataSource.getRepository("Fighter").findOne({
        where: { id: fight.winnerId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch winner for fight ${fight.id}: ${error.message}`);
    }
  },
};

module.exports = {
  Query: fightQueries,
  Mutation: fightMutations,
  Fight: fightFields,
};
