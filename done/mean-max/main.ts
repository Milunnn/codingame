
class ReaderTS {

   private gen: null | Generator<string, void, unknown>;
   private string;

   constructor(linesString = "") {
      this.gen = null;
      this.string = linesString;
   }

   readline() {
      if ("readline" in globalThis) {
         return ((globalThis as any).readline as Function)();
      }
      if (this.gen == null) {
         this.gen = this.readlineGen();
      }
      return this.gen.next().value;
   }

   private* readlineGen() {
      const data = this.string.split("\n").map(x => x.trim());
      
      for (const d of data) {
         yield d;
      }
   }
}

interface RawData {
	unitId: number;
	unitType: number;
	player: number;
	mass: number;
	radius: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	extra: number;
	extra2: number;
}

class Data {

   private updatedThisTick: Array<number> = [];
   public entities: Array<Entity> = [];

   public rage: number = -1;

   wrecks(): Array<Wreck> {
      return this.entities.filter(x => x instanceof Wreck) as Array<Wreck>;
   }
   looters(): Array<Looter> {
      return this.entities.filter(x => x instanceof Looter) as Array<Looter>;
   }
   tankers(): Array<Tanker> {
      return this.entities.filter(x => x instanceof Tanker) as Array<Tanker>;
   }

   newTick(rage: number) {
      this.entities = this.entities.filter(x => this.updatedThisTick.includes(x.id));
      this.updatedThisTick = [];

      this.rage = rage;
   }

   addOrUpdate(data: RawData) {
      let entity = this.entities.find(x => x.id == data.unitId);

      if (entity != null) {
         // Update
         entity.updateData(data);
      } else {
         // Add
         if ([0, 1, 2].includes(data.unitType)) {
            entity = Looter.fromData(data);
         } else if (data.unitType == 3) {
            entity = new Tanker(data);
         } else {
            entity = new Wreck(data);
         }

         this.entities.push(entity);
      }

      this.updatedThisTick.push(entity.id);
   }
}

abstract class Entity {

   protected registeredSetters: Array<Function> = [];

   public id: number = -1;
   public type: number = -1;
   public radius: number = -1;
   public position: Vector = new Vector();

   // constructor(public id: number, public type: number, public radius: number, x: number, y: number) {
   constructor(data: RawData) {
      this.registerSetter(({unitId, unitType, radius, x, y}: RawData) => {
         this.id = unitId;
         this.type = unitType;
         this.radius = radius;
         this.position = new Vector(x, y);
      });
   }

   protected registerSetter(setter: (data: RawData) => void, data?: RawData | undefined) {
      this.registeredSetters.push(setter.bind(this));
      if (data) {
         this.update(data);
      }
   }

   protected update(data: RawData) {
      for (const setter of this.registeredSetters) {
         setter(data);
      }
   }

   public updateData(data: RawData) : void {
      this.update(data);
   }
}

abstract class Moving extends Entity {

   public mass: number = -1;
   public speed: Vector = new Vector();

   constructor(data: RawData) {
      super(data);
      this.registerSetter((data: RawData) => {
         this.mass = data.mass;
         this.speed = new Vector(data.vx, data.vy);
      });
   }
}

class Tanker extends Moving {
   constructor(data: RawData) {
      super(data);
      this.registerSetter((data: RawData) => {}, data);
   }
}

class Wreck extends Entity {

   public quantity: number = -1;

   constructor(data: RawData) {
      super(data);
      this.registerSetter((data: RawData) => {
         this.quantity = data.extra;
      }, data);
   }
}

class Vector {

   constructor(public x = 0, public y = 0) {
      this.x = x;
      this.y = y;
   }

   multiply(mult: number): Vector {
      return new Vector(this.x * mult, this.y * mult);
   }
   add(vector: Vector): Vector {
      return new Vector(this.x + vector.x, this.y + vector.y);
   }
   sub(vector: Vector): Vector {
      return this.add(vector.multiply(-1));
   }
   euclidean() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
   }
}

abstract class Looter extends Moving {

   public playerId: number = -1;
   public friction: number = -1;
   public throttleMax: number = -1;

   constructor(data: RawData) {
      super(data);
      this.registerSetter(({ unitType: type, player }: RawData) => {
         this.playerId = player;
         this.friction = [ 0.2, 0.3, 0.25, 0.4 ][type];
         this.throttleMax = [ 300, 300, 300, 500 ][type];
      }, data);
   }

   public static fromData(data: RawData): Looter {
      if (data.unitType == 0) {
         return new Reaper(data);
      }
      if (data.unitType == 1) {
         return new Destroyer(data);
      }
      return new Doof(data);
   }

   getAcceleration(throttle: number) {
      return throttle / this.mass;
   }

   getFrictionLoss(speed: Vector) {
      return speed.multiply(1 - this.friction);
   }

   getThrottle(powerCoefficient: number): number {
      return Math.min(Math.max(powerCoefficient * this.throttleMax, 0), this.throttleMax);
   }

   abstract tick(data: Data): string;
}

class Reaper extends Looter {

