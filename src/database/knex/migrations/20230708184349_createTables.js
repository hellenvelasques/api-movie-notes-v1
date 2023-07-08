exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('avatar');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }).createTable('movie_notes', function(table) {
    table.increments('id').primary();
    table.text('title').notNullable();
    table.text('description');
    table.integer('rating');
    table.integer('user_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }).createTable('movie_tags', function(table) {
    table.increments('id').primary();
    table.text('name').notNullable();
    table.integer('user_id').references('id').inTable('users');
    table.integer('movie_note_id').references('id').inTable('movie_notes').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('movie_tags').dropTable('movie_notes').dropTable('users');
};