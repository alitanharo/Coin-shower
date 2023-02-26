// ----- Start of the assigment ----- //
class Coin {
	constructor(velocityX, velocityY, animationSpeed, lifeTime, startDelay, rotationSpeed) {
		// Create sprite
		let sprite = game.sprite("CoinsGold000");
		sprite.pivot.set(sprite.width / 2, sprite.height / 2); // Set pivot to center of sprite
		sprite.scale.set(0.24);
		this.sprite = sprite;

		// Set initial position
		sprite.x = game.renderer.view.width / 2; // Center of screen
		sprite.y = game.renderer.view.height + 20; // Just off the bottom of the screen

		// Set velocity
		this.velocityX = velocityX;
		this.velocityY = velocityY;

		// Set sprite animation parameters
		this.num = 0;
		this.animationSpeed = animationSpeed;

		// Set rotation speed
		this.rotationSpeed = rotationSpeed;

		// Set delay and lifetime parameters
		this.startDelay = startDelay;
		this.lifeTime = lifeTime;
		this.timeSpent = 0;
	}

	update() {
		this.timeSpent += 0.1;

		// Wait for start delay to expire before updating position
		if (this.startDelay <= 0) {
			// Update position
			this.sprite.y += this.velocityY;
			this.sprite.x += this.velocityX;

			// Bounce on top and bottom walls
			if (this.sprite.y < 0) {
				this.velocityY *= -1;
			}
			if (this.sprite.y > 470) {
				this.velocityY *= -0.5;
				this.velocityX *= 0.85;
			}

			// Bounce on left and right walls
			if (this.sprite.x < 0 || this.sprite.x > 800) {
				this.velocityX *= -1;
			}

			// Apply gravity
			this.velocityY += 0.1;

			// Update animation
			this.num += this.animationSpeed;

			// Update rotation
			this.sprite.rotation += this.rotationSpeed;

			// Reset animation if it has completed
			if (this.num >= 8) {
				this.num = 0;
			}
		}

		// Decrement start delay
		this.startDelay--;

		// Fade out sprite when its lifetime expires
		if (this.timeSpent > this.lifeTime) {
			this.sprite.alpha -= 0.02;
		}
	}
}


class CoinShower {
	constructor(startTime, angularSpread, timeSpread, velocity, count, duration) {
		this.coins = [];

		// How long before the shower should start (in seconds)
		this.startTime = startTime;

		// How spread out the coins should be (in frames)
		this.timeSpread = timeSpread;

		// Approximate velocity of coins
		this.approxVelocity = velocity;

		// Number of coins to create
		this.count = count;

		// Duration of coins' lifetime
		this.duration = duration;

		// Whether or not the shower has been executed
		this.isExecuted = false;

		// Angular spread of coins' direction (in degrees)
		this.angularSpread = angularSpread;
	}

	setUp() {
		// Create coin objects
		for (let i = this.count; i > 0; i--) {
			// Set behavior with some magic numbers that look good
			// Add randomness for a more realistic look
			const coinVelocity = (Math.random() * 25 + 40) * this.approxVelocity;

			// Animation speed is a function of velocity (faster moving coins will also spin faster)
			const animationSpeed = coinVelocity * .04;

			// We don't want all coins to start flying immediately so let's add a delay controlled by timeSpread
			const startDelay = Math.random() * this.timeSpread;

			// Randomize rotation speed to add variation in spinning
			const rotationSpeed = Math.random() * .04 - .02;

			// Randomize coin's duration
			const coinDuration = Math.random() * 5 + this.duration;

			// Generate random upward angle within the angular spread
			const directionAngle = Math.random() * this.angularSpread - (this.angularSpread / 2) - 90;

			// Convert angle to radians
			const dirRadians = directionAngle * (Math.PI / 180);

			// Convert angle to vector format and multiply it with velocity
			const velX = Math.cos(dirRadians) * coinVelocity;
			const velY = Math.sin(dirRadians) * coinVelocity;

			this.coins.push(new Coin(velX, velY, animationSpeed, coinDuration, startDelay, rotationSpeed));
		}
	}
}


