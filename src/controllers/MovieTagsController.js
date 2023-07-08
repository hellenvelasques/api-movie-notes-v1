const knex = require('../database/knex');

class MovieTagsController {
  async list(request, respose) {
    const { user_id } = request.params;

    const movieTags = await knex("movie_tags")
    .where({ user_id })

    return respose.json(movieTags);
  }
}

module.exports = MovieTagsController;