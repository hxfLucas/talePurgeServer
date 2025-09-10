import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
/* mostly for tracking which field is active , usefull for players that were not in the room before this was casted as this is only removed after the duration expires */
export class FieldEffect{
  
  uniqueSessionId: string;
  originSkillIdentifier: string;
  x: number;
  y: number;
  z: number;
  

  dirX: number;
  dirY: number;
  dirZ: number;

  heightEffectArea: number;
  widthEffectArea: number;

  fieldType: "DAMAGING" | "HEALING" | "JUST_VISUAL"; //mostly used to decide what animation to play on the field and the effect to hit on "players" in that area based on the originSkillIdentifier + fieldType


  //used to check for changes
  public static hashEntity(sendingPlayerJsonObject:any){
    const keysToHash = ["x", "y", "z", "dirX", "dirY", "dirZ", "heightEffectArea", "widthEffectArea"];
    return keysToHash
      .map(key => `${sendingPlayerJsonObject[key] ?? "null"}`) // safely access, handle undefined
      .join(",");
  }
  

}