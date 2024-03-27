let flock;
let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-canvas');
  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 200; i++) {
    let b = new Boid(random(width), random(height));
    flock.addBoid(b);
  }
}

function draw() {
  background(255);
  flock.run();
}

// Boid class
class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 1.3;
    this.maxspeed = 4;    // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
    this.attractionRadius = 200; // Radius within which attraction to mouse occurs
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  flock(boids) {
    let sep = this.separate(boids); // Separation
    let ali = this.align(boids);    // Alignment
    let coh = this.cohesion(boids); // Cohesion
    let attract = this.attractToMouse(); // Attraction to mouse
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    attract.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
    this.applyForce(attract);
  }

  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the position to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  }

  render() {
    // Draw a pixelated black circle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(0); // Set fill color to black
    noStroke(); // Remove stroke
    push();
    translate(floor(this.position.x), floor(this.position.y)); // Using floor to ensure integer coordinates
    rotate(theta);
    scale(1 / pixelDensity()); // Scale to maintain pixelation
    ellipse(0, 0, this.r * 4, this.r * 4); // Making the shapes bigger
    pop();
}


  borders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  separate(boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }
    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(boids) {
    let neighbordist = 30;
    let sum = createVector(0, 0); // Start with empty vector to accumulate all positions
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.position); // Add position
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum); // Steer towards the position
    } else {
      return createVector(0, 0);
    }
  }

  attractToMouse() {
    let mousePos = createVector(mouseX, mouseY);
    let attraction = createVector(0, 0);
    let d = p5.Vector.dist(this.position, mousePos);
    if (d < this.attractionRadius) {
        attraction = p5.Vector.sub(mousePos, this.position); // Vector pointing from boid to mouse
        attraction.setMag(this.maxspeed * 10); // Increase the speed by multiplying with 2 (adjust this value as needed)
        attraction.sub(this.velocity * 10); // Steering = Desired - Velocity
        attraction.limit(this.maxforce * 2); // Limit to maximum steering force
    }
    return attraction;
}

}

// Flock class
class Flock {
  constructor() {
    this.boids = [];
  }

  run() {
    for (let boid of this.boids) {
      boid.run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}