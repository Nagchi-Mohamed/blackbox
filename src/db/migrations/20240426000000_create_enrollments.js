exports.up = function(knex) {
  return knex.schema.createTable('enrollments', (table) => {
    table.increments('enrollment_id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('user_id').inTable('users');
    table.integer('course_id').unsigned().notNullable()
      .references('course_id').inTable('courses');
    table.timestamp('enrolled_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'course_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enrollments');
}; 