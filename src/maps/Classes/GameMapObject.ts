import { Schema, type } from "@colyseus/schema";


export class GameMapObject extends Schema  {
      @type("string") objectSessionId: string; //just to simplify unique object identification
      @type("string") objectIdentifier: string;


      @type("number") x: number;
      @type("number") y: number;
      @type("number") z: number;

      @type("number") isBillboard = 0; //always face the camera

      define(objectIdentifier:string,positionData:{x:number,y:number,z:number},settings?:any){

        this.objectSessionId = objectIdentifier + "_" + Math.random().toString(16).slice(2);
        this.objectIdentifier = objectIdentifier;
        this.x = positionData.x;
        this.y = positionData.y;
        this.z = positionData.z;
        if(settings){
          if(settings.isBillboard !== undefined){
            this.isBillboard = settings.isBillboard ? 1 : 0;
          }
        }
        return this;

      }
  }