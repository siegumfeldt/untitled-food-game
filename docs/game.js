const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Sprite = PIXI.Sprite;


PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
    width: 400,
    height: 400,
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
  animatedSprite.scale = new PIXI.Point(2, 2);
  animatedSprite.name = name;
  return animatedSprite;
}


function gameLoop(delta) {
  lanes.forEach(lane => {
    lane.children.forEach(food => {
      if(food.y > 300) {
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

  lanes[0].addChild(getIngredient("meat"));

  app.ticker.add((delta) => gameLoop(delta));
}


loader.add("assets/ingredients.png")
      .load(setup);
