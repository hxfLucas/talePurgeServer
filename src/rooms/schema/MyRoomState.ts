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

//temporary effects on the map
export class AOETriggeringEffect extends Schema{
  @type("string") skillIdentifier:number;
  @type("number") areaWidth:number;
  @type("number") areaHeight:number;
  @type("number") x:number;
  @type("number") y:number;
  @type("number") z:number;
}

//only needed server side because client side we alraedy get it from the metadata
export class ProjectileProperties extends Schema {
  @type("number") projectileSpeed:number;
  @type("number") projectileWidth:number;
  @type("number") projectileHeight:number;
  @type("string") projectileHitboxType:"CUBOID" | "SPHERE"; //to verify collisions, CUBOID is better performant, but for certain things dome is better

  @type("number") maxDistance:number;

  @type("number") hitAOERadius:number;
  @type("number") hitAOEDamagingFieldDurationMilliseconds:number;
  @type("number") hitAOEDamagingFieldTicks:number;



  
  
}

export class WhatWasHit{

  uniqueSessionId:string;
  hitReceiverType: null | 'PLAYER' | 'GROUND' | 'OBSTACLE' | 'NPC';
  playAnimationHit?:boolean;
  hitReceiverPlayerSessionId?: string;
  hitSenderPlayerSessionId?:string;
  hitSkillIdentifier?:string;
  hitCoordinatesX:number;
  hitCoordinatesY:number;
  hitCoordinatesZ:number;

  yGroundCoordinates:number;
  
  constructor() {
    this.uniqueSessionId = "wwh_" + Math.random() + "_" + Math.random();
  }
}

/* mostly for tracking which field is active , usefull for players that were not in the room before this was casted as this is only removed after the duration expires */
export class FieldEffect extends Schema {
  
  @type("string") uniqueSessionId: string;
  @type("string") originSkillIdentifier: string;
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  

  @type("number") dirX: number;
  @type("number") dirY: number;
  @type("number") dirZ: number;

  @type("number") heightEffectArea: number;
  @type("number") widthEffectArea: number;

  @type("string") fieldType: "DAMAGING" | "HEALING" | "JUST_VISUAL"; //mostly used to decide what animation to play on the field and the effect to hit on "players" in that area based on the originSkillIdentifier + fieldType

}


//ticks are only needed server side to calculate dmg, for the "visual effect" we use FieldEffect
export class FieldTickEffect{
  
    uniqueSessionId: string;
    originSkillIdentifier: string;
    ownerPlayerSessionId?:string;
    x: number;
    y: number;
    z: number;
    
    heightEffectArea: number;
    widthEffectArea: number;
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

  mapKeyProjectilePlayerHitPreventDoubleHits = new Map<string, boolean>(); //for projectiles that go through bodies, prevent hitting damage more times as it travels inside the player body, currently its only good for "projectileGoesThroughPlayers", this map has a key proj_sess_id + player_sess_id

  fieldTickEffects = new Map<string, FieldTickEffect>(); //no @type to avoid broadcasting ticks to the client
  @type({ map: FieldEffect }) fieldEffects = new MapSchema<FieldEffect>();

  @type(GameMap) mapData = new GameMap();
  @type(GameData) gameData = new GameData();
}
