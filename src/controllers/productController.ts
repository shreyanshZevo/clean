import { NextFunction, Request, Response } from "express";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { IDTO } from "../utils/IDTO";
import { EnumHttpStatusCode } from "../utils/enumHttpStatusCode";
import { ValidationError } from "../errors/validationError";

@injectable()
export class ProductController {
  private interactor: IProductInteractor;

  constructor(
    @inject(INTERFACE_TYPE.ProductInteractor) interactor: IProductInteractor
  ) {
    this.interactor = interactor;
  }

  async onCreateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      let dto: IDTO;
      const body = req.body;
      // validate logic
      if (!req.body.name) {
        /*HttpStatusCode 422 for validating the fields*/
        // resDTO = { status: "success", message: "User found", data: user };
        dto = {
          status: "error",
          statusCode: EnumHttpStatusCode.VALIDATION_ERROR_422,
          message: "Product Name is required",
          data: {},
        };
        throw new ValidationError("required", "ProductName");
        // return res.status(EnumHttpStatusCode.VALIDATION_ERROR_422).json({
        //   dto,
        // });
      }

      /*Start : Checking if product already exists */
      const existsResult = await this.interactor.checkProductByName(
        req.body.name
      );

      /*HttpStatusCode 409 for checking the conflicts or duplicate value*/
      dto = {
        status: "error",
        statusCode: EnumHttpStatusCode.DUPLICATE_DATA_409,
        message: `Product ${req.body.name} already exists`,
        data: { existsResult },
      };
      if (existsResult.count > 0) {
        return res.status(EnumHttpStatusCode.DUPLICATE_DATA_409).json({
          dto,
        });
      }
      /*End : Checking if product already exists */
      const result = await this.interactor.createProduct(body);
      /*HttpStatusCode 201 is for new resource created*/
      dto = {
        status: "success",
        statusCode: EnumHttpStatusCode.CREATED_201,
        message: "Product has been saved successfully",
        data: { result },
      };
      return res.status(EnumHttpStatusCode.CREATED_201).json({
        dto,
      });
    } catch (error) {
      next(error);
    }
  }
  async onGetProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const offset = parseInt(`${req.query.offset}`) || 0;
      const limit = parseInt(`${req.query.limit}`) || 10;

      const data = await this.interactor.getProducts(limit, offset);

      return res.status(200).json(data);
    } catch (error) {
      //next(error);
    }
  }
  async onUpdateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        !req.body.name ||
        !req.body.description ||
        !req.body.price ||
        !req.body.stock ||
        !req.body.id
      ) {
        return res.status(422).json({ error: "All fields are required" });
      }
      const resultCount = await this.interactor.checkProductById(req.body.id);
      //console.log(resultCount);

      if (resultCount.count == 0) {
        return res.status(404).json({
          statusCode: 404,
          messaage: "Product not found",
          data: resultCount,
        });
      }

      /*Start : Checking if product already exists */
      const existsResult = await this.interactor.checkProductByName(
        req.body.name
      );

      /*HttpStatusCode 409 for checking the conflicts or duplicate value*/
      if (existsResult.count > 0) {
        return res.status(409).json({
          statusCode: 409,
          messaage: `Product ${req.body.name} already exists`,
          data: existsResult,
        });
      }
      const body = req.body;

      const data = await this.interactor.updateProduct(body);

      return res.status(200).json({
        statusCode: 200,
        messaage: "Product has been updated successfully!",
        data: data,
      });
    } catch (error) {
      next(res.status(500).json({ error }));
    }
  }

  async onDeleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (id === 0) {
        return res.status(422).json({ error: "Product id is required" });
      }
      const resultCount = await this.interactor.checkProductById(id);
      console.log(resultCount);

      if (resultCount.count == 0) {
        return res.status(404).json({
          statusCode: 404,
          messaage: "Product not found",
          data: resultCount,
        });
      }
      const data = await this.interactor.deleteProduct(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
