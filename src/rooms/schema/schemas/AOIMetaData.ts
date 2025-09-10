//todo clear from server meta data on player "remove" disconnect

import { FieldEffect } from "./FieldEffect/FieldEffect";
import { Player } from "./Player/Player";
import { Projectile } from "./Projectile/Projectile";

//Area Of Interest meta data
export class AOIMetaData{
  

  mapPlayersHash: Map<string, string> = new Map<string, string>(); //playerid, stored hash
  mapProjectileHash:  Map<string, string> = new Map<string, string>(); //projectileid, stored hash
  mapFieldEffectHash: Map<string, string> = new Map<string, string>(); //fieldeffectid, stored hash



  getFieldEffectsMetadata(fieldEffectsData:FieldEffect[] | null){

    if(!fieldEffectsData){
        return { mapProjectileHash:new Map<string, string>()}
    }

    let newEntityMap = new Map<string, string>();
    for(let i = 0; i<fieldEffectsData.length; i++){
        let hashedPlayer = FieldEffect.hashEntity(fieldEffectsData[i]);
        newEntityMap.set(fieldEffectsData[i].uniqueSessionId, hashedPlayer);
    }

    return {mapFieldEffectHash:newEntityMap};
  }


  getChangedFieldEffectsDataStatus(newEntityData:FieldEffect[]){
    let newEntityMetadata = this.getFieldEffectsMetadata(newEntityData);
    if(this.mapFieldEffectHash.size === 0 && newEntityData.length === 0){
        return {changed: false};
    }
    if(this.mapFieldEffectHash.size !== newEntityData.length){
        return {changed: true, newEntityMetadata:newEntityMetadata};
    }


    let newMapEntityHash = newEntityMetadata.mapFieldEffectHash;

    for (const key of this.mapProjectileHash.keys()) {
        let relevantHashToEntity = newMapEntityHash.get(key);
        if(!relevantHashToEntity){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
        if(relevantHashToEntity !== this.mapProjectileHash.get(key)){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
    }

    return {changed: false};
  }
  //

  getProjectilesMetadata(projectilesData:Projectile[] | null){

    if(!projectilesData){
        return { mapProjectileHash:new Map<string, string>()}
    }

    let mapProjectileHash = new Map<string, string>();
    for(let i = 0; i<projectilesData.length; i++){
        let hashedPlayer = Projectile.hashEntity(projectilesData[i]);
        mapProjectileHash.set(projectilesData[i].uniqueSessionId, hashedPlayer);
    }

    return {mapProjectileHash:mapProjectileHash};
  }


  getChangedProjectilesDataStatus(newEntityData:Projectile[]){
    let newEntityMetadata = this.getProjectilesMetadata(newEntityData);
    if(this.mapProjectileHash.size === 0 && newEntityData.length === 0){
        return {changed: false};
    }
    if(this.mapProjectileHash.size !== newEntityData.length){
        return {changed: true, newEntityMetadata:newEntityMetadata};
    }


    let newMapProjectilesHash = newEntityMetadata.mapProjectileHash;

    for (const key of this.mapProjectileHash.keys()) {
        let relevantHashToEntity = newMapProjectilesHash.get(key);
        if(!relevantHashToEntity){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
        if(relevantHashToEntity !== this.mapProjectileHash.get(key)){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
    }

    return {changed: false};
  }


  //---
  getChangedPlayersDataStatus(newPlayersData:Player[]){
    let newEntityMetadata = this.getPlayersMetadata(newPlayersData);
    if(this.mapPlayersHash.size === 0 && newPlayersData.length === 0){
        return {changed: false};
    }
    if(this.mapPlayersHash.size !== newPlayersData.length){
        return {changed: true, newEntityMetadata:newEntityMetadata};
    }


    let newMapPlayersHash = newEntityMetadata.mapPlayersHash;

    for (const key of this.mapPlayersHash.keys()) {
        let relevantHashToEntity = newMapPlayersHash.get(key);
        if(!relevantHashToEntity){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
        if(relevantHashToEntity !== this.mapPlayersHash.get(key)){
            return {changed: true, newEntityMetadata:newEntityMetadata};
        }
    }

    return {changed: false};
  }

  getPlayersMetadata(playersData:Player[] | null){

    if(!playersData){
        return { mapPlayersHash:new Map<string, string>()}
    }

    let mapPlayersHash = new Map<string, string>();
    for(let i = 0; i<playersData.length; i++){
        let hashedPlayer = Player.hashEntity(playersData[i]);
        mapPlayersHash.set(playersData[i].playerSessionId, hashedPlayer);
    }

    return {mapPlayersHash:mapPlayersHash};
  }

}