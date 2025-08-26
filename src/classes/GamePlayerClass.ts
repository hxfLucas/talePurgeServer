import { Schema, type } from "@colyseus/schema";
import { GameSkill } from "../skills/GameSkill";


export class GamePlayerClass extends Schema  {
      @type("string") classIdentifier: string;
      @type("string") basicAttackSkillIdentifier: string;
      
}