import messages from "../../helper/messages.js";
import product from "../../models/products.js";
import { sendDataToClients } from "../../socket/socket.js";

const productAdd = async (body) => {
  try {
    const {
      name,
      price,
      description,
    }: { name: string; price: number; description: string } = body;
    if (!name || typeof name !== "string" || !price) {
      return {
        message: messages.invalid.replace("##name##", "parameters"),
        code: 400,
      };
    }
    const newProduct = await new product({
      name: name,
      price,
      description,
    }).save();
    if (newProduct) {
        sendDataToClients(newProduct);
      return { code: 200 };
    }
    return { code: 400, message: messages.fail };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const getProducts = async (queryParams: any) => {
  try {
    const {
      searchText,
      pageNumber,
      pageSize,
    }: { searchText: String; pageNumber: number; pageSize: number } =
      queryParams;
    let whereCondition = {};
    if (searchText) {
      let searchValue: String = searchText;
      searchValue = ".*" + searchValue + ".*";
      whereCondition["name"] = {
        $regex: new RegExp(`${searchValue}`, "i"),
      };
    }
    let skip: number = 0;
    if (pageNumber && pageNumber > 0 && pageSize) {
      skip = (parseInt(`${pageNumber}`) - 1) * pageSize || 0;
    }
    const productList = await product
      .find({ ...whereCondition, status: true })
      .skip(skip)
      .limit(pageSize || 10);
    if (productList.length > 0) {
      return { code: 200, message: messages.success, data: productList };
    }
    return {
      code: 200,
      message: messages.notFound.replace("##name##", "data"),
    };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const getProduct = async (queryParams: any) => {
  try {
    const { productId }: { productId: String } = queryParams;
    if (!productId) {
      return {
        code: 400,
        message: messages.invalid.replace("##name##", "parameter"),
      };
    }
    const productList = await product.find({ _id: productId, status: true });
    if (productList.length > 0) {
      return { code: 200, message: messages.success, data: productList };
    }
    return {
      code: 200,
      message: messages.notFound.replace("##name##", "data"),
    };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const updateProduct = async (
  body: { name: string; description: string; price: number },
  queryData
) => {
  try {
    const { productId }: { productId: string } = queryData;
    if (!productId) {
      return {
        code: 400,
        message: messages.invalid.replace("##name##", "parameter"),
      };
    }
    const updatedProduct = await product.findByIdAndUpdate(productId, body, {
      new: true,
    });
    if (updatedProduct) {
        sendDataToClients(updateProduct);

      return { code: 200, message: messages.success, data: updatedProduct };
    }
    return { code: 400, message: messages.fail };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const deleteProduct = async (queryData) => {
  try {
    const { productId }: { productId: string } = queryData;
    if (!productId) {
      return {
        code: 400,
        message: messages.invalid.replace("##name##", "parameter"),
      };
    }
    const findProduct = await product.findOne({ _id: productId, status: true });
    if (!findProduct) {
      return {
        code: 200,
        message: messages.notFound.replace("##name##", "data"),
      };
    }
    const deletedProduct = await product.findByIdAndUpdate(productId, {
      status: false,
    });
    if (deletedProduct) {
      return { code: 200, message: messages.success, data: deletedProduct };
    }
    return { code: 400, message: messages.fail };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};
export { productAdd, getProducts, getProduct, updateProduct, deleteProduct };
