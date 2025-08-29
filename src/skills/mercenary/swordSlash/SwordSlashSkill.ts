

import GameDataPlayerClassIdentifiersHelper from "../../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import GameDataSkillsIdentifiersHelper from "../../../helper/identifiers/GameDataSkillsIdentifiersHelper";
import { GameSkill } from "../../GameSkill";

export class SwordSlashSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = GameDataSkillsIdentifiersHelper().getFireballSkillIdentifier();
        this.gameSkill.castMilliseconds = 150;
        this.gameSkill.cooldownMilliseconds = 150;
        this.gameSkill.maxDistance = 1;
   
        this.gameSkill.skillType = "MELEE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier();
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }