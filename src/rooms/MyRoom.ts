import { Room, Client } from "@colyseus/core";
import { FieldEffect, FieldTickEffect, MyRoomState, Projectile, ProjectileProperties, WhatWasHit } from "./schema/MyRoomState";
import { Player } from "./schema/MyRoomState";
import { BASE_MOVING_SPEED } from "../constants";
import { FlarisMap } from "../maps/Map/FlarisMap";
import GameDataHelper from "../helper/GameDataHelper";

import {  PlayerInputSettings } from "../player/PlayerInputSettings";
import { PlayerUISettings } from "../player/PlayerUISettings";

import { FireballSkill } from "../skills/mage/fireball/FireballSkill";
import { FirebombSkill } from "../skills/mage/firebomb/FirebombSkill";
import GameDataPlayerClassIdentifiersHelper from "../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
import { GameSkill } from "../skills/GameSkill";
export class MyRoom extends Room<MyRoomState> {
  maxClients = 100; //todo later prevent from creating new rooms when max clients reached
  state = new MyRoomState();
  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;


  shootProjectile(projectile:Projectile) {
    
    const id = "prj_" + this.clock.elapsedTime.toString() + "_" + Math.random(); // unique enough
    projectile.uniqueSessionId = id;
    this.state.projectiles.set(id, projectile);
  }



  spawnFieldEffect(fieldEffect:FieldEffect){
      
    const id = "fieldeffect_" + this.clock.elapsedTime.toString() + "_" + Math.random(); // unique enough
    fieldEffect.uniqueSessionId = id;
 
    this.state.fieldEffects.set(id, fieldEffect);

    return id;
  }

  spawnFieldTickEffect(fieldTickEffect:FieldTickEffect){
      
    const id = "fieldtickeffect_" + this.clock.elapsedTime.toString() + "_" + Math.random(); // unique enough
    fieldTickEffect.uniqueSessionId = id;
    this.state.fieldTickEffects.set(id, fieldTickEffect);
  }


  broadcastSkillHit(whatWasHit:WhatWasHit){

    this.broadcast("skillHitSomething", {
      whatWasHit:whatWasHit
    });

  }

  isValidMovement(player: Player, dx: number, dz: number) {
    const velocity = player?.movingSpeed ?? BASE_MOVING_SPEED;
    const lenSq = dx * dx + dz * dz;
    const stepSq = velocity * velocity;
    const epsilon = 0.013;
  
    // --- speed hack check ---
    if (Math.abs(lenSq - stepSq) > epsilon) {
      return false;
    }
  
    // --- collision check ---
    const nextX = player.x + dx;
    const nextZ = player.z + dz;
  
    for (const obj of this.state.mapData.gameMapObjects) {
      if (!obj.colliderWidthX || !obj.colliderWidthZ) continue; // skip objects without colliders
      
     
      const minX = obj.x - obj.colliderWidthX / 2;
      const maxX = obj.x + obj.colliderWidthX / 2;
      const minZ = obj.z - obj.colliderWidthZ / 2;
      const maxZ = obj.z + obj.colliderWidthZ / 2;
      
      // simple point vs AABB check
      if (nextX >= minX && nextX <= maxX && nextZ >= minZ && nextZ <= maxZ) {
        console.log("COLLIDED!");
        return false; // collision!
      }
    }
  
    return true;
  }
  
