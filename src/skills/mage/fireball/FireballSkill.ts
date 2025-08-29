

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

        this.gameSkill.projectileGoesThroughPlayers = false;

        
        /*
        this.gameSkill.hitAOERadius = 5;
        this.gameSkill.hitAOEDamagingFieldDurationMilliseconds = 2000;
        this.gameSkill.hitAOEDamagingFieldTicks = 100;
        this.gameSkill.hitAOEDamagingFieldWidth = 10;
        this.gameSkill.hitAOEDamagingFieldHeight= 5;*/

        this.gameSkill.skillType = "PROJECTABLE_PROJECTILE";
        this.gameSkill.requiresClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier();
    }

    getGameSkill(){
        return this.gameSkill;
    }
  
   
  }