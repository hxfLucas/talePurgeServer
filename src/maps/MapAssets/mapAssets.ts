
interface IMapAsset{
  identifier: string;

  colliderWidthX?:number;
  colliderWidthY?:number;
  colliderWidthZ?:number;

  isBillboard?:number; //1 = true, 0 ,false
}
export function mapAssets(){



  function get(identifier:any){
    let returningAsset:IMapAsset | null = null;
    if(identifier === "tree_01"){
      returningAsset = {
        identifier: "tree_01",
        colliderWidthX: 0.12,
        colliderWidthZ: 0.12,
        colliderWidthY: 1,
        isBillboard:1
      }
      return returningAsset;
    }

    throw "asset.map.not.found.resource";
    return returningAsset;
  }

  return {get};
}