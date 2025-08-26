

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GamePlayerClass } from "../GamePlayerClass";
import { MagicPulseSkill } from "../../skills/mage/magicPulse/MagicPulseSkill";
import GameDataPlayerClassIdentifiersHelper from "../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";


export class PlayerMageClass {

    playerClass: GamePlayerClass;

    

    constructor(){
        this.playerClass = new GamePlayerClass();
        this.playerClass.classIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier();
        this.playerClass.basicAttackSkill = new MagicPulseSkill().getGameSkill();
        
    }

    getPlayerClass(){
        return this.playerClass;
    }
  
   
  }