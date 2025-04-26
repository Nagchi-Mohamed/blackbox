exports.up = function(knex) {
  return knex.schema.createTable('classrooms', (table) => {
    table.increments('classroom_id').primary();
    table.string('name', 255).notNullable();
    table.text('description');
    table.integer('course_id').unsigned().notNullable()
      .references('course_id').inTable('courses');
    table.integer('created_by').unsigned().notNullable()
      .references('user_id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('classrooms');
}; 