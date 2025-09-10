
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

  latestHash:any;

  
  //used to check for changes
  public static hashEntity(sendingPlayerJsonObject:any){
  
    const keysToHash = ["x", "y", "z", "yGroundRelative", "movingSpeed"];

    return keysToHash
      .map(key => `${sendingPlayerJsonObject[key] ?? "null"}`) // safely access, handle undefined
      .join(",");
  }

}
