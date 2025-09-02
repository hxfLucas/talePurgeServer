
interface IMapAsset{
  identifier: string;

  colliderWidthX?:number;
  colliderWidthY?:number;
  colliderWidthZ?:number;

  offsetColliderPositionY?:number; //for example a tree base might be at y:0 but the actual model base is at y: -0.5, so we add offsetAdditionalY to the map object y position, enable debug hitboxes obstacles in the client to see the positioning and adjust accordingly
  isObstacle?:boolean;
  isBillboard?:number; //1 = true, 0 ,false
}
export function mapAssets(){



  function get(identifier:any){
    let returningAsset:IMapAsset | null = null;
    if(identifier === "tree_01"){
      returningAsset = {
        identifier: "tree_01",
        colliderWidthX: 0.33,
        colliderWidthZ: 0.33,
        colliderWidthY: 2,
        offsetColliderPositionY:1.0,
        isBillboard:1,
        isObstacle:true
      }
      return returningAsset;
    }

    throw "asset.map.not.found.resource";
    return returningAsset;
  }

  return {get};
}