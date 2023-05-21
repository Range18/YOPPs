
export enum AuthExceptions {
    UserAlreadyExists = 'That user is already exits',
    UserNotFound = 'User not found',
    WrongPassword = 'Wrong Password',
    IncorrectEmail = 'Incorrect email type',
    IncorrectPassword = 'Incorrect password type',
    InvalidActivationURL = 'Invalid activation URL',
    InvalidToken = 'Invalid token',
    NotActivated = 'User is not activated'
}

export enum UserPageExceptions {
    PageNotFound = 'Page not found',
}