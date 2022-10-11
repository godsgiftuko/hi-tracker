import {
  E_API_STATUS_CODE,
  E_CONTENT_TYPE,
  E_API_STATUS_MESSAGE,
  HttpRequest,
} from '../schemas';



export const httpAdapter = async ({ url, headers, baseUrl }: HttpRequest) => {
  try {
    return {
      headers: {
        contentType: E_CONTENT_TYPE.json,
      },
      statusCode: '',
      body: {
        message: E_API_STATUS_MESSAGE.ok,
        data: {},
      },
    };
  } catch (e: any) {
    // TODO: Error logging
    return {
      headers: {
        contentType: E_CONTENT_TYPE.json,
      },
      statusCode:
        e === E_API_STATUS_CODE.notFound
          ? E_API_STATUS_CODE.notFound
          : E_API_STATUS_CODE.unAuthorized,
      body: {
        message: E_API_STATUS_MESSAGE.failed,
        error: e?.message || e,
      },
    };
  }
};
