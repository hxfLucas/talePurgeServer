
import { GameMap } from "../../rooms/schema/MyRoomState";
import { GameMapObject } from "../Classes/GameMapObject";
import { mapAssets } from "../MapAssets/mapAssets";
import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";

export class FlarisMap {

    gameMap:GameMap;

    

    constructor(){
        this.gameMap = new GameMap();
        this.gameMap.identifier = "flaris";
        this.gameMap.name = "Flaris";
        this.gameMap.width = 50;
        this.gameMap.height = 50;

        const gameMapObjects = new ArraySchema<GameMapObject>();

        let identifierSearch = mapAssets().get('tree_01').identifier;
        gameMapObjects.push(new GameMapObject().define(identifierSearch,{
            x:-21.93, y:2, z:7.41
        },{isBillboard:1}));
      
        this.gameMap.gameMapObjects = gameMapObjects;

    }
  
   
  }