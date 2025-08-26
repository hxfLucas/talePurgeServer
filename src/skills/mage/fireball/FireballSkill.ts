

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameSkill } from "../../GameSkill";
import { PlayerMageClass } from "../../../classes/mage/PlayerMageClass";

export class FireballSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = "FIREBALL_SKILL";
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 500;
        this.gameSkill.skillType = "SHOOTABLE";
        this.gameSkill.requiresClassIdentifier = new PlayerMageClass().getPlayerClass().classIdentifier;
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }