
import { Schema, type } from "@colyseus/schema";
import { ProjectileProperties } from "./ProjectileProperties";



export class Projectile{

  uniqueSessionId: string;
  //todo ignore this startX Y Z and target and get it from player pos in the server side.
  //todo implement
  startX: number;
  startY: number;
  startZ: number;

  targetX: number;
  targetY: number;
  targetZ: number;

  //cur pos
  x: number;
  y: number;
  z: number;


  dirX: number;
  dirY: number;
  dirZ: number;

  castedFromGroundY: number;

  traveled: number = 0;
  effectiveDistance:number = 0; //calculated max distance it will travel until it hits something

  skillIdentifier: string;
  ownerPlayerSessionId: string;


  projectileProperties: ProjectileProperties;


  deepCloneProjectile(original: Projectile): Projectile {
    const rawCopy = structuredClone(original);
    const cloned = Object.assign(new Projectile(), rawCopy);
  
    // manually rehydrate nested class
    cloned.projectileProperties = Object.assign(
      new ProjectileProperties(),
      rawCopy.projectileProperties
    );
  
    return cloned;
  }
}
