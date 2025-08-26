

import GameDataPlayerClassIdentifiersHelper from "../../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import GameDataSkillsIdentifiersHelper from "../../../helper/identifiers/GameDataSkillsIdentifiersHelper";
import { GameSkill } from "../../GameSkill";
export class FirebombSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = GameDataSkillsIdentifiersHelper().getFirebombSkillIdentifier();
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 3000;
        this.gameSkill.maxDistance = 20;
        this.gameSkill.skillType = "SHOOTABLE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier()
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }