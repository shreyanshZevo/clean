import { Product } from "../entities/Product";

export interface IProductRepository {
  create(data: Product): Promise<Product>;
  update(data:Product): Promise<Product>;
  find(limit: number, offset: number): Promise<Product[]>;
  findById(id:number):Promise<Product[]>;
  findByName(name:string):Promise<Product[]>;
  delete(id:number):any;

}
