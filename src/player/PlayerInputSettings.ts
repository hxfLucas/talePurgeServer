import { Schema, type } from "@colyseus/schema";


export class PlayerInputSettings extends Schema  {

    //combination of code and key makes the "hotkey", this is to allow JS precision on keyboards
    @type("string") keyboardCodeSkillOne: string;
    @type("string") keyboardKeySkillOne: string;
}