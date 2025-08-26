import { MapSchema } from "@colyseus/schema";
import { GameSkill } from "../skills/GameSkill";
import { FirebombSkill } from "../skills/mage/firebomb/FirebombSkill";
import { GamePlayerClass } from "../classes/GamePlayerClass";
import { MagicPulseSkill } from "../skills/mage/magicPulse/MagicPulseSkill";

function GameDataHelper(){

    function getGameSkills(){

        let gameSkillsMap = new MapSchema<GameSkill>();

        //add new skills here
        let firebombSkill = new FirebombSkill();
        gameSkillsMap.set(firebombSkill.gameSkill.skillIdentifier,firebombSkill.getGameSkill());

        return gameSkillsMap;
    }

    function getGamePlayerClasses(){
        let gamePlayerClassesMap = new MapSchema<GamePlayerClass>();


        //add new classes here

        let playerMageClass = new GamePlayerClass();
        playerMageClass.classIdentifier = "MAGE";
        playerMageClass.basicAttackSkill = new MagicPulseSkill().getGameSkill();
    
        gamePlayerClassesMap.set(playerMageClass.classIdentifier,playerMageClass);

        return gamePlayerClassesMap;
    }

    return {
        gameSkills: getGameSkills(),
        gamePlayerClasses:getGamePlayerClasses()
    };
}

export default GameDataHelper;