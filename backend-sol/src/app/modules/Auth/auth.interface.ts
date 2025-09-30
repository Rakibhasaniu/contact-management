export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  otherEmails?: string[];
  contacts?: Array<{
    phoneNumber: string;
    alias: string;
  }>;
};