export const BASE_MOVING_SPEED = 8;


//we have certain flags to tell the client if the "player" is still moving and which direction vector
//when the player stops, after X ms the server tells the clients the player is no longer "moving" if he continues to be stopped for those MS
export const PLAYER_MOVEMENT_ANIM_VECTOR_MOVE_CONSIDER_STOPPED_MS=200;