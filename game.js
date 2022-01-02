const Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    resources = PIXI.Loader.shared.resources,
    Texture = PIXI.Texture,
    Rectangle = PIXI.Rectangle,
    Sprite = PIXI.Sprite;

const app = new PIXI.Application({
    width: 400,
    height: 400,
    antialias: true
});

app.renderer.backgroundColor = 0x000000;

const ingredientTextures = {}

function loadIngredientTextures(name){
  const sheet = resources["assets/" + name + ".png"].texture;
  ingredientTextures[name] = new Array();
  for (let i = 0; i < 16; i++) {
    ingredientTextures[name].push(new Texture(sheet, new Rectangle(16*i, 0, 16, 16)));   
  }
}

function getIngredient(name) {
  animatedSprite = new PIXI.AnimatedSprite(ingredientTextures[name]);
  animatedSprite.animationSpeed = 0.2;
  animatedSprite.play();
  return animatedSprite;
}


function gameLoop(delta) {
  
}

function setup() {
  loadIngredientTextures("meat");
  const s = getIngredient("meat");
  app.stage.addChild(s);
  app.ticker.add((delta) => gameLoop(delta));
}


loader.add("assets/meat.png")
      .load(setup);
