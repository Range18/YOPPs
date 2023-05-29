//TODO add more exception
export enum AuthExceptions {
    UserAlreadyExists = 'That user is already exits',
    UserNotFound = 'User not found',
    UserIsUnauthorized = 'User is unauthorized',
    WrongPassword = 'Wrong Password',
    IncorrectEmail = 'Incorrect email type',
    IncorrectPassword = 'Incorrect password type',
    NotActivated = 'User is not activated'
}
export enum TokenExceptions {
    InvalidActivationURL = 'Invalid activation URL',
    InvalidToken = 'Invalid token',
}
export enum UserPageExceptions {
    PageNotFound = 'Page not found',
    ImgNotFound = 'Image not found',
    NoFile = "NoFile"
}