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

      constructor() {
            super();
            this.skillIdentifier = ""; // default to empty string
            this.cooldownMilliseconds = 0; // default to 0
            this.castMilliseconds = 0; // default to 0
            this.stopCharacterMovementToCast = false; // default to null
            this.requiresClassIdentifier = null; // default to null
            this.skillType = 'MELEE';

            this.projectileSpeed = 0.7; //default
      }
}