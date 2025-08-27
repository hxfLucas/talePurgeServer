import { Schema, type } from "@colyseus/schema";


export class GameDataGlobal extends Schema  {

      //projectile specific
      @type("number") playerHitboxWidth: number = 0.45;
      @type("number") playerHitboxHeight: number = 1;//10;//1;
}