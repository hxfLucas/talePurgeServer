
import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { PlayerUISettings } from "../../../player/PlayerUISettings";
import { PlayerInputSettings } from "../../../player/PlayerInputSettings";

/*
Player is not a broadcasted state because it is conditionally broadcasted on the "AreaOfInterest"
*/
export class Player  {

  playerSessionId: string;

  //positioning, all clients
  /*@type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;*/
  x:number;
  y:number;
  z:number;

  /*@type("number") yGroundRelative:number; //the feet of the player

  @type("number") lastSkillSlotSelected: number;

  @type("number") movingSpeed: number;

  @type("string") playerClassIdentifier: string;*/
  yGroundRelative:number; //the feet of the player
  lastSkillSlotSelected: number;
  movingSpeed: number;
  playerClassIdentifier: string;
  
  //private send to the specific client on specific occasions

  //sent on join privately
  //playerUISettings: PlayerUISettings;
  //playerInputSettings: PlayerInputSettings;


  //server only
  inputQueue: any[] = [];
  latestInput:any = null;

}
