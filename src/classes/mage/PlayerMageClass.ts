

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GamePlayerClass } from "../GamePlayerClass";
import { MagicPulseSkill } from "../../skills/mage/magicPulse/MagicPulseSkill";


export class PlayerMageClass {

    playerClass: GamePlayerClass;

    

    constructor(){
        this.playerClass = new GamePlayerClass();
        this.playerClass.classIdentifier = "MAGE";
        this.playerClass.basicAttackSkill = new MagicPulseSkill().getGameSkill();
        
    }

    getPlayerClass(){
        return this.playerClass;
    }
  
   
  }