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

    function getGrenadeSkillIdentifier(){
        return "MILITAR_GRENADE_SKILL";
    }
    return {
        getFireballSkillIdentifier,
        getFirebombSkillIdentifier,
        getMagicPulseSkillIdentifier,
        getGrenadeSkillIdentifier
    };
}

export default GameDataSkillsIdentifiersHelper;