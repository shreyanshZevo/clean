import { Pool } from "pg";
import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/IProductRepository";
import { pgClient } from "../config/dbConnection";
import { injectable } from "inversify";

import dotenv from "dotenv";

dotenv.config();

@injectable()
export class ProductRepository implements IProductRepository {
  private client: Pool;

  constructor() {
    this.client = pgClient();
  }

  async find(limit: number, offset: number): Promise<Product[]> {
    /*Start : Checking db connection for testing */
    //console.log('Before connect',`${process.env.DB_HOST} ${process.env.DB_NAME}`);
    //const client = await this.client.connect();
    //console.log('Connected!');
    /*End : Checking db connection for testing */

    const products = await this.client.query(
      `SELECT * FROM products OFFSET $1 LIMIT $2`,
      [offset, limit]
    );
    return products.rows;
  }
  async findById(id: number): Promise<Product[]> {
    const countResult = await this.client.query(
      `SELECT COUNT(*) FROM products WHERE id = $1`,
      [id]
    );
    return countResult.rows[0];
  }
  async findByName(name: string): Promise<Product[]> {
    const countResult = await this.client.query(
      `SELECT COUNT(*) FROM products WHERE name = $1`,
      [name]
    );
    return countResult.rows[0];
  }

  async create({ name, description, price, stock }: Product): Promise<Product> {
    const product = await this.client.query(
      `INSERT INTO products (name,description,price,stock) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, description, price, stock]
    );
    return product.rows[0];
  }
  async update({
    name,
    description,
    price,
    stock,
    id,
  }: Product): Promise<Product> {
    console.log(id);

    const product = await this.client.query(
      `UPDATE products SET name=$1,description=$2,price=$3,stock=$4 WHERE id=$5 RETURNING *`,
      [name, description, price, stock, id]
    );
    return product.rows[0];
  }

  async delete(id: number) {
    console.log("delete", `${id}`);

    const product = await this.client.query(
      `DELETE FROM products WHERE id = $1`,
      [id]
    );
    return product.rows[0];
  }
}
