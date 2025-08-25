import { Schema, type } from "@colyseus/schema";


export class PlayerUISettings extends Schema  {


    // skill bar
    @type("string") skillBar_skillOneIdentifier: string | null;
    @type("string") skillBar_skillTwoIdentifier: string | null;
    @type("string") skillBar_skillThreeIdentifier: string | null;
    @type("string") skillBar_skillFourIdentifier: string | null;
    @type("string") skillBar_skillFiveIdentifier: string | null;
    @type("string") skillBar_skillSixIdentifier: string | null;
    @type("string") skillBar_skillSevenIdentifier: string | null;
    @type("string") skillBar_skillEightIdentifier: string | null;
    @type("string") skillBar_skillNineIdentifier: string | null;
}