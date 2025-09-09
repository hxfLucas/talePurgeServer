

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

        
        //keep the field burning for 2 seconds
        this.gameSkill.hitAOERadius = 5;
        this.gameSkill.hitAOEDamagingFieldDurationMilliseconds = 2000;
        this.gameSkill.hitAOEDamagingFieldTicks = 100;
        this.gameSkill.hitAOEDamagingFieldWidth = 10;
        this.gameSkill.hitAOEDamagingFieldHeight= 5;
        //---
        this.gameSkill.skillType = "PROJECTABLE_THROWABLE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier()
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }