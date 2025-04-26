exports.up = function(knex) {
  return knex.schema.createTable('recordings', (table) => {
    table.increments('recording_id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.integer('classroom_id').unsigned().notNullable()
      .references('classroom_id').inTable('classrooms');
    table.integer('created_by').unsigned().notNullable()
      .references('user_id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recordings');
}; 