export class AccountConstraints {
    static userNameMin = 5;
    static userNameMax = 20;
    static userNameRegEx = /^[A-Za-z0-9]*$/i;
    static passWordRegEx = /^[A-Za-z0-9?!@#$%^&*]*$/i;
    static passWordChars = 'letters, numerals, !, @, #, $, %, ^, & or *';
    static passWordMin = 8;
    static passWordMax = 16;
    static emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
}