export class IdNameObj {
  constructor(param: { name: any; id: any }) {
    this.id = param.id;
    this.name = param.name;
  }

  id: string;
  name: string;
}