  builderKeyMapKeyProjectilePlayerHitPreventDoubleHits(projectileSessionId:string, playerSessionId:string){
    return projectileSessionId + "__" + playerSessionId;
  }
  checkProjectileCollisions(
    proj: Projectile,
    projectileWidth: number,
    projectileHeight: number
  ): WhatWasHit[] {
  
    let arrWhatWasHit: WhatWasHit[] = [];
    let projectileHitboxType = proj?.projectileProperties?.projectileHitboxType 
      ? proj?.projectileProperties?.projectileHitboxType 
      : "CUBOID";
  
    // Loop through all players
    for (const [sessionId, player] of this.state.players) {
      if (sessionId === proj.ownerPlayerSessionId) continue;
      
      const playerHitboxWidth = this.state.gameData.gameDataGlobal.playerHitboxWidth;
      const playerHitboxHeight = this.state.gameData.gameDataGlobal.playerHitboxHeight;
  
      const halfPlayerW = playerHitboxWidth / 2;
      const halfPlayerH = playerHitboxHeight / 2;
  
      const playerMinX = player.x - halfPlayerW;
      const playerMaxX = player.x + halfPlayerW;
      const playerMinY = player.y - halfPlayerH;
      const playerMaxY = player.y + halfPlayerH;
      const playerMinZ = player.z - halfPlayerW;
      const playerMaxZ = player.z + halfPlayerW;
  
      let isColliding = false;
  
      if (projectileHitboxType === "SPHERE") {
        const sphereRadius = projectileWidth/2;
  
        // 🔴 Plane cutoff check: ignore if sphere center is above the plane
        // Assume proj.castedFromGroundY is the dome base Y
        const planeYCutAbove = proj.y + (projectileHeight / 2);
        if (proj.y > planeYCutAbove) {
          continue; // skip collision checks for this player
        }
        const planeYCutBellow = proj.y - (projectileHeight / 2);
        if (proj.y < planeYCutBellow) {
          continue; // skip collision checks for this player
        }
        // Sphere vs AABB collision
        const closestX = Math.max(playerMinX, Math.min(proj.x, playerMaxX));
        const closestY = Math.max(playerMinY, Math.min(proj.y, playerMaxY));
        const closestZ = Math.max(playerMinZ, Math.min(proj.z, playerMaxZ));
  
        const distanceX = proj.x - closestX;
        const distanceY = proj.y - closestY;
        const distanceZ = proj.z - closestZ;
  
        const distanceSquared = distanceX * distanceX + distanceY * distanceY + distanceZ * distanceZ;
  
        isColliding = distanceSquared < (sphereRadius * sphereRadius);
  
      } else {
        // CUBOID collision
        const halfProjW = projectileWidth / 2;
        const halfProjH = projectileHeight / 2;
  
        const projMinX = proj.x - halfProjW;
        const projMaxX = proj.x + halfProjW;
        const projMinY = proj.y - halfProjH;
        const projMaxY = proj.y + halfProjH;
        const projMinZ = proj.z - halfProjW;
        const projMaxZ = proj.z + halfProjW;
  
        const overlapX = projMinX <= playerMaxX && projMaxX >= playerMinX;
        const overlapY = projMinY <= playerMaxY && projMaxY >= playerMinY;
        const overlapZ = projMinZ <= playerMaxZ && projMaxZ >= playerMinZ;
  
        isColliding = overlapX && overlapY && overlapZ;
      }
  
      if (isColliding) {
        let whatWasHit = new WhatWasHit();
        whatWasHit.hitSenderPlayerSessionId = proj.ownerPlayerSessionId;
        whatWasHit.hitReceiverPlayerSessionId = sessionId;
        whatWasHit.hitSkillIdentifier = proj.skillIdentifier;
        whatWasHit.hitReceiverType = "PLAYER";
        whatWasHit.hitCoordinatesX = proj.x;
        whatWasHit.hitCoordinatesY = proj.y;
        whatWasHit.hitCoordinatesZ = proj.z;
        whatWasHit.yGroundCoordinates = proj.castedFromGroundY;
        arrWhatWasHit.push(whatWasHit);
      }
    }
  
    // Ground hit still applies
    if (proj.y <= proj.castedFromGroundY) {
      let whatWasHit = new WhatWasHit();
      whatWasHit.hitSenderPlayerSessionId = proj.ownerPlayerSessionId;
      whatWasHit.hitSkillIdentifier = proj.skillIdentifier;
      whatWasHit.hitReceiverType = "GROUND";
      whatWasHit.hitCoordinatesX = proj.x;
      whatWasHit.hitCoordinatesY = proj.y;
      whatWasHit.hitCoordinatesZ = proj.z;
      whatWasHit.yGroundCoordinates = proj.castedFromGroundY;
      arrWhatWasHit.push(whatWasHit);
    }
  
    return arrWhatWasHit;
  }
  


