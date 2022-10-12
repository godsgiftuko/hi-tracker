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
  ERR_CODE_DUPLICATE = 'ERR:DUPLICATE',
  ERR_CODE_NOT_FOUND = 'ERR:NOT_FOUND',
  ERR_CODE_INCORRECT_LOGIN = 'ERR:INCORRECT_LOGIN',
  somethingW = 'Oops! Something went wrong',
  manyRequest = 'Too many attempts.',
  connectionErr = 'Unable to connect',
  noUser = 'No users',
  notFound = 'Not found',
  unAuthorized = 'Access Denied to this resource!',
  wrongLogin = 'Incorrect login credentials',
  phoneExist = 'Sorry! This mobile number is already registered',
  unRecogPhone = 'Sorry! This mobile number is not valid',
  invalidData = 'Sorry! Request is not valid',
  unRecogEntity = 'Unrecognized entity',
  unProcessableData = 'Unprocessable data entry',
  walletExist = 'Sorry! A wallet with this currency exist on your account',
  falsyAccessClaim = 'Unrecognized access claim. Try re-authorizing',
  missingAdmin = 'Please set admin credentials in .env to proceed',
}

export enum E_USER_ROLE {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
