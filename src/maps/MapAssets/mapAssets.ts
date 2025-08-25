
interface IMapAsset{
  identifier: string;
}
export function mapAssets(){



  function get(identifier:any){
    let returningAsset:IMapAsset | null = null;
    if(identifier === "tree_01"){
      returningAsset = {
        identifier: "tree_01"
      }
      return returningAsset;
    }

    throw "asset.map.not.found.resource";
    return returningAsset;
  }

  return {get};
}