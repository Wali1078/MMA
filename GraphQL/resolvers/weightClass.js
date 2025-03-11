const { AppDataSource } = require("../../DBConnection/Database");

const weightClassQueries = {
  weightClass: async (_, { id }) => {
    try {
      const weightClass = await AppDataSource.getRepository("WeightClass").findOne({
        where: { id }
      });
      if (!weightClass) {
        throw new Error(`WeightClass with ID ${id} not found`);
      }
      return weightClass;
    } catch (error) {
      throw new Error(`Failed to fetch weight class: ${error.message}`);
    }
  },
  weightClasses: async () => {
    try {
      return await AppDataSource.getRepository("WeightClass").find();
    } catch (error) {
      throw new Error(`Failed to fetch weight classes: ${error.message}`);
    }
  },
};

const weightClassMutations = {
  createWeightClass: async (_, { input }) => {
    try {
      const repository = AppDataSource.getRepository("WeightClass");
      const weightClass = repository.create(input);
      return await repository.save(weightClass);
    } catch (error) {
      throw new Error(`Failed to create weight class: ${error.message}`);
    }
  },
  updateWeightClass: async (_, { id, input }) => {
    try {
      const repository = AppDataSource.getRepository("WeightClass");
      const weightClass = await repository.findOne({ where: { id } });
      if (!weightClass) {
        throw new Error(`WeightClass with ID ${id} not found`);
      }
      repository.merge(weightClass, input);
      return await repository.save(weightClass);
    } catch (error) {
      throw new Error(`Failed to update weight class: ${error.message}`);
    }
  },
  deleteWeightClass: async (_, { id }) => {
    try {
      const result = await AppDataSource.getRepository("WeightClass").delete(id);
      if (result.affected === 0) {
        throw new Error(`WeightClass with ID ${id} not found or could not be deleted`);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete weight class: ${error.message}`);
    }
  },
};

const weightClassFields = {
  fighters: async (weightClass) => {
    try {
      return await AppDataSource.getRepository("Fighter").find({
        where: { weightClassId: weightClass.id }
      });
    } catch (error) {
      throw new Error(`Failed to fetch fighters for weight class ${weightClass.id}: ${error.message}`);
    }
  },
  rankings: async (weightClass) => {
    try {
      return await AppDataSource.getRepository("Ranking").find({
        where: { weightClassId: weightClass.id },
        order: { position: "ASC" }
      });
    } catch (error) {
      throw new Error(`Failed to fetch rankings for weight class ${weightClass.id}: ${error.message}`);
    }
  },
};

module.exports = {
  Query: weightClassQueries,
  Mutation: weightClassMutations,
  WeightClass: weightClassFields,
};
