const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Sprite = PIXI.Sprite;


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: 400,
    height: 600,
    antialias: false
});

app.renderer.backgroundColor = 0x000000;

const ingredientTextures = {};
const lanes = [];

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

function getIngredient(name) {
  animatedSprite = new PIXI.AnimatedSprite(ingredientTextures[name]);
  animatedSprite.animationSpeed = 0.2;
  animatedSprite.play();
  animatedSprite.anchor = new PIXI.Point(0.5, 0.5);
  animatedSprite.scale = new PIXI.Point(4, 4);
  animatedSprite.name = name;
  return animatedSprite;
}

const level = [
  {"frame": 60, "lane": 0, "ingredient": "top-bun"},
  {"frame": 120, "lane": 0, "ingredient": "meat"},
  {"frame": 180, "lane": 0, "ingredient": "top-bun"}
]

let nextLevelItemIndex = 0;
let totalDelta = 0;

let plate = null;


function gameLoop(delta) {
  totalDelta += delta;
  if(nextLevelItemIndex < level.length && totalDelta > level[nextLevelItemIndex].frame) {
    const nextLaneNumber = level[nextLevelItemIndex].lane;
    const nextIngredient = level[nextLevelItemIndex].ingredient;
    lanes[nextLaneNumber].addChild(getIngredient(nextIngredient));
    nextLevelItemIndex += 1;
  }
  lanes.forEach(lane => {
    lane.children.forEach(food => {
      if(food.y > 650) {
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
  addLane(0);

  let plate = new PIXI.Sprite(resources["assets/plate.png"].texture);
  plate.scale = new PIXI.Point(4, 4);
  plate.x = 100;
  plate.y = 550;
  plate.anchor = new PIXI.Point(0.5, 0.5);
  app.stage.addChild(plate);

  app.ticker.add(gameLoop);
}


loader.add("assets/ingredients.png")
      .add("assets/plate.png")
      .load(setup);
