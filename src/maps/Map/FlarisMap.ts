
import { GameMap } from "../../rooms/schema/MyRoomState";
import { GameMapObject } from "../Classes/GameMapObject";
import { mapAssets } from "../MapAssets/mapAssets";


export class FlarisMap {

    gameMap:GameMap;

    

    constructor(){
        this.gameMap = new GameMap();
        this.gameMap.identifier = "flaris";
        this.gameMap.name = "Flaris";
        this.gameMap.width = 50;
        this.gameMap.height = 50;

        this.gameMap.gameMapObjects.push(new GameMapObject(mapAssets().get('tree'),{x:-21.93, y:1, z:7.41}));

    }
  
   
  }