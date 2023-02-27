enum ErrorCode {
    ServerError = 'SERVER_ERROR',
    Unauthorized = 'UNAUTHORIZED',
    ValidationError = 'VALIDATION_ERROR',
    Forbidden = 'FORBIDDEN',
    UserWithThisEmailAlreadyExists = 'USER_WITH_THIS_EMAIL_ALREADY_EXISTS',
    UserNotFound = 'USER_NOT_FOUND',
    PostNotFound = 'POST_NOT_FOUND',
    IncorrectPassword = 'INCORRECT_PASSWORD',
    TokenNotExists = 'TOKEN_NOT_EXISTS'
}

export default ErrorCode