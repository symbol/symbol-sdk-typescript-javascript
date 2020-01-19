export class LockParams {
  constructor(
    public announceInLock: boolean,
    public transactionFee?: number | undefined,
  ) { }

  public static default() {
    return new LockParams(false)
  }
}
