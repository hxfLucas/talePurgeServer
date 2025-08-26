import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameMapObject } from "../../maps/Classes/GameMapObject";
import { GameSkill } from "../../skills/GameSkill";
import { GamePlayerClass } from "../../classes/GamePlayerClass";
import {  PlayerInputSettings } from "../../player/PlayerInputSettings";
import { PlayerUISettings } from "../../player/PlayerUISettings";

export class GameMap extends Schema {

  @type("string") identifier: string;
  @type("string") name: string;
  @type("number") width: number;
  @type("number") height: number;
  @type([GameMapObject]) gameMapObjects = new ArraySchema<GameMapObject>();

}

export class GameData extends Schema {

  @type({ map: GameSkill }) gameSkills = new MapSchema<GameSkill>();

}

export class Player extends Schema {

  @type("string") playerSessionId: string;

  //positioning
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;

  @type("number") lastSkillSlotSelected: number;

  @type("number") movingSpeed: number;

  @type(GamePlayerClass) playerClass: GamePlayerClass;

  @type(PlayerUISettings) playerUISettings: PlayerUISettings;
  @type(PlayerInputSettings) playerInputSettings: PlayerInputSettings;

  inputQueue: any[] = [];


}

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(GameMap) mapData = new GameMap();
  @type(GameData) gameData = new GameData();
}
