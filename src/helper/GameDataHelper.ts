import { MapSchema } from "@colyseus/schema";
import { GameSkill } from "../skills/GameSkill";
import { FirebombSkill } from "../skills/mage/firebomb/FirebombSkill";
import { GamePlayerClass } from "../classes/GamePlayerClass";
import { MagicPulseSkill } from "../skills/mage/magicPulse/MagicPulseSkill";
import { PlayerMageClass } from "../classes/mage/PlayerMageClass";
import { FireballSkill } from "../skills/mage/fireball/FireballSkill";
import { GrenadeSkill } from "../skills/militar/grenade/GrenadeSkill";

function GameDataHelper(){

    function getGameSkills(){

        let gameSkillsMap = new MapSchema<GameSkill>();

        let firebombSkill = new FirebombSkill();
        gameSkillsMap.set(firebombSkill.gameSkill.skillIdentifier,firebombSkill.getGameSkill());


        let fireballSkill = new FireballSkill();
        gameSkillsMap.set(fireballSkill.gameSkill.skillIdentifier,fireballSkill.getGameSkill());

        let magicPulseSkill = new MagicPulseSkill();
        gameSkillsMap.set(magicPulseSkill.gameSkill.skillIdentifier,magicPulseSkill.getGameSkill());

        let militarGrenadeSkill = new GrenadeSkill();
        gameSkillsMap.set(militarGrenadeSkill.gameSkill.skillIdentifier,militarGrenadeSkill.getGameSkill());


        //add new skills here

        return gameSkillsMap;
    }



    function getGamePlayerClasses(){
        let gamePlayerClassesMap = new MapSchema<GamePlayerClass>();


        //add new classes here

        let playerMageClass = new PlayerMageClass();

    
        gamePlayerClassesMap.set(playerMageClass.getPlayerClass().classIdentifier,playerMageClass.getPlayerClass());

        return gamePlayerClassesMap;
    }

    return {
        gameSkills: getGameSkills(),
        gamePlayerClasses:getGamePlayerClasses()
    };
}

export default GameDataHelper;