  //ticks per field
  updateFieldTickEffects(){

    const toDelete:string[] = [];
    for (const [id, fieldTickEffect] of this.state.fieldTickEffects) {
      //check if anythng collides with it 

      //TODO create new method instead of checkprojectile because its not  really a projectile ? or take in consideration the "direction"
      //OR make the area to be spawned in the direction aiming and calculate as if it was a projectile but make new method
      let fakeProjectile = new Projectile();
      fakeProjectile.x = fieldTickEffect.x;
      fakeProjectile.y = fieldTickEffect.y;
      fakeProjectile.z = fieldTickEffect.z;
      fakeProjectile.projectileProperties = new ProjectileProperties();
      fakeProjectile.projectileProperties.projectileHitboxType = "SPHERE";
      fakeProjectile.projectileProperties.projectileWidth = fieldTickEffect.widthEffectArea;
      fakeProjectile.projectileProperties.projectileHeight = fieldTickEffect.heightEffectArea;
      fakeProjectile.ownerPlayerSessionId = fieldTickEffect?.ownerPlayerSessionId;

      
      let arrWhatWasHit: WhatWasHit[] | null = this.checkProjectileCollisions(
        fakeProjectile,
        fieldTickEffect.widthEffectArea,
        fieldTickEffect.heightEffectArea
      );
   
      if(arrWhatWasHit){
        for(let i = 0; i<arrWhatWasHit.length; i++){

          if(arrWhatWasHit[i].hitReceiverType === "PLAYER"){
            console.log(` DamageTickEffect : 💥 Player ${fieldTickEffect.ownerPlayerSessionId} hit ${arrWhatWasHit[i].hitReceiverPlayerSessionId} with skill ${fieldTickEffect.originSkillIdentifier}`);
          }
          
        }
      }
      toDelete.push(id);
    }

    // Remove already processed field effects
    for (const id of toDelete) {
      this.state.fieldTickEffects.delete(id);
    }
  }
  
