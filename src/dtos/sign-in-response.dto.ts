export class SignInResponseDTO {
  user: {
    remainingBalance: number;
    id: string;
  };
  token: string;
}
