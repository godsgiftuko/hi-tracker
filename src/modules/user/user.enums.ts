export enum E_API_STATUS_CODE {
  ok = 200,
  created = 201,
  deleted = 301,
  // badRequest = 203
  badRequest = 400,
  notFound = 404,
  unAuthorized = 403,
  unProcessableEntity = 422,
}

export enum E_API_STATUS_MESSAGE {
  ok = 'Success!',
  created = 'Created!',
  deleted = 'Deleted!',
  updated = 'Updated!',
  failed = 'Failed!',
}

export enum E_CONTENT_TYPE {
  json = 'application/json',
}

export enum E_API_ERR {
  somethingW = 'Oops! Something went wrong',
  connectionErr = 'unable to connect',
  noUser = 'No users',
  notFound = 'Not found',
  unAuthorized = 'Access Denied to the resource!',
  wrongLogin = 'Incorrect login credentials',
  emailExist = 'Sorry! This email is already registered',
  unRecogEmail = 'Sorry! This email is not valid',
  invalidData = 'Sorry! Request is not valid',
  updateFailed = 'Sorry! Update failed. Please try again',
  unRecogEntity = 'Unrecognized entity',
  unProcessableData = 'Unprocessable data entry',
  farmExist = 'Sorry! A farm is already registered with this name',
  falsyUserClaim = 'Unrecognized access claim. Try re-authorizing',
}

export enum E_USER_ROLE {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
