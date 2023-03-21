import messages from "./messages.js";

const commonResponse = (responseData: any, res: any) => {
  try {
    const {
      code,
      error,
      data,
      message,
    }: { code: number; error: string; data: any; message: string } =
      responseData;
    let returnResponse: {
      code: number;
      message: string;
      error?: string;
      data?: any;
    } = {
      code,
      message: "",
    };
    switch (code) {
      case 400:
        returnResponse = {
          ...returnResponse,
          message: message || messages.fail,
        };
        break;
      case 200:
        returnResponse = {
          ...returnResponse,
          message: message || messages.success,
        };
        break;
      case 500:
        returnResponse = {
          ...returnResponse,
          message: messages.somethingWentWrong,
          error,
        };
        break;
      default:
        returnResponse = {
          ...returnResponse,
          message: message || messages.fail,
        };
        break;
    }
    if (data) {
      returnResponse = { ...returnResponse, data };
    }
    return res.status(code).send(returnResponse);
  } catch (error) {
    return res
      .status(500)
      .send({
        code: 500,
        message: messages.somethingWentWrong,
        error: error.message,
      });
  }
};

export { commonResponse };