  updateProjectiles(deltaTime: number) {

    const minimalDebug = process.env.MINIMAL_DAMAGE_DEBUG === "true";
    const verboseDebug = process.env.VERBOSE_DAMAGE_DEBUG === "true";

    const toDelete: string[] = [];
  
    for (const [id, proj] of this.state.projectiles) {
      const speed = proj.projectileProperties.projectileSpeed;
    

   

      let projSkillIdentifier = proj.skillIdentifier;
      
      let skillData = this.state.gameData.gameSkills.get(projSkillIdentifier);
      if(!skillData){
        continue;
      }

      let allowsGoThroughPlayers = skillData.projectileGoesThroughPlayers;
      // Normalize dir
      const len = Math.sqrt(proj.dirX*proj.dirX + proj.dirY*proj.dirY + proj.dirZ*proj.dirZ) || 1;
      const dx = (proj.dirX / len) * speed;
      const dy = (proj.dirY / len) * speed;
      const dz = (proj.dirZ / len) * speed;

      if(skillData.skillType === "SHOOTABLE"){
  
          // Move
          proj.x += dx;
          proj.y += dy;
          proj.z += dz;
          proj.traveled += speed;
      }else if(skillData.skillType === "THROWABLE"){
        const startX = proj.startX;
        const startZ = proj.startZ;
        const targetX = proj.targetX;
        const targetZ = proj.targetZ;
      
        // horizontal distance to target
        const totalHorizontalDist = Math.sqrt(
          (targetX - startX) ** 2 + (targetZ - startZ) ** 2
        );
      
        // clamp to maxDistance
        const effectiveDist = Math.min(totalHorizontalDist, proj.projectileProperties.maxDistance);
      
        // normalized direction
        const dirX = (targetX - startX) / totalHorizontalDist;
        const dirZ = (targetZ - startZ) / totalHorizontalDist;
      
        // movement per tick, capped
        const moveDist = Math.min(speed, effectiveDist - proj.traveled);
        proj.x += dirX * moveDist;
        proj.z += dirZ * moveDist;
        proj.traveled += moveDist;
      
        // normalized progress (0 → 1)
        const t = Math.min(proj.traveled / effectiveDist, 1);
      
        // parabolic Y
        const startHeight = proj.startY;
        const groundY = proj.castedFromGroundY ?? 0;
        const peakHeight = effectiveDist * 0.15; // same scaling as client
      
        proj.y =
          (1 - t) * startHeight +
          t * groundY +
          4 * peakHeight * t * (1 - t);
      }

      //the collisions of the actual projectile only
      let arrWhatWasHit: WhatWasHit[] | null = this.checkProjectileCollisions(
        proj,
        proj.projectileProperties.projectileWidth,
        proj.projectileProperties.projectileHeight
      );

   
      let wasSomethingRelevantHit = false;

      let shouldDeleteFromMemory = false;


      if(arrWhatWasHit.length > 0){
        
        for(let i = 0; i<arrWhatWasHit.length; i++){
          let whatWasHit:WhatWasHit = arrWhatWasHit[i];
          // --- Check collisions (AABB vs player) ---
          const hitPlayerId = whatWasHit?.hitReceiverType === "PLAYER" && whatWasHit?.hitReceiverPlayerSessionId ? whatWasHit.hitReceiverPlayerSessionId : null;
          if (hitPlayerId) {


            wasSomethingRelevantHit = true;

            if(!allowsGoThroughPlayers){
              shouldDeleteFromMemory = true;
            }
           
            
            if(verboseDebug){
              console.log(`[VERBOSE] #1a 💥 Projectile ${id} HIT player ${hitPlayerId} with skill ${proj.skillIdentifier}`);
            }
          
          }else if(whatWasHit.hitReceiverType === "GROUND" || whatWasHit.hitReceiverType === "OBSTACLE"){
            wasSomethingRelevantHit = true;
            shouldDeleteFromMemory = true;
            if(verboseDebug){
              if(whatWasHit.hitReceiverType === "OBSTACLE"){
                console.log(`[VERBOSE] #2a ❌ Projectile ${id} hit obstacle`);
              }else if(whatWasHit.hitReceiverType === "GROUND"){
                console.log(`[VERBOSE] #2a ❌ Projectile ${id} hit the ground (target position < max)`);
              }
             
            }
            
          }
          
        }

     
      }


      if(!wasSomethingRelevantHit){
        //nothing relevant was hit
        if (proj.traveled >= proj.projectileProperties.maxDistance) { 
          // --- Max distance check ---

          if(skillData.hitAOERadius > 0){
            
            if(verboseDebug){
              console.log(`[VERBOSE] #3a ❌ Projectile ${id} hit the ground (max distance)`);
            }
            let whatWasHit = new WhatWasHit();
            whatWasHit.hitReceiverType = "GROUND";
            whatWasHit.hitReceiverPlayerSessionId = null;
            whatWasHit.hitSkillIdentifier = proj.skillIdentifier;
            whatWasHit.hitSenderPlayerSessionId = proj.ownerPlayerSessionId;
            whatWasHit.hitCoordinatesX = proj.x;
            whatWasHit.hitCoordinatesY = proj.y;
            whatWasHit.hitCoordinatesZ = proj.z;
            whatWasHit.yGroundCoordinates = proj.castedFromGroundY;
            arrWhatWasHit.push(whatWasHit);
          }else{
            if(verboseDebug){
              console.log(`[VERBOSE] #4a ❌ Projectile ${id} expired (max distance)`);
            }
            
          }

          
          toDelete.push(id);
        }
      }


      if(shouldDeleteFromMemory){
        //delete it from memory
        toDelete.push(id);
      }


               
      if(arrWhatWasHit.length > 0){ //something was hit
        

        //if something was hit and skill is AOE, get the first hit and from there check what was really hit so we 
        //use logic to "take damage" etc
        
        //we only care about one thing that was hit as it the washit returns the position hit which is the center of the explosion
      
        let hasHitAOE = false;

        if(proj.projectileProperties.hitAOERadius > 0){
          hasHitAOE = true;
        }
        

        let relevantHitTargets:WhatWasHit[] = [];
  
        
        if(!hasHitAOE){
          for(let i = 0; i<arrWhatWasHit.length; i++){
            arrWhatWasHit[i].playAnimationHit = true;
            relevantHitTargets.push(arrWhatWasHit[i]);
          }
        }else if(hasHitAOE){
          if(arrWhatWasHit.length > 0){
            let spotHitCheckAoe:WhatWasHit = arrWhatWasHit[0];
            //check other possible hits on the aoe range explosion
            let aoeProjectile:Projectile = proj.clone();

            //check if hit aoe will spawn another "hittable" like a burning field or healing field
            if(skillData?.hitAOEDamagingFieldDurationMilliseconds > 0 && skillData?.hitAOEDamagingFieldTicks > 0){
                

                let totalDamageTicks = skillData?.hitAOEDamagingFieldTicks;
                let millisecondsPerTick = skillData?.hitAOEDamagingFieldDurationMilliseconds / totalDamageTicks;
                let fullFieldDuration = skillData.hitAOEDamagingFieldDurationMilliseconds;

                //spawn just the field effect, for tracking when it finishes visually mostly

                let newFieldEffect:FieldEffect = new FieldEffect();
                newFieldEffect.originSkillIdentifier = skillData.skillIdentifier;

                newFieldEffect.x = spotHitCheckAoe.hitCoordinatesX;
                newFieldEffect.y = spotHitCheckAoe.yGroundCoordinates; //temp solution, eventually ray cast from hitCoordinates to ground closest collision
                newFieldEffect.z = spotHitCheckAoe.hitCoordinatesZ;
                newFieldEffect.dirX = proj.dirX;
                newFieldEffect.dirY = proj.dirY;
                newFieldEffect.dirZ = proj.dirZ;
                newFieldEffect.widthEffectArea = skillData.hitAOEDamagingFieldWidth;
                newFieldEffect.heightEffectArea = skillData.hitAOEDamagingFieldHeight;

                newFieldEffect.fieldType = "DAMAGING";
                
               let spawnedFieldEffectId = this.spawnFieldEffect(newFieldEffect);

                setTimeout(() => {
                  //delete the field effect after a while
                  this.state.fieldEffects.delete(spawnedFieldEffectId);
                },fullFieldDuration);

                //spawn the field fick effects for server side tracking of when to take damage

                console.log("SPAWN FIELDS TICKING EFFECTS!!");

                let newFieldTickEffect:FieldTickEffect = new FieldTickEffect();
                newFieldTickEffect.originSkillIdentifier = skillData.skillIdentifier;
                newFieldTickEffect.x = spotHitCheckAoe.hitCoordinatesX;
                newFieldTickEffect.y = spotHitCheckAoe.yGroundCoordinates; //temp solution, eventually ray cast from hitCoordinates to ground closest collision
                newFieldTickEffect.z = spotHitCheckAoe.hitCoordinatesZ;
                newFieldTickEffect.widthEffectArea = skillData.hitAOEDamagingFieldWidth;
                newFieldTickEffect.heightEffectArea = skillData.hitAOEDamagingFieldHeight;
                newFieldTickEffect.ownerPlayerSessionId = aoeProjectile.ownerPlayerSessionId;

                this.spawnFieldTickEffect(newFieldTickEffect); //spawn first tick right away

                //start from 1 because the first field effect was already spawned
                for(let i = 1; i<totalDamageTicks; i++){
                  setTimeout(() => {
                    this.spawnFieldTickEffect(newFieldTickEffect);
                  }, millisecondsPerTick*i);
                }


            }


            
            aoeProjectile.x = spotHitCheckAoe.hitCoordinatesX;
            aoeProjectile.y = spotHitCheckAoe.hitCoordinatesY;
            aoeProjectile.z = spotHitCheckAoe.hitCoordinatesZ;
  
            //radius = raio, portanto multiplicar por 2 para verdadeira largura e altura
            aoeProjectile.projectileProperties.projectileHeight = proj.projectileProperties.hitAOERadius*2;
            aoeProjectile.projectileProperties.projectileWidth = proj.projectileProperties.hitAOERadius*2;

            //HERE CREATE A NEW METHOD CALLED CHECKPROJECTILEAOECOLLISION
            //check if something collides with the AOE radius 
            let checkNewReceiveDmg: WhatWasHit[] | null = this.checkProjectileCollisions(
              aoeProjectile,
              aoeProjectile.projectileProperties.projectileWidth,
              aoeProjectile.projectileProperties.projectileHeight
            );

            if(checkNewReceiveDmg && checkNewReceiveDmg.length > 0){

              //order hits by the closest to the aoe projectile, so we will only "trigger hit effect" on the closest
              checkNewReceiveDmg.sort((a, b) => {
                const distanceA = Math.sqrt(
                  Math.pow(a.hitCoordinatesX - aoeProjectile.x, 2) +
                  Math.pow(a.hitCoordinatesY - aoeProjectile.y, 2) +
                  Math.pow(a.hitCoordinatesZ - aoeProjectile.z, 2)
                );
            
                const distanceB = Math.sqrt(
                  Math.pow(b.hitCoordinatesX - aoeProjectile.x, 2) +
                  Math.pow(b.hitCoordinatesY - aoeProjectile.y, 2) +
                  Math.pow(b.hitCoordinatesZ - aoeProjectile.z, 2)
                );
            
                return distanceA - distanceB; // smallest distance first
              });
              checkNewReceiveDmg[0].playAnimationHit = true; //only play explosion on the closest hit target
      
              for(let i = 0; i<checkNewReceiveDmg.length; i++){
                if(checkNewReceiveDmg[i].hitReceiverType === "PLAYER"){
                  let hitPlayerId = checkNewReceiveDmg[i].hitReceiverPlayerSessionId;
                  
                  if(verboseDebug){
                    console.log(`[VERBOSE] #5a 💥 (AOE) Projectile ${id} HIT player ${hitPlayerId} with skill ${proj.skillIdentifier}`);
                  }
                }

                relevantHitTargets.push(checkNewReceiveDmg[i]);
              }
            }
          }
 

       
        }


        //damage logic etc
        if(relevantHitTargets.length > 0){
      
          //clean possible repeatables
          let targetsToDamage:WhatWasHit[] = [];

          let mapAlreadyAddedToDamageTargets:any =  {};
          for(let i = 0; i<relevantHitTargets.length;i++){
            if(relevantHitTargets[i].hitReceiverType === "PLAYER"){
              let playerSessionId = relevantHitTargets[i].hitReceiverPlayerSessionId;
              if(!mapAlreadyAddedToDamageTargets?.[playerSessionId]){
                targetsToDamage.push(relevantHitTargets[i]);
                mapAlreadyAddedToDamageTargets[playerSessionId] = true;
              }
            }
          }

          if(targetsToDamage.length > 0){

            for(let i = 0; i< targetsToDamage.length; i++){
              
              let casterPlayerSessionId = proj.ownerPlayerSessionId;
              let receiverPlayerSessionId = targetsToDamage[i]?.hitReceiverPlayerSessionId;

                
              let keyProjectileHitPlayerPreventDoubleDmg = this.builderKeyMapKeyProjectilePlayerHitPreventDoubleHits(proj.uniqueSessionId,receiverPlayerSessionId);
              if(this.state.mapKeyProjectilePlayerHitPreventDoubleHits.get(keyProjectileHitPlayerPreventDoubleDmg)){
                console.log("skipping already hit");
                if(verboseDebug){
                  console.log(`[VERBOSE] #6a REJECTED hit (already hit) Projectile ${id}  player ${receiverPlayerSessionId} with skill ${proj.skillIdentifier}`);
                }
                continue;
              }
              if(minimalDebug){
                console.log(` AOE + projectile Result: 💥 Player ${casterPlayerSessionId} hit ${receiverPlayerSessionId} with skill ${proj.skillIdentifier}`);
              }
              let damageGiverPlayerSessionId = proj.ownerPlayerSessionId;
              let damageTakerPlayerSessionId = receiverPlayerSessionId;
              //TODO HERE call "take damage from player"
              this.broadcastSkillHit(targetsToDamage[i]);
              this.state.mapKeyProjectilePlayerHitPreventDoubleHits.set(keyProjectileHitPlayerPreventDoubleDmg, true);
             
            }
          }
          
        }

      }

    }

    
    // Remove expired
    for (const id of toDelete) {
      this.state.projectiles.delete(id);
    }
  }
  
