function GameDataSkillsIdentifiersHelper(){

    function getFirebombSkillIdentifier(){
        return "MAGE_FIRE_BOMB_SKILL";
    }

    function getFireballSkillIdentifier(){
        return "MAGE_FIRE_BALL_SKILL";
    }
    function getMagicPulseSkillIdentifier(){
        return "MAGE_MAGIC_PULSE_SKILL";
    }

    return {
        getFireballSkillIdentifier,
        getFirebombSkillIdentifier,
        getMagicPulseSkillIdentifier
    };
}

export default GameDataSkillsIdentifiersHelper;