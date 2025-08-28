import { Schema, type } from "@colyseus/schema";


export class GameSkill extends Schema  {
      @type("string") skillIdentifier: string;
      @type("number") cooldownMilliseconds: number;
      @type("number") maxDistance: number;
      
      @type("number") castMilliseconds: number;

      @type("boolean") stopCharacterMovementToCast: boolean;
      

      @type("string") requiresClassIdentifier: string | null;
      @type("string") skillType: 'MELEE' | 'THROWABLE' | 'SHOOTABLE';

      //projectile specific
      @type("number") projectileSpeed: number;
      @type("number") projectileWidth: number;
      @type("number") projectileHeight: number;

      //throwable specific
      @type("number") hitAOERadius: number;

      @type("number") hitAOEDamagingFieldDurationMilliseconds: number;
      @type("number") hitAOEDamagingFieldTicks: number; //if duration is 1000 milliseconds and damage  ticks is 10, then it will tick 1 time per 100 ms
      

      constructor() {
            super();
            this.skillIdentifier = ""; // default to empty string
            this.cooldownMilliseconds = 0; // default to 0
            this.castMilliseconds = 0; // default to 0
            this.stopCharacterMovementToCast = false; // default to null
            this.requiresClassIdentifier = null; // default to null
            this.skillType = 'MELEE';

            //projectile defualts
            this.projectileSpeed = 0.7; //default
            this.projectileWidth = 0.312;
            this.projectileHeight = 0.312;

            //throwable defaults
            this.hitAOERadius = 0;
            this.hitAOEDamagingFieldDurationMilliseconds = 0;
            this.hitAOEDamagingFieldTicks = 0;
      }
}