   getThrottleVectorToWreck(w: Wreck): [ Vector,  number] {
      // Check if it is in the target
      const diff = w.position.sub(this.position);
      const distance = diff.euclidean();
      if (distance < w.radius && this.speed.euclidean() > 10) {
         // It is located in the wreck, so just wait?
         // STOP by creating throttle in the opposite vector
         const spd = this.speed.euclidean(); // The acceleration
         const anti = this.speed.multiply(-1); // Create the opposite Vector
         const requiredThrottle = spd * this.mass; // The required throttle to stop
         return [ anti, Math.min(requiredThrottle, this.throttleMax) ];
      } else {
         // Normalize the direction vector
         // Calculate throttle
         const vec = w.position;
         const t = Math.max(0, Math.min(/*(*/distance /*- w.radius) / 2*/, this.throttleMax));
         return [ vec, t ];
      }
   }
   getThrottleVectorToPosition(v: Vector): [ Vector,  number] {
      const diff = v.sub(this.position);
      const distance = diff.euclidean();
      
      const targetSpeedVector = diff;
      const throttle = Math.min(targetSpeedVector.euclidean() * this.mass, this.throttleMax);
      return [ targetSpeedVector, throttle ];
   }

   private metric(wreck: Wreck, data: Data): [ number, Vector ] { // The smaller, the better
      // Try to get density peak (by looking around each wreck, and calculate a centroid by looking at the radius of the Reaper) +the distance cost
      const aroundWrecks = data.wrecks().filter(x => (wreck.position.sub(x.position).euclidean() - wreck.radius - x.radius) < this.radius);
      const centroid = aroundWrecks.map(x => x.position).reduce((s, e) => s.add(e)).multiply(1 / aroundWrecks.length);
      const cnt = aroundWrecks.length;
      const sum = aroundWrecks.reduce((s, e) => s + e.quantity, 0);
      // What about getting the number of obstacles (only Looters idk) in the vicinity (a line with thickness of this radius) between the wreck and Reaper
      // return (wreck.position.sub(this.position).euclidean() / 500) - wreck.quantity;
      return [ (centroid.sub(this.position).euclidean() / 1500) - cnt /*- (sum / cnt)*/, centroid ];
   }

   tick(data: Data): string {
      // Find the closest puddle
      const wrecks = data.wrecks();

      if (wrecks.length == 0) {
         return "WAIT";
      }

      const closest = wrecks.map(x => ({ wreck: x, distanceData: this.metric(x, data) })).sort((a, b) => a.distanceData[0] - b.distanceData[0])[0];

      // Get orders
      const [ vector, throttle ] = this.getThrottleVectorToWreck(closest.wreck);
      // Go there
      return `${vector.x} ${vector.y} ${throttle.toFixed()}`;
   }
}

class Destroyer extends Looter {
   
   tick(data: Data): string {

      if (data.rage > 60) {
         const reaper = data.looters().find(x => x.playerId == 0 && x.type == 0);
         if (reaper && reaper.position.sub(this.position).euclidean() < 2000 && data.looters().filter(x => reaper.position.sub(x.position).euclidean() < 1000).length > 1) {
            return "SKILL " + reaper.position.x + " " + reaper.position.y;
         }
      }

      const tankers = data.tankers();

      if (tankers.length == 0) {
         return "WAIT";
      }

      const closest = tankers.map(x => ({ tanker: x, distance: x.position.sub(new Vector()).euclidean() })).sort((a, b) => a.distance - b.distance)[0];
      return `${closest.tanker.position.x} ${closest.tanker.position.y} ${this.throttleMax.toFixed()}`
   }

}

class Doof extends Looter {

   tick(data: Data): string {
      // Target other Reapers
      const closest = data.looters().filter(x => x.playerId != 0 && x.type == 0).map(x => ({ reaper: x, distance: x.position.sub(this.position).euclidean() })).sort((a, b) => a.distance - b.distance)[0];
      return `${closest.reaper.position.x} ${closest.reaper.position.y} ${this.throttleMax.toFixed()}`
      // return "WAIT";
   }

}

const reader = new ReaderTS();
const data = new Data();

while (true) {
   const myScore = parseInt(reader.readline());
   const enemyScore1 = parseInt(reader.readline());
   const enemyScore2 = parseInt(reader.readline());
   const myRage = parseInt(reader.readline());
   const enemyRage1 = parseInt(reader.readline());
   const enemyRage2 = parseInt(reader.readline());
   const unitCount = parseInt(reader.readline());

   for (let i = 0; i < unitCount; i++) {
      var inputs = reader.readline().split(' ');
      const unitId = parseInt(inputs[0]);
      const unitType = parseInt(inputs[1]);
      const player = parseInt(inputs[2]);
      const mass = parseFloat(inputs[3]);
      const radius = parseInt(inputs[4]);
      const x = parseInt(inputs[5]);
      const y = parseInt(inputs[6]);
      const vx = parseInt(inputs[7]);
      const vy = parseInt(inputs[8]);
      const extra = parseInt(inputs[9]);
      const extra2 = parseInt(inputs[10]);

      const dRaw = {
         unitId, unitType, player, mass, radius, x, y, vx, vy, extra, extra2
      };

      data.addOrUpdate(dRaw);
   }

   data.newTick(myRage);

   const mine = data.looters().filter(x => x.playerId == 0);
   const orders = mine.map(x => x.tick(data));
   // console.error(mine)
   console.log(orders.join("\n"));
}