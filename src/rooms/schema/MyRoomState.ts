import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameMapObject } from "../../maps/Classes/GameMapObject";
import { GameSkill } from "../../skills/GameSkill";
import { GamePlayerClass } from "../../classes/GamePlayerClass";
import {  PlayerInputSettings } from "../../player/PlayerInputSettings";
import { PlayerUISettings } from "../../player/PlayerUISettings";
import { GameDataGlobal } from "../../GameDataGlobal";

export class GameMap extends Schema {

  @type("string") identifier: string;
  @type("string") name: string;
  @type("number") width: number;
  @type("number") height: number;
  @type([GameMapObject]) gameMapObjects = new ArraySchema<GameMapObject>();

}

export class GameData extends Schema {

  @type({ map: GameSkill }) gameSkills = new MapSchema<GameSkill>();
  @type({ map: GamePlayerClass }) gamePlayerClasses = new MapSchema<GamePlayerClass>();
  @type(GameDataGlobal) gameDataGlobal = new GameDataGlobal();
  
}

//only needed server side because client side we alraedy get it from the metadata
export class ProjectileProperties extends Schema {
  @type("number") projectileSpeed:number;
  @type("number") projectileWidth:number;
  @type("number") projectileHeight:number;

  @type("number") maxDistance:number;
}
export class Projectile extends Schema {

  @type("string") uniqueSessionId: string;
  //todo ignore this startX Y Z and target and get it from player pos in the server side.
  //todo implement
  @type("number") startX: number;
  @type("number") startY: number;
  @type("number") startZ: number;

  @type("number") targetX: number;
  @type("number") targetY: number;
  @type("number") targetZ: number;

  //cur pos
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;


  @type("number") dirX: number;
  @type("number") dirY: number;
  @type("number") dirZ: number;

  @type("number") castedFromGroundY: number;

  @type("number") traveled: number = 0;

  @type("string") skillIdentifier: string;
  @type("string") ownerPlayerSessionId: string;


  @type(ProjectileProperties) projectileProperties: ProjectileProperties;

}

export class Player extends Schema {

  @type("string") playerSessionId: string;

  //positioning
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;

  @type("number") yGroundRelative:number; //the feet of the player

  @type("number") lastSkillSlotSelected: number;

  @type("number") movingSpeed: number;

  @type("string") playerClassIdentifier: string;
 

  @type(PlayerUISettings) playerUISettings: PlayerUISettings;
  @type(PlayerInputSettings) playerInputSettings: PlayerInputSettings;

  inputQueue: any[] = [];


}

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Player }) players = new MapSchema<Player>();
  
  @type({ map: Projectile }) projectiles = new MapSchema<Projectile>();

  @type(GameMap) mapData = new GameMap();
  @type(GameData) gameData = new GameData();
}
