import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("dishes", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("category").notNullable();
    table.float("price").notNullable();
    table.text("description").notNullable();
    table.text("image");
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("dishes");
}

