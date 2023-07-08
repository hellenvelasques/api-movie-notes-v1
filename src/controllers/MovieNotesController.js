const knex = require('../database/knex');
const AppError = require("../utils/AppError");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    if (rating < 1 || rating > 5) {
      throw new AppError(`O valor do campo 'rating' deve estar entre 1 e 5.`);
    }

    const [movie_note_id] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id
    });
    
    const tagsInsert = tags.map(name => {
      return {
        movie_note_id,
        name,
        user_id
      };
    });
    
    await knex('movie_tags').insert(tagsInsert);

    response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("movie_notes").where({ id }).first();
    const tags = await knex("movie_tags").where({ movie_note_id: id }).orderBy("name");
    
    return response.json({
      ...note,
      tags
    });
  };

  async index(request, response) {
    const { user_id, title, tags } = request.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim());

      notes = await knex("MovieTags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.user_id",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("movie_notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("movie_notes", "movie_notes.id", "tags.note_id")
        .orderBy("movie_notes.title")

    } else {
      notes = await knex("movie_notes") 
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy( "title" );
    }

    const userTags = await knex("movie_tags").where({ user_id });
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });

    return response.json(notesWithTags);
  }
    
  async delete(request, response) {
    const { id } = request.params;

    const notes = await knex("movie_notes").where("id", id);

    if (notes.length === 0) {
      throw new AppError("Nota não encontrada!", 404);
    }

    await knex("movie_notes").where({ id }).delete();

    return response.json();
  };
};

module.exports = MovieNotesController;