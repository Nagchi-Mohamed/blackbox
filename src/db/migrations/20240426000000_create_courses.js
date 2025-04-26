exports.up = function(knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('course_id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.integer('created_by').unsigned()
      .references('user_id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('courses');
}; 