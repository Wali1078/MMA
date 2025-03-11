const { AppDataSource } = require("../../DBConnection/Database");

const eventQueries = {
  event: async (_, { id }) => {
    try {
      const event = await AppDataSource.getRepository("Event").findOne({
        where: { id },
        relations: ["fights"]
      });
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  },
  events: async () => {
    try {
      return await AppDataSource.getRepository("Event").find();
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  },
  upcomingEvents: async () => {
    try {
      return await AppDataSource.getRepository("Event").find({
        where: { status: "upcoming" },
        order: { date: "ASC" }
      });
    } catch (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }
  },
};

const eventMutations = {
  createEvent: async (_, { input }) => {
    try {
      const repository = AppDataSource.getRepository("Event");
      const event = repository.create(input);
      return await repository.save(event);
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  },
  updateEvent: async (_, { id, input }) => {
    try {
      const repository = AppDataSource.getRepository("Event");
      const event = await repository.findOne({ where: { id } });
      if (!event) throw new Error(`Event with ID ${id} not found`);
      repository.merge(event, input);
      return await repository.save(event);
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  },
  deleteEvent: async (_, { id }) => {
    try {
      const result = await AppDataSource.getRepository("Event").delete(id);
      if (result.affected === 0) {
        throw new Error(`Event with ID ${id} not found or could not be deleted`);
      }
      return true;
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  },
};

const eventFields = {
  fights: async (event) => {
    try {
      if (event.fights) return event.fights;
      return await AppDataSource.getRepository("Fight").find({
        where: { eventId: event.id }
      });
    } catch (error) {
      throw new Error(`Failed to fetch fights for event: ${error.message}`);
    }
  },
};

module.exports = {
  Query: eventQueries,
  Mutation: eventMutations,
  Event: eventFields,
};
