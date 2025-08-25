import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameMapObject } from "../../maps/Classes/GameMapObject";

export class GameMap extends Schema {

  @type("string") identifier: string;
  @type("string") name: string;
  @type("number") width: number;
  @type("number") height: number;
  @type([GameMapObject]) gameMapObjects = new ArraySchema<GameMapObject>();

}

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
  @type(GameMap) mapData = new GameMap();
}
