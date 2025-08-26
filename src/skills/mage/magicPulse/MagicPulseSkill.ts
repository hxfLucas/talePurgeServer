

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameSkill } from "../../GameSkill";
import { PlayerMageClass } from "../../../classes/mage/PlayerMageClass";

export class MagicPulseSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = "MAGIC_PULSE_SKILL";
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 500;
        this.gameSkill.skillType = "SHOOTABLE";
        this.gameSkill.requiresClassIdentifier =  "MAGE";
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }