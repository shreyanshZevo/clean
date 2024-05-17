export interface IProductInteractor {
  createProduct(input: any);
  updateProduct(input:any);
  getProducts(limit: number, offset: number);
  checkProductByName(name:string);
  checkProductById(id:number);
  deleteProduct(id:number);

}
