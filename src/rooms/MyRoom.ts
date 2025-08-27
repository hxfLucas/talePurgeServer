import { Room, Client } from "@colyseus/core";
import { MyRoomState, Projectile, ProjectileProperties } from "./schema/MyRoomState";
import { Player } from "./schema/MyRoomState";
import { BASE_MOVING_SPEED } from "../constants";
import { FlarisMap } from "../maps/Map/FlarisMap";
import GameDataHelper from "../helper/GameDataHelper";

import {  PlayerInputSettings } from "../player/PlayerInputSettings";
import { PlayerUISettings } from "../player/PlayerUISettings";

import { FireballSkill } from "../skills/mage/fireball/FireballSkill";
import { FirebombSkill } from "../skills/mage/firebomb/FirebombSkill";
import GameDataPlayerClassIdentifiersHelper from "../helper/identifiers/GameDataPlayerClassIdentifiersHelper";
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
  
  checkProjectileCollisions(
    proj: Projectile,
    projectileWidth: number,
    projectileHeight: number
  ): string | null {
    // Loop through all players
    for (const [sessionId, player] of this.state.players) {
      // Skip owner (so projectiles don’t immediately collide with caster)
      if (sessionId === proj.ownerPlayerSessionId) continue;
  
      const playerHitboxWidth = this.state.gameData.gameDataGlobal.playerHitboxWidth;
      const playerHitboxHeight = this.state.gameData.gameDataGlobal.playerHitboxHeight;
  
      // Half sizes for AABB
      const halfPlayerW = playerHitboxWidth / 2;
      const halfPlayerH = playerHitboxHeight / 2;
      const halfProjW = projectileWidth / 2;
      const halfProjH = projectileHeight / 2;
  
      // Player bounds
      const playerMinX = player.x - halfPlayerW;
      const playerMaxX = player.x + halfPlayerW;
      const playerMinY = player.y - halfPlayerH;
      const playerMaxY = player.y + halfPlayerH;
      const playerMinZ = player.z - halfPlayerW;
      const playerMaxZ = player.z + halfPlayerW;
  
      // Projectile bounds
      const projMinX = proj.x - halfProjW;
      const projMaxX = proj.x + halfProjW;
      const projMinY = proj.y - halfProjH;
      const projMaxY = proj.y + halfProjH;
      const projMinZ = proj.z - halfProjW;
      const projMaxZ = proj.z + halfProjW;
  
      // Check overlap
      const overlapX = projMinX <= playerMaxX && projMaxX >= playerMinX;
      const overlapY = projMinY <= playerMaxY && projMaxY >= playerMinY;
      const overlapZ = projMinZ <= playerMaxZ && projMaxZ >= playerMinZ;
  
      if (overlapX && overlapY && overlapZ) {
        return sessionId; // return the hit player’s ID
      }
    }
  
    return null;
  }
  
  updateProjectiles(deltaTime: number) {
    const toDelete: string[] = [];
  
    for (const [id, proj] of this.state.projectiles) {
      const speed = proj.projectileProperties.projectileSpeed;
    

      let projSkillIdentifier = proj.skillIdentifier;
      
      let skillData = this.state.gameData.gameSkills.get(projSkillIdentifier);
      if(!skillData){
        continue;
      }
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
          // horizontal vector to target (computed once ideally)
          const startX = proj.startX;
          const startZ = proj.startZ;
          const targetX = proj.targetX;
          const targetZ = proj.targetZ;

          // total horizontal distance (start -> target)
          const totalHorizontalDist = Math.sqrt((targetX - startX)**2 + (targetZ - startZ)**2);

          // horizontal direction normalized
          const dirX = (targetX - startX) / totalHorizontalDist;
          const dirZ = (targetZ - startZ) / totalHorizontalDist;

          // move horizontally
          const moveDist = Math.min(speed, totalHorizontalDist - proj.traveled);
          proj.x += dirX * moveDist;
          proj.z += dirZ * moveDist;
          proj.traveled += moveDist;

          // calculate proportion of horizontal progress
          const t = Math.min(proj.traveled / totalHorizontalDist, 1);

          // compute parabolic Y
          const startHeight = proj.startY;
          const groundY = proj.castedFromGroundY ?? 0;
          const peakHeight = totalHorizontalDist * 0.15; // tweakable

          proj.y = (1 - t) * startHeight + t * groundY + 4 * peakHeight * t * (1 - t);
      }


  
      // --- Check collisions (AABB vs player) ---
      const hitPlayerId = this.checkProjectileCollisions(
        proj,
        proj.projectileProperties.projectileWidth,
        proj.projectileProperties.projectileHeight
      );
  
      if (hitPlayerId) {
        console.log(`💥 Projectile ${id} HIT player ${hitPlayerId} with skill ${proj.skillIdentifier}`);
        toDelete.push(id);
        continue; // no need to check distance if it already hit
      }
  
      // --- Max distance check ---
      if (proj.traveled >= proj.projectileProperties.maxDistance) {
        console.log(`❌ Projectile ${id} expired (max distance)`);
        toDelete.push(id);
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
      projectileProperties.maxDistance = skillData.maxDistance;

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
