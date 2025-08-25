import { MapSchema } from "@colyseus/schema";
import { GameSkill } from "../skills/GameSkill";
import { FirebombSkill } from "../skills/mage/firebomb/FirebombSkill";

function GameDataHelper(){

    function getGameSkills(){

        let gameSkillsMap = new MapSchema<GameSkill>()

        //add new skills here
        let firebombSkill = new FirebombSkill();
        gameSkillsMap.set(firebombSkill.gameSkill.skillIdentifier,firebombSkill.getGameSkill());

        return gameSkillsMap;
    }

    return {
        gameSkills: getGameSkills()
    };
}

export default GameDataHelper;