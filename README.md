                    **********Particle System***********


Overview:
This is a particle system  that creates a shower of coins with animations and physics simulation. The particles (coins) are generated randomly with various physical and animation properties. The main logic is in three classes: 
Coin, CoinShower and ParticleSystem.

Coin class:
The Coin class defines the behavior of a single coin particle. It contains properties such as velocity, animation speed, rotation speed, and lifetime. It also contains methods to update the position of the coin, apply physics simulation, and animate the sprite.

CoinShower class:
The CoinShower class defines the behavior of a group of coins. It creates a group of coins with properties specified in its constructor. The properties include start time, angular spread, time spread, velocity, count, and duration. This class creates an array of coins using the Coin class and stores them in the coins property.

ParticleSystem class:
The ParticleSystem class is the main class that creates the showers of coins. It creates an array of CoinShowers and stores them in the coinShowers property. It also creates an array of currently running showers and stores them in the currentlyRunningShowers property. The class also contains methods to add and remove showers and update the state of each shower.


How to use

To use the system, simply create a new instance of ParticleSystem and add it to the stage of your PIXI application. By default, the ParticleSystem will create two CoinShower objects, but you can add more showers or modify the existing ones to create your desired effect.

The CoinShower constructor takes six parameters: startTime, angularSpread, timeSpread, velocity, count, and duration. These parameters control the timing and behavior of the coins created by the shower.

The Coin constructor takes six parameters: velocityX, velocityY, animationSpeed, lifeTime, startDelay, and rotationSpeed. These parameters control the movement, animation, and lifetime of the coin.

Example:

// Create an instance of the ParticleSystem class
const particleSystem = new ParticleSystem();

// Create a CoinShower and add it to the particle system
const shower = new CoinShower(0, 20, 10, .12, 20, 5);
coinShowers.push(shower);

// Start the particle system
Run the index.html in a server.







Credits:
This project is created using PIXI.js library


Author: Ali Tanharo
