import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
/* mostly for tracking which field is active , usefull for players that were not in the room before this was casted as this is only removed after the duration expires */
export class FieldEffect extends Schema {
  
  @type("string") uniqueSessionId: string;
  @type("string") originSkillIdentifier: string;
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  

  @type("number") dirX: number;
  @type("number") dirY: number;
  @type("number") dirZ: number;

  @type("number") heightEffectArea: number;
  @type("number") widthEffectArea: number;

  @type("string") fieldType: "DAMAGING" | "HEALING" | "JUST_VISUAL"; //mostly used to decide what animation to play on the field and the effect to hit on "players" in that area based on the originSkillIdentifier + fieldType

}