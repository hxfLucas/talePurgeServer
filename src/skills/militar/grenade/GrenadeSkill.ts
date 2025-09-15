

import GameDataPlayerClassIdentifiersHelper from "../../../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import GameDataSkillsIdentifiersHelper from "../../../helper/identifiers/GameDataSkillsIdentifiersHelper";
import { GameSkill } from "../../GameSkill";
export class GrenadeSkill {

    gameSkill: GameSkill;

    

    constructor(){
        this.gameSkill = new GameSkill();
        this.gameSkill.skillIdentifier = GameDataSkillsIdentifiersHelper().getGrenadeSkillIdentifier();
        this.gameSkill.castMilliseconds = 250;
        this.gameSkill.cooldownMilliseconds = 3000;
        this.gameSkill.maxDistance = 20;

        this.gameSkill.projectileEnableHitVisualEffect = false;

        this.gameSkill.projectileSpeed = 0.2;

        this.gameSkill.allowSelfInflictingDamage = false;
        //todo separate self inflict damage from allow "self collide"
        
        //keep the field burning for 2 seconds
        this.gameSkill.hitAOERadius = 2.5;
        this.gameSkill.hitAOEDamagingFieldDurationMilliseconds = 1000;
        this.gameSkill.hitAOEDamagingFieldTicks = 1;
        this.gameSkill.hitAOEDamagingFieldWidth = 5;
        this.gameSkill.hitAOEDamagingFieldHeight= 5;
       
        //---
        this.gameSkill.skillType = "PROJECTABLE_THROWABLE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier()
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }