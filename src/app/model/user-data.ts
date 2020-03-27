export class UserData {
  id?: string;
  name: string;
  regDate: Date;
}

export class EditUserDto {
  name: string;
  currentPassword: string;
  newPassword: string;
}

export class UserRegDto {
  name: string;
  password: string;
}
