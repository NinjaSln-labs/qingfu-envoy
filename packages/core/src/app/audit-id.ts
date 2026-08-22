export class AuditIdSeq {
  private seq = 0;

  constructor(private readonly prefix: string = "a") {}

  next(suffix: string): string {
    this.seq += 1;
    return `${this.prefix}${this.seq}_${suffix}`;
  }
}
