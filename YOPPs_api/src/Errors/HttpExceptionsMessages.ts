
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
    InvalidCode = 'Invalid code',
    Expired = 'Token or code expired'
}
export enum UserPageExceptions {
    PageNotFound = 'Page not found',
    ImgNotFound = 'Image not found',
    NoFile = 'No file was uploaded',
    ExtensionNotAllowed = 'This file extension is not allowed '
}