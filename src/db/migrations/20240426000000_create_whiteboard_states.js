exports.up = function(knex) {
  return knex.schema.createTable('whiteboard_states', (table) => {
    table.increments('state_id').primary();
    table.integer('classroom_id').unsigned().notNullable()
      .references('classroom_id').inTable('classrooms');
    table.json('state_data').notNullable();
    table.string('thumbnail_path', 255);
    table.integer('created_by').unsigned().notNullable()
      .references('user_id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('whiteboard_states');
}; 