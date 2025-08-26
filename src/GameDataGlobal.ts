import { Schema, type } from "@colyseus/schema";


export class GameDataGlobal extends Schema  {

      //projectile specific
      @type("number") playerHitboxWidth: number;
      @type("number") playerHitboxHeight: number;
}