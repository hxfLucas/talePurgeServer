
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

  //---------- used to determinate if player is moving and which direction to play
  //this should not be used to anything besides telling the clients where players are moving towards to show the proper animation
  //when the player stops moving it doesnt reset to zero for a few milliseconds
  animMovingVectorX:number;
  animMovingVectorY:number;
  animMovingVectorZ:number;

  animStopMovingAfterTS:number;
  //---------------
  latestHash:any;

  
  //used to check for changes
  public static hashEntity(sendingPlayerJsonObject:any){
  
    const keysToHash = ["x", "y", "z", "yGroundRelative", "movingSpeed","animMovingVectorZ","animMovingVectorX","animMovingVectorY"];

    return keysToHash
      .map(key => `${sendingPlayerJsonObject[key] ?? "null"}`) // safely access, handle undefined
      .join(",");
  }

}
