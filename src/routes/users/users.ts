import {
  generateToken,
  getDataByEmail,
  validateEmail,
} from "../../helper/functions.js";
import messages from "../../helper/messages.js";
import user from "../../models/users.js";
import bcrypt from "bcrypt";

const userRegistration = async (body) => {
  try {
    const { firstName, lastName, email, password } = body;
    if (
      !firstName ||
      typeof firstName !== "string" ||
      !lastName ||
      typeof lastName !== "string" ||
      !email ||
      !password
    ) {
      return {
        message: messages.invalid.replace("##name##", "parameters"),
        code: 400,
      };
    }
    const data: any = await getDataByEmail(email, {
      _id: 1,
      email: 1,
      password: 1,
    });
    if (data) {
      return {
        message: messages.alreadyExists.replace("##name##", "user"),
        code: 400,
      };
    }
    const newUser = await new user({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    }).save();
    if (newUser) {
      return { code: 200 };
    }
    return { code: 400, message: messages.fail };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const userLogin = async (body) => {
  try {
    const { email, password } = body;
    if (!email || !password) {
      return {
        message: messages.invalid.replace("##name##", "parameters"),
        code: 400,
      };
    }
    const checkEmail = validateEmail(email);
    if (checkEmail.code === 400) {
      return checkEmail;
    }
    const data: any = await getDataByEmail(email, {
      _id: 1,
      email: 1,
      password: 1,
    });
    if (!data) {
      return {
        message: messages.notFound.replace("##name##", "user"),
        code: 400,
      };
    }
    const passwordValidation = await bcrypt.compare(password, data.password);
    if (!passwordValidation) {
      return { code: 400, messages: messages.fail };
    }
    delete data["password"];
    const token = await generateToken({ _id: data._doc._id });
    return {
      code: 200,
      data: {
        ...data._doc,
        accessToken: token,
      },
    };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

const getUserList = async (queryParams) => {
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
      whereCondition["first_name"] = {
        $regex: new RegExp(`${searchValue}`, "i"),
      };
    }
    let skip: number = 0;
    if (pageNumber && pageNumber > 0 && pageSize) {
      skip = (parseInt(`${pageNumber}`) - 1) * pageSize || 0;
    }
    const userList = await user
      .find(whereCondition)
      .select({ email: 1, first_name: 1, last_name: 1 })
      .skip(skip)
      .limit(pageSize || 10);
    if (userList.length > 0) {
      return { code: 200, message: messages.success, data: userList };
    }
    return {
      code: 200,
      message: messages.notFound.replace("##name##", "data"),
    };
  } catch (error) {
    return { code: 500, error: error.message };
  }
};

export { userRegistration, userLogin, getUserList };
