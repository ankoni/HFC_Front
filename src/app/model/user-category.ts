export class UserCategory {
  id: string;
  name: string;
  parent?: boolean;
  children?: UserCategory[];
  editing?: boolean;
}
