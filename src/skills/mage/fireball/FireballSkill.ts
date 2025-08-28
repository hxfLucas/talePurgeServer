

import GameDataPlayerClassIdentifiersHelper from "../../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import GameDataSkillsIdentifiersHelper from "../../../helper/identifiers/GameDataSkillsIdentifiersHelper";
import { GameSkill } from "../../GameSkill";

export class FireballSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = GameDataSkillsIdentifiersHelper().getFireballSkillIdentifier();
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 500;
        this.gameSkill.maxDistance = 10;
        this.gameSkill.projectileSpeed = 0.2;

        this.gameSkill.hitAOERadius = 5;
        this.gameSkill.hitAOEDamagingFieldDurationMilliseconds = 2000;
        this.gameSkill.hitAOEDamagingFieldTicks = 5;

        this.gameSkill.skillType = "THROWABLE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier();
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }