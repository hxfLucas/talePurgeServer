import { MapSchema, Schema, type } from "@colyseus/schema";


export class Player extends Schema {

  @type("string") playerSessionId: string;

  //positioning
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;

  @type("number") movingSpeed: number;

  inputQueue: any[] = [];


}

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Player }) players = new MapSchema<Player>();
}
