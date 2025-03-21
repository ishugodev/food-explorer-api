import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("ingredients", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.integer("dish_id").references("id").inTable("dishes");
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("ingredients");
}
