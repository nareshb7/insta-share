export interface FormData {
    userName: string;
    roomId: string;
    roomName?: string;
    userPassword: string;
    roomPassword: string;
    isProtected: boolean,
    isNewUser?: boolean;
  }