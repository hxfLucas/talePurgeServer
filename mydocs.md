


Private states that are broadcasted only to certain players depending on certain conditions:

export class Example  {

  someValue: string;
}

and then create the method and add to fixedTick of the server and call
client.send("someMethod", { exampleData: example });

conditionally.

Another example that is automatically always broadcasted to clients:

export class GameMap extends Schema {

  @type("string") identifier: string;
  @type("string") name: string;
  @type("number") width: number;
  @type("number") height: number;

 @type("string") activeEventString:string;

 someVariableThatIsNotBroadcasted:string;

}

make sure there  is extends  Schema
and variables must have @type("string") or the type number etc..
if it doesnt that variable will not be broadcasted, and is only visible to the server
