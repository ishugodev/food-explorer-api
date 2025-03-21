import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
    table.enum("role", ["admin", "customer"]).notNullable().defaultTo("customer");
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}

