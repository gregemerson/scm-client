
export class ScmErrors {
    static HttpError = 'HTTP_ERROR';
    static LoginError = "LOGIN_ERROR";
    static NoLocalCredentials = "NO_LOCAL_CREDENTIALS";
    static AuthRequired = 'AUTHORIZATION_REQUIRED';

    static get httpError(): IScmError {
        return {
            code: ScmErrors.HttpError,
            message: 'Could not communicate with the server'
        }
    }

    static get loginError(): IScmError {
        return {
            code: ScmErrors.LoginError,
            message: 'Invalid credentials'
        }
    }

    static get noLocalCredentials(): IScmError {
        return {
            code: ScmErrors.NoLocalCredentials,
            message: ''
        }
    }

    static get authRequired(): IScmError {
        return {
            code: ScmErrors.AuthRequired,
            message: 'Log in required'
        }
    }
}

export interface IScmError {
    code: string,
    message: string
}

export type ScmErrorList = Array<IScmError>;