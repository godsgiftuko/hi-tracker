import { Injectable } from "@nestjs/common";
import { v1 as uuid } from "uuid";

@Injectable()
export class GeneratorService {
  public uuid(): string {
    return uuid();
  }

  public fileName(ext: string): string {
    return this.uuid() + "." + ext;
  }

  public otp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
}
