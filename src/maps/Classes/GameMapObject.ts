

export class GameMapObject {

    objectIdentifier: string;
    x: number;
    y: number;
    z: number;

    
    constructor(objectIdentifier:any, positionData:any){
        this.objectIdentifier = objectIdentifier;
        this.x = positionData.x;
        this.y = positionData.y;
        this.z = positionData.z;
  
    }
  
   
  }