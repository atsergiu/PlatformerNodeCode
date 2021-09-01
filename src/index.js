
import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import PreloadScene from './scenes/PreloadScene';
import MenuScene from './scenes/MenuScene';
import LevelScene from './scenes/LevelScene';
const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;
const ZOOM_FACTOR = 1.25;
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: ZOOM_FACTOR,
  leftTopCorner: {
    x: ((WIDTH) - (WIDTH / ZOOM_FACTOR)) / 2,
    y: ((HEIGHT) - (HEIGHT / ZOOM_FACTOR)) / 2,
  },
  rightTopCorner: {
    x: ((WIDTH / ZOOM_FACTOR) + ((WIDTH) - (WIDTH / ZOOM_FACTOR)) / 2),
    y: ((HEIGHT) - (HEIGHT / ZOOM_FACTOR)) / 2,
  },
  rightBottomCorner: {
    x: ((WIDTH / ZOOM_FACTOR) + ((WIDTH) - (WIDTH / ZOOM_FACTOR)) / 2),
    y: ((HEIGHT / ZOOM_FACTOR) + ((HEIGHT-(HEIGHT / ZOOM_FACTOR)) / 2)),
  }

}

const Scenes = [PreloadScene,MenuScene,LevelScene, PlayScene];


const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  parent:'my-game',
  physics: {



    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: initScenes()
}

new Phaser.Game(config);
