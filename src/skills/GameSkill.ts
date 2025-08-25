import { Schema, type } from "@colyseus/schema";


export class GameSkill extends Schema  {
      @type("string") skillIdentifier: string;
      @type("number") cooldownMilliseconds: number;

      @type("string") requiresClassIdentifier: string | null;
}