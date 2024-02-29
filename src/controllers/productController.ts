import { IProduct } from "../interface/utilInterface";
import ProductService from "../services/productService";
const productService = new ProductService();
import { Request, Response } from "express";
import env from "../config/serverConfig";
import { createChannel, publishMessage } from "../services/queueService";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: IProduct = {
      name: req.body.name,
      user_id: req.params.id,
      url: req.body.url,
      tags: req.body.tags,
      currencySymbol: req.body.currencySymbol,
      company: req.body.company,
      start_price: Number(req.body.price),
      desired_price: Number(req.body.desired_price) ?? 0,
      prices: req.body.prices ?? [
        JSON.stringify({ price: Number(100), date: new Date() }),
      ],
      description: req.body.description ?? "",
      trackable: Boolean(req.body.trackable) ?? false,
      photos: req.body.photos,
    };
    console.log(productData);
    const _product = await productService.createProduct(productData);
    return res.status(201).json({
      message: "SuccessFully created the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to create the product",
      success: false,
      err: error,
      data: "",
    });
  }
};

export const processProductRequest = async (req: Request, res: Response) => {
  try {
    const channel = await createChannel();
    const user_id = req.params.id;
    console.log(req.body);

    let productData = {
      user_id,
      ...req.body,
    };
    console.log(productData);

    await publishMessage(channel, env.BINDING_KEY, productData);
    return res.status(200).json({
      message: "Your request is queued for processing",
      success: true,
      err: "",
      data: productData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      err: error,
      data: "",
    });
  }
};

export const getProductbyId = async (req: Request, res: Response) => {
  try {
    const productId: string = req.params.id;
    const _product = await productService.getProductbyId(productId);
    return res.status(201).json({
      message: "SuccessFully fetched the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to fetch the product",
      success: false,
      err: error,
      data: "",
    });
  }
};
export const getProductbyIdOfUser = async (req: Request, res: Response) => {
  try {
    const userId: string = req.query.id as string;
    console.log(userId);
    const _product = await productService.getProductbyIdOfUser(userId);
    return res.status(201).json({
      message: "SuccessFully fetched the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to fetch the product",
      success: false,
      err: error,
      data: "",
    });
  }
};
export const getTrackableProductbyIdOfUser = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.query.userId as string;
    const _product = await productService.getTrackableProductbyIdOfUser(userId);
    return res.status(201).json({
      message: "SuccessFully fetched the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to fetch the product",
      success: false,
      err: error,
      data: "",
    });
  }
};
export const updatePriceOfProduct = async (req: Request, res: Response) => {
  try {
    const price = req.body.price;
    const productId = req.params.id;
    const priceWithTime = {
      price,
      date: new Date(),
    };
    const _product = await productService.updatePriceOfProduct(
      productId,
      priceWithTime
    );
    return res.status(201).json({
      message: "SuccessFully created the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to update the product",
      success: false,
      err: error,
      data: "",
    });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const _product = await productService.deleteProduct(productId);
    return res.status(201).json({
      message: "SuccessFully deleted the Product",
      success: true,
      err: "",
      data: _product,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Something went wrong!! not able to delete the product",
      success: false,
      err: error,
      data: "",
    });
  }
};
