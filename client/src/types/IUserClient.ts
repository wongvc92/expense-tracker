export interface IUserClient {
  id: string;
  userName: string;
  email: string;
  name: string | null;
  role: string;
  profileImage: string | null;
  twoFactorEnabled: boolean;
  isOauth: boolean;
  balance: number;
  totalIncome: number;
}
