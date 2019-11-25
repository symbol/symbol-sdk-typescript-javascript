import { NetworkType } from 'nem2-sdk';

export class CurrentAccount {
  constructor(
   public name: string,
   public password: string,
   public networkType: NetworkType,
  ) { }

  public static default() {
    return new CurrentAccount(null, null, null)
  }
}
