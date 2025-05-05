export const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}` ;

export const VERIFY_USER_ROUTE = `${BASE_URL}auth/verify`;
export const LOGIN_ROUTE = `${BASE_URL}auth/login/`;
export const PRE_SIGNUP_ROUTE = `${BASE_URL}auth/register/pre`;
export const OTP_ROUTE = `${BASE_URL}auth/register/otp`;
export const SIGNUP_ROUTE = `${BASE_URL}auth/register`;

export const ACCOUNT_ROUTE = `${BASE_URL}accounts/account`;
export const DETAILS_ROUTE = `${BASE_URL}transactions/details`;
export const TRANSACTION_ROUTE = `${BASE_URL}transactions/transaction`;
export const CATEGORIES_ROUTE = `${BASE_URL}categories/category`;
