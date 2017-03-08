
export class ScmErrors {
    static HttpError = 'HTTP_ERROR';
    static LoginError = "LOGIN_ERROR";
    static NoLocalCredentials = "NO_LOCAL_CREDENTIALS";
    static AuthRequired = 'AUTHORIZATION_REQUIRED';

    static get httpError(): ScmError {
        return new ScmError(ScmErrors.HttpError, 'Could not communicate with the server');
    }
    static get loginError(): ScmError {
        return new ScmError(ScmErrors.LoginError, 'Invalid credentials');
    }
    static get noLocalCredentials(): ScmError {
        return new ScmError(ScmErrors.NoLocalCredentials, '');
    }
    static get authRequired(): ScmError {
        return new ScmError(ScmErrors.AuthRequired, 'Log in required');
    }
}

export class ScmError {
    constructor(public code: string, public message: string) {}
}

export class ScmErrorList extends Array<ScmError> {
}