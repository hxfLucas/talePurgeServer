import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { PlayerUISettings } from "../../../player/PlayerUISettings";
import { PlayerInputSettings } from "../../../player/PlayerInputSettings";

//only needed server side because client side we alraedy get it from the metadata
export class ProjectileProperties {
    projectileSpeed:number;
    projectileWidth:number;
    projectileHeight:number;
    projectileHitboxType:"CUBOID" | "SPHERE"; //to verify collisions, CUBOID is better performant, but for certain things dome is better
    projectablePeakScale:number;
    
    maxDistance:number;
  
    hitAOERadius:number;
    hitAOEDamagingFieldDurationMilliseconds:number;
    hitAOEDamagingFieldTicks:number;
    
  }