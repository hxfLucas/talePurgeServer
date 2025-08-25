import { Schema, type } from "@colyseus/schema";


export class PlayerClass extends Schema  {
      @type("string") classIdentifier: string;
      
}