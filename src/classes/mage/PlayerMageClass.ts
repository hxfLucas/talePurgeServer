

import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { PlayerClass } from "../PlayerClass";


export class PlayerMageClass {

    playerClass: PlayerClass;

    

    constructor(){
        this.playerClass = new PlayerClass();
        this.playerClass.classIdentifier = "MAGE";
        
    }

    getPlayerClass(){
        return this.playerClass;
    }
  
   
  }