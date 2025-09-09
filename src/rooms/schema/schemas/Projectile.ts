
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


  @type(ProjectileProperties) projectileProperties: ProjectileProperties;

}
