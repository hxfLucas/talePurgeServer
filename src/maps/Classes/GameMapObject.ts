import { Schema, type } from "@colyseus/schema";
import { mapAssets } from "../MapAssets/mapAssets";


export class GameMapObject extends Schema  {
      @type("string") objectSessionId: string; //just to simplify unique object identification
      @type("string") objectIdentifier: string;


      @type("number") x: number;
      @type("number") y: number;
      @type("number") z: number;

      @type("number") colliderWidthX: number;
      @type("number") colliderWidthY: number;
      @type("number") colliderWidthZ: number;

      @type("number") offsetColliderPositionY:number;

      @type("boolean") isObstacle: boolean;
      

      @type("number") isBillboard = 0; //always face the camera

      define(objectIdentifier:string,positionData:{x:number,y:number,z:number},settings?:any){

        let offsetColliderPositionY = 0;
        offsetColliderPositionY = mapAssets().get(objectIdentifier)?.offsetColliderPositionY ? mapAssets().get(objectIdentifier)?.offsetColliderPositionY : 0;
        this.objectSessionId = objectIdentifier + "_" + Math.random().toString(16).slice(2);
        this.objectIdentifier = objectIdentifier;
        this.x = positionData.x;
        this.y = positionData.y;
        this.z = positionData.z;

        this.offsetColliderPositionY = offsetColliderPositionY;
        if(settings){
          
          const updatedObject = { ...this, ...settings };
          Object.assign(this, updatedObject);
        }
        return this;

      }
  }