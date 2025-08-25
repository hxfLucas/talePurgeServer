

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameSkill } from "../../GameSkill";
import { PlayerMageClass } from "../../../classes/mage/PlayerMageClass";

export class FirebombSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = "FIREBALL_SKILL";
        this.gameSkill.cooldownMilliseconds = 3000;
        this.gameSkill.requiresClassIdentifier = new PlayerMageClass().getPlayerClass().classIdentifier;
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }