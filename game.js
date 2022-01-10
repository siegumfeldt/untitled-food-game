
import { Plate } from './modules/plate.js';

const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Point = PIXI.Point,
    Sprite = PIXI.Sprite;


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: 600,
    height: 600,
    antialias: false
});

app.renderer.backgroundColor = 0x000000;

const ingredientTextures = {};
const lanes = [];
const keymap = {
  "z": 100,
  "x": 200,
  "c": 300,
  "v": 400
};

function addLane(number) {
  const lane = new PIXI.Container();
  lane.x = 100 + number*200;
  lanes[number] = lane;
  app.stage.addChild(lane);
}

function loadIngredientTextures(name, row){
  const sheet = resources["assets/ingredients.png"].texture;
  ingredientTextures[name] = new Array();
  for (let col = 0; col < 16; col++) {
    ingredientTextures[name].push(new Texture(sheet, new Rectangle(col*16, row*16, 16, 16)));   
  }
}

function getAnimatedIngredient(name) {
  const animatedSprite = new PIXI.AnimatedSprite(ingredientTextures[name]);
  animatedSprite.animationSpeed = 0.2;
  animatedSprite.play();
  animatedSprite.anchor = new Point(0.5, 0.5);
  animatedSprite.scale = new Point(4, 4);
  animatedSprite.name = name;
  return animatedSprite;
}

function getIngredient(name) {
  return new Sprite(ingredientTextures[name][0]);
}

const level = [
  {"frame": 60, "lane": 0, "ingredient": "under-bun"},
  {"frame": 120, "lane": 0, "ingredient": "meat"},
  {"frame": 180, "lane": 0, "ingredient": "top-bun"}
]

function collides(foodSprite, plate) {
  return foodSprite.parent.x == plate.x && foodSprite.y > 500 && foodSprite.y < 550;
}
let nextLevelItemIndex = 0;
let totalDelta = 0;

let plate = null;

function gameLoop(delta) {
  totalDelta += delta;
  if(nextLevelItemIndex < level.length && totalDelta > level[nextLevelItemIndex].frame) {
    const nextLaneNumber = level[nextLevelItemIndex].lane;
    const nextIngredient = level[nextLevelItemIndex].ingredient;
    lanes[nextLaneNumber].addChild(getAnimatedIngredient(nextIngredient));
    nextLevelItemIndex += 1;
  }
  lanes.forEach(lane => {
    lane.children.forEach(food => {
      if(food.y > 650) {
        food.destroy();
      } else if(collides(food, plate)) {
        console.log(food.name);
        food.destroy();
      } else {
        food.y += delta;
      }
    })
  })
}

function setup() {
  loadIngredientTextures("meat", 0);
  loadIngredientTextures("top-bun", 1);
  loadIngredientTextures("under-bun", 2);
  addLane(0);

  plate = new PIXI.Sprite(resources["assets/plate.png"].texture);
  plate.scale = new Point(4, 4);
  plate.x = 100;
  plate.y = 550;
  plate.anchor = new Point(0.5, 0.5);
  app.stage.addChild(plate);

  function keyListener(event) {
    plate.x = keymap[event.key];
  }  

  window.addEventListener("keydown", keyListener)

  app.ticker.add(gameLoop);
}


loader.add("assets/ingredients.png")
      .add("assets/plate.png")
      .load(setup);


console.log(Plate)

document.body.appendChild(app.view);