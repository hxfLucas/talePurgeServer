import { Room, Client } from "@colyseus/core";
import { MyRoomState, Projectile } from "./schema/MyRoomState";
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
    const id = this.clock.elapsedTime.toString() + "-" + Math.random(); // unique enough
  
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
      console.log("PLAYER IS SHOOTING ",message);
      // message: { dir: { x, y, z }, type: "SHOOTABLE" | "THROWABLE", skill: string }

      let projectile = new Projectile();
      projectile.startX = message.startX;
      projectile.startY = message.startY;
      projectile.startZ = message.startZ;

      projectile.targetX = message.targetX;
      projectile.targetY = message.targetY;
      projectile.targetZ = message.targetZ;

      projectile.dirX = message.dirX;
      projectile.dirY = message.dirY;
      projectile.dirZ = message.dirZ;

      projectile.skillIdentifier = message.skillIdentifier;

      projectile.ownerPlayerSessionId = client.sessionId;
      
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
 
    console.log("THE client: ",client);


    // create Player instance
    const player = new Player();

    player.playerClassIdentifier = GameDataPlayerClassIdentifiersHelper().getMageClassIdentifier(); //.//new PlayerMageClass().getPlayerClass();

    player.playerSessionId = client.sessionId;
    // place Player at a random position
    player.x = -14.19;//(Math.random() * mapWidth);
    player.y = 0.65; //(Math.random() * mapHeight);
    player.z = 0;

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