  fixedTick(deltaTime:number){



 
    this.state.players.forEach(player => {
        let input: any;
 
        // dequeue player inputs
        while (input = player.inputQueue.shift()) {
          const velocity = player?.movingSpeed ? player.movingSpeed :  BASE_MOVING_SPEED;
  
          let isValidMovement = this.isValidMovement(player,input.x, input.z);
          if (!isValidMovement) {
            //todo log invalid movement attempt ??
            continue;
          }
          
          player.x += input.x;
          player.z += input.z;
          
          /*
          if (input.x < 0) {
            player.x -= velocity;
      
          } else if (input.x > 0) {
            player.x += velocity;
          }
      
          if (input.z < 0) {
            player.z -= velocity;
      
          } else if (input.z > 0) {
            player.z += velocity;
          }*/
          //y beeing ignored because no verticallity
        }
    });


    this.updateProjectiles(deltaTime);
    this.updateFieldTickEffects();
  }
  onCreate (options: any) {

    let flarisMap = new FlarisMap();
    const mapWidth = flarisMap.gameMap.width;
    const mapHeight = flarisMap.gameMap.height;
    this.state.mapData = flarisMap.gameMap;

    this.state.gameData.gameSkills = GameDataHelper().gameSkills;
    this.state.gameData.gamePlayerClasses = GameDataHelper().gamePlayerClasses;




    console.log("THE OPTIONS: ",options);
    this.onMessage("myPlayer/move", (client, message) => {
     // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);
    
      // enqueue input to user input buffer.
      player.inputQueue.push(message);

    });

    this.onMessage("myPlayer/shoot", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      //console.log("PLAYER IS SHOOTING ",message);
  

      let projectile = new Projectile();
      projectile.startX = player.x;//message.startX;
      //shoots from a certain altitude
      projectile.startY = player.yGroundRelative +  this.state.gameData.gameDataGlobal.defaultPlayerShootStartPositionOffsetFromGroundY;//parseFloat(process.env.PLAYER_SHOOT_START_POSITION_OFFSET_FROM_GROUND_Y);//message.startY;
      projectile.startZ = player.z;//message.startZ;

      projectile.castedFromGroundY = player.yGroundRelative;

      projectile.targetX = message.targetX;
      projectile.targetY = message.targetY;
      projectile.targetZ = message.targetZ;

      projectile.dirX = message.dirX;
      projectile.dirY = message.dirY;
      projectile.dirZ = message.dirZ;


      projectile.x = projectile.startX;
      projectile.y = projectile.startY;
      projectile.z = projectile.startZ;

      projectile.traveled = 0;

      projectile.skillIdentifier = message.skillIdentifier;

      projectile.ownerPlayerSessionId = client.sessionId;

    
      let skillData = this.state.gameData.gameSkills.get(projectile.skillIdentifier);
   
      if(!skillData){
        return;
      }
      
      let projectileProperties = new ProjectileProperties();
      projectileProperties.projectileHeight = skillData.projectileHeight;
      projectileProperties.projectileSpeed = skillData.projectileSpeed;
      projectileProperties.projectileWidth = skillData.projectileWidth;
      projectileProperties.projectileHitboxType = skillData?.projectileHitboxType ? skillData?.projectileHitboxType: "SPHERE";
      projectileProperties.maxDistance = skillData.maxDistance;

      projectileProperties.hitAOERadius = skillData.hitAOERadius;

      projectileProperties.hitAOEDamagingFieldDurationMilliseconds = skillData.hitAOEDamagingFieldDurationMilliseconds;

      projectile.projectileProperties = projectileProperties;

      this.shootProjectile(projectile);
 
     });


    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;
      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
    }
    
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
 


    // create Player instance
    const player = new Player();

    player.playerClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier(); //.//new PlayerMageClass().getPlayerClass();

    player.playerSessionId = client.sessionId;
    // place Player at a random position
    player.x = -14.19;//(Math.random() * mapWidth);
    player.y = 0.65; //(Math.random() * mapHeight);
    player.z = 0;

    player.yGroundRelative = 0; //0 ground

    player.movingSpeed = BASE_MOVING_SPEED;

    let playerInputSettings = new PlayerInputSettings();
    playerInputSettings.keyboardCodeSkillOne = 'Digit1';
    playerInputSettings.keyboardKeySkillOne = '1';

    playerInputSettings.keyboardCodeAlternativeCameraZoomIn = 'ArrowUp';
    playerInputSettings.keyboardKeyAlternativeCameraZoomIn = 'arrowup';
    
    playerInputSettings.keyboardCodeAlternativeCameraZoomOut = 'ArrowDown';
    playerInputSettings.keyboardKeyAlternativeCameraZoomOut = 'arrowdown';

    player.playerInputSettings = playerInputSettings;

    let playerUISettings = new PlayerUISettings();
    
    playerUISettings.skillBar_skillOneIdentifier = new FireballSkill().getGameSkill().skillIdentifier;
    playerUISettings.skillBar_skillTwoIdentifier = new FirebombSkill().getGameSkill().skillIdentifier;
    player.playerUISettings = playerUISettings;

    player.lastSkillSlotSelected;
    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
    

    
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
 
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
