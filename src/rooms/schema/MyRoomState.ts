import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { GameMapObject } from "../../maps/Classes/GameMapObject";
import { GameSkill } from "../../skills/GameSkill";
import { GamePlayerClass } from "../../classes/GamePlayerClass";
import {  PlayerInputSettings } from "./schemas/Player/PlayerInputSettings";
import { PlayerUISettings } from "./schemas/Player/PlayerUISettings";
import { GameDataGlobal } from "../../GameDataGlobal";
import { Projectile } from "./schemas/Projectile/Projectile";
import { Player } from "./schemas/Player/Player";
import { FieldEffect } from "./schemas/FieldEffect/FieldEffect";
import { AOIMetaData } from "./schemas/AOIMetaData";

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



export class WhatWasHit{

  uniqueSessionId:string;
  hitReceiverType: null | 'PLAYER' | 'GROUND' | 'OBSTACLE' | 'NPC';
  playAnimationHit?:boolean;
  hitReceiverPlayerSessionId?: string;
  hitReceiverObjectSessionId?: string;
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


export class MeleeStrike extends Schema {

  @type("string") uniqueSessionId: string;


  //cur pos
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;


  @type("number") dirX: number;
  @type("number") dirY: number;
  @type("number") dirZ: number;

  @type("string") skillIdentifier: string;


}

export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";
  players = new Map<string, Player>(); //string key is the player session id
  aoiMetaData = new Map<string, AOIMetaData>; //string key is the player session that has this meta data
  

  projectiles = new Map<string, Projectile>(); //string key = projectile session id

  mapKeyProjectilePlayerHitPreventDoubleHits = new Map<string, boolean>(); //for projectiles that go through bodies, prevent hitting damage more times as it travels inside the player body, currently its only good for "projectileGoesThroughPlayers", this map has a key proj_sess_id + player_sess_id

  fieldTickEffects = new Map<string, FieldTickEffect>(); //no @type to avoid broadcasting ticks to the client
  fieldEffects = new Map<string, FieldEffect>();

  @type(GameMap) mapData = new GameMap();
  @type(GameData) gameData = new GameData();
}
