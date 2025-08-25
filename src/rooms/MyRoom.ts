import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player } from "./schema/MyRoomState";
import { BASE_MOVING_SPEED } from "../constants";
import { FlarisMap } from "../maps/Map/FlarisMap";
import GameDataHelper from "../helper/GameDataHelper";
import { PlayerMageClass } from "../classes/mage/PlayerMageClass";
import { InputPlayerSettings, PlayerInputSettings } from "../player/PlayerInputSettings";
export class MyRoom extends Room<MyRoomState> {
  maxClients = 100; //todo later prevent from creating new rooms when max clients reached
  state = new MyRoomState();
  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  isValidMovement(movementSpeed:number,dx:number, dz:number) {
    const lenSq = dx * dx + dz * dz;
    const step = movementSpeed;
    const stepSq = step * step; // 0.01
    const epsilon = 0.013;
    let res = Math.abs(lenSq - stepSq);
    //console.log("RES: ", res);
    //todo later, for better 'hack speed prevention', for a certain movement speed check specific "epsilon" tolerances
    //for now we simply allow 0.013
    
    //todo LOG: invalid movement speed breaches
    return res < epsilon;
  }

  fixedTick(deltaTime:number){



 
    this.state.players.forEach(player => {
        let input: any;
 
        // dequeue player inputs
        while (input = player.inputQueue.shift()) {
          const velocity = player?.movingSpeed ? player.movingSpeed :  BASE_MOVING_SPEED;
  
          let isValidMovement = this.isValidMovement(velocity,input.x, input.z);
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




    console.log("THE OPTIONS: ",options);
    this.onMessage("myPlayer/move", (client, message) => {
     // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);

      // enqueue input to user input buffer.
      player.inputQueue.push(message);

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

    player.playerClass = new PlayerMageClass().getPlayerClass();

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