class ParticleSystem extends PIXI.Container {
	constructor() {
		super();

		// Set the default start time and duration for the system
		this.start = 0;
		this.duration = 100000;

		// Create an array to store all the coin showers
		const coinShowers = []
		this.coinShowers = coinShowers;

		// Create an array to store currently running showers
		const currentlyRunningShowers = []
		this.currentlyRunningShowers = currentlyRunningShowers;

		// Define the properties for each coin shower and add them to the array
		let shower1 = new CoinShower(0, 20, 10, .12, 20, 5);
		let shower2 = new CoinShower(2, 7, 10, .12, 50, 7);
		let shower3 = new CoinShower(5, 20, 300, .18, 200, 23);
		let shower4 = new CoinShower(8, 90, 30, .36, 300, 6);
		let shower5 = new CoinShower(10, 30, 30, .14, 30, 9);
		let shower6 = new CoinShower(12, 30, 30, .30, 500, 9);
		let shower7 = new CoinShower(14, 15, 40, .50, 300, 20);
		let shower8 = new CoinShower(18, 15, 15, .15, 50, 5);
		let shower9 = new CoinShower(19, 20, 10, .12, 10, 5);

		coinShowers.push(shower1);
		coinShowers.push(shower2);
		coinShowers.push(shower3);
		coinShowers.push(shower4);
		coinShowers.push(shower5);
		coinShowers.push(shower6);
		coinShowers.push(shower7);
		coinShowers.push(shower8);
		coinShowers.push(shower9);
		

		// Add all the coins from each shower to the display object
		for (let i = 0; i < this.coinShowers.length; i++) {
			let shower = this.coinShowers[i];
			shower.setUp();
			for (let i = 0; i < shower.coins.length; i++) {
				this.addChild(shower.coins[i].sprite);
			}
		}
	}

	animTick(nt, lt, gt) {
		// Loop through the coinShowers array to see if it's time to add one to currently running showers
		for (let i = 0; i < this.coinShowers.length; i++) {
			let shower = this.coinShowers[i];
			// If local time is more than startTime of this coin shower, we should run it
			if (shower.isExecuted == false)
				if (shower.startTime <= lt / 1000) {
					this.currentlyRunningShowers.push(shower);

					// The isExecuted flag keeps us from adding it more than once
					shower.isExecuted = true;
				}
		}

		// Loop through the currently running showers and update all the coins inside them
		// and draw them to the screen
		for (let j = 0; j < this.currentlyRunningShowers.length; j++) {
			let shower = this.currentlyRunningShowers[j];

			for (let i = 0; i < shower.coins.length; i++) {
				// Update the position of each coin
				shower.coins[i].update();

				// Set the texture of each coin based on its frame number
				let num = ("00" + Math.floor(shower.coins[i].num));
				game.setTexture(shower.coins[i].sprite, "CoinsGold" + num);
			}
		}
	}
}


// ----- End of the assigment ----- //

class Game {
	constructor(props) {
		this.totalDuration = 0;
		this.effects = [];
		this.renderer = new PIXI.WebGLRenderer(800, 450);

		document.body.appendChild(this.renderer.view);
		this.stage = new PIXI.Container();

		this.loadAssets(props && props.onload);
	}
	loadAssets(cb) {
		let textureNames = [];
		// Load coin assets
		for (let i = 0; i <= 8; i++) {
			let num = ("000" + i).substr(-3);
			let name = "CoinsGold" + num;
			let url = "gfx/CoinsGold/" + num + ".png";
			textureNames.push(name);
			PIXI.loader.add(name, url);
		}
		PIXI.loader.load(function (loader, res) {
			// Access assets by name, not url
			let keys = Object.keys(res);
			for (let i = 0; i < keys.length; i++) {
				var texture = res[keys[i]].texture;
				if (!texture) continue;
				PIXI.utils.TextureCache[keys[i]] = texture;
			}
			// Assets are loaded and ready!
			this.start();
			cb && cb();
		}.bind(this));
	}
	start() {
		this.isRunning = true;
		this.t0 = Date.now();
		update.bind(this)();
		function update() {
			if (!this.isRunning) return;
			this.tick();
			this.render();
			requestAnimationFrame(update.bind(this));
		}
	}
	addEffect(eff) {
		this.totalDuration = Math.max(this.totalDuration, (eff.duration + eff.start) || 0);
		this.effects.push(eff);
		this.stage.addChild(eff);
	}
	render() {
		this.renderer.render(this.stage);
	}
	tick() {
		let gt = Date.now();
		let lt = (gt - this.t0) % this.totalDuration;
		for (let i = 0; i < this.effects.length; i++) {
			let eff = this.effects[i];
			if (lt > eff.start + eff.duration || lt < eff.start) continue;
			let elt = lt - eff.start;
			let ent = elt / eff.duration;
			eff.animTick(ent, elt, gt);
		}
	}
	sprite(name) {
		return new PIXI.Sprite(PIXI.utils.TextureCache[name]);
	}
	setTexture(sp, name) {
		sp.texture = PIXI.utils.TextureCache[name];
		if (!sp.texture) console.warn("Texture '" + name + "' don't exist!")
	}
}

window.onload = function () {
	window.game = new Game({
		onload: function () {
			game.addEffect(new ParticleSystem());
		}
	});
}


