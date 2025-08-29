

import GameDataPlayerClassIdentifiersHelper from "../../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import GameDataSkillsIdentifiersHelper from "../../../helper/identifiers/GameDataSkillsIdentifiersHelper";
import { GameSkill } from "../../GameSkill";
export class MagicPulseSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = GameDataSkillsIdentifiersHelper().getMagicPulseSkillIdentifier();
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 500;
        this.gameSkill.maxDistance = 10;
        this.gameSkill.skillType = "PROJECTABLE_PROJECTILE";
        this.gameSkill.requiresClassIdentifier =  GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier();
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }