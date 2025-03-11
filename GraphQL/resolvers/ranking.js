const { AppDataSource } = require("../../DBConnection/Database");

const rankingQueries = {
  rankings: async (_, { weightClassId }) => {
    try {
      return await AppDataSource.getRepository("Ranking").find({
        where: { weightClassId },
        relations: ["fighter"],
        order: { position: "ASC" }
      });
    } catch (error) {
      throw new Error(`Failed to fetch rankings: ${error.message}`);
    }
  },
};

const rankingMutations = {
  updateRankings: async (_, { weightClassId }) => {
    try {
      const rankingRepo = AppDataSource.getRepository("Ranking");
      const fighterRepo = AppDataSource.getRepository("Fighter");

      // Get all fighters in this weight class
      const fighters = await fighterRepo.find({ where: { weightClassId } });

      // Sort them by some criteria (e.g., win-loss ratio)
      fighters.sort((a, b) => {
        const aRatio = a.wins / (a.wins + a.losses || 1);
        const bRatio = b.wins / (b.wins + b.losses || 1);
        return bRatio - aRatio;
      });

      // Create/update rankings
      const today = new Date().toISOString().split("T")[0];
      for (let i = 0; i < fighters.length; i++) {
        const existingRanking = await rankingRepo.findOne({
          where: {
            weightClassId,
            fighterId: fighters[i].id,
            date: today
          }
        });
        if (existingRanking) {
          existingRanking.position = i + 1;
          await rankingRepo.save(existingRanking);
        } else {
          const newRanking = rankingRepo.create({
            weightClassId,
            fighterId: fighters[i].id,
            position: i + 1,
            date: today
          });
          await rankingRepo.save(newRanking);
        }
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to update rankings: ${error.message}`);
    }
  },

  setRanking: async (_, { input }) => {
    try {
      const { weightClassId, fighterId, position, date } = input; // ✅ Extract input object

      const rankingRepo = AppDataSource.getRepository("Ranking");

      // Ensure the ranking is unique for the weight class, fighter, and date
      let ranking = await rankingRepo.findOne({
        where: { weightClassId, fighterId, date }
      });

      if (ranking) {
        ranking.position = position;
        await rankingRepo.save(ranking);
      } else {
        ranking = rankingRepo.create({ weightClassId, fighterId, position, date });
        await rankingRepo.save(ranking);
      }

      return ranking;
    } catch (error) {
      throw new Error(`Failed to set ranking: ${error.message}`);
    }
  },

  updateRankingsAfterFight: async (_, { fightId }, context) => {
    try {
      const fightRepo = AppDataSource.getRepository("Fight");
      const fight = await fightRepo.findOne({
        where: { id: fightId },
        relations: ["fighterA", "fighterB"]
      });
      if (!fight || !fight.winnerId) {
        throw new Error(`Fight with ID ${fightId} not found or missing winnerId`);
      }
      return await rankingMutations.updateRankings(_, { weightClassId: fight.weightClassId }, context);
    } catch (error) {
      throw new Error(`Failed to update rankings after fight: ${error.message}`);
    }
  },
};

const rankingFields = {
  weightClass: async (ranking) => {
    try {
      if (ranking.weightClass) return ranking.weightClass;
      return await AppDataSource.getRepository("WeightClass").findOne({
        where: { id: ranking.weightClassId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch weight class for ranking ${ranking.id}: ${error.message}`);
    }
  },
  fighter: async (ranking) => {
    try {
      if (ranking.fighter) return ranking.fighter;
      return await AppDataSource.getRepository("Fighter").findOne({
        where: { id: ranking.fighterId }
      });
    } catch (error) {
      throw new Error(`Failed to fetch fighter for ranking ${ranking.id}: ${error.message}`);
    }
  },
};

module.exports = {
  Query: rankingQueries,
  Mutation: rankingMutations,
  Ranking: rankingFields,
};
