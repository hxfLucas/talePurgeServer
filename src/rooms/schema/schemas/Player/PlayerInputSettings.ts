import { Schema, type } from "@colyseus/schema";


/*
key and code explanation:
this is to allow JS precision on keyboards

For example when pressing 1 in the numbers, JS reports,  "key" is "1" and code is "Digit1"
however when pressing 1 in the numpad, JS reports, "key" is "1" and code is "Numpad1"
To know to which key and code each key belongs to activate: debuggerKeyPresses in the client side
*/
export class PlayerInputSettings {

    //combination of code and key makes the "hotkey", this is to allow JS precision on keyboards
    keyboardCodeSkillOne: string;
    keyboardKeySkillOne: string;



    keyboardCodeAlternativeCameraZoomIn: string | null;
    keyboardKeyAlternativeCameraZoomIn: string | null;


    keyboardCodeAlternativeCameraZoomOut: string | null;
    keyboardKeyAlternativeCameraZoomOut: string | null;
}