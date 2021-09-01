import Phaser from 'phaser';
import Player from '../entities/Player'
import Enemies from '../groups/Enemies'
import initAnims from '../anims/index'
import Collectables from '../groups/Collectables';
import HUD from '../hud';
import EventEmitter from '../events/Emitter';
class PlayScene extends Phaser.Scene {



    constructor(config) {

        super('PlayScene');
        this.config=config;
    }


    create({gameStatus}) {
        initAnims(this.anims);
        this.score=0;

        this.playBgMusic();
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerZones=this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones);
        
        const enemies=this.createEnemies(layers.enemyZones,layers.collidable);
        const collectables=this.createCollectables(layers.collectables);
        this.hud=new HUD(this,0,0);
        this.createBackButton();
        this.createPlayerColliders(player, {
            colliders: {
                collidable: layers.collidable,
                projectiles:enemies.getProjectiles(),
                collectables:collectables,
                traps:layers.traps,
            }
        });
        this.createEnemyColiders(enemies , {
            colliders: {
                collidable: layers.collidable,
                player:player,
            }
        });
        this.collectSound=this.sound.add('coin-pickup',{volume:0.2});

        this.createEndOfLevel(playerZones.end,player);
        this.setupFollowupCameraOn(player);

        if(gameStatus==='PLAYER_LOOSE'){
            return;
        }
        this.createGameEvents();


    }

    createGameEvents(){
        EventEmitter.on('PLAYER_LOOSE',()=>{
            this.theme.stop();
            this.scene.restart({gameStatus:'PLAYER_LOOSE'});
            console.log('hel');
        })
    }

    playBgMusic()
    {
        this.theme=this.sound.add('theme',{loop:true,volume:0.1});
        this.theme.play();

    }
    createMap() {
        const map = this.make.tilemap({ key: `map${this.getCurrentLevel()}`});
        const tileset1 = map.addTilesetImage('main_lev_build_1', 'tiles-1');
        const tileset3 = map.addTilesetImage('bg_spikes_tileset', 'bg-spikes-tileset');
        const tileset2 = map.addTilesetImage('main_lev_build_2', 'tiles-2');
        return map;

    }

    createLayers(map) {
        const tileset = map.getTileset('main_lev_build_1');
        const tilesetBg=map.getTileset('bg_spikes_tileset');
        this.createBG(map);
        const bg = map.createStaticLayer('distance', tilesetBg).setDepth(-12);
        const collidable = map.createStaticLayer('collidable', tileset).setAlpha(0);
        const enviroment = map.createStaticLayer('enviroment', tileset).setDepth(-2);
        const platforms = map.createStaticLayer('platforms', tileset);
        const playerZones=map.getObjectLayer('player_zones');
        const enemyZones=map.getObjectLayer('enemy_zones');
        const collectables=map.getObjectLayer('collectables');
        const traps=map.createStaticLayer('traps', tileset);
        collidable.setCollisionByProperty({ collides: true });
        traps.setCollisionByExclusion(-1);
        return { enviroment, platforms, collidable,playerZones,enemyZones,collectables,traps };
    }


    createBG(map)
    {
        const bgObject=map.getObjectLayer('distanceBg').objects[0];
        this.spikeImg=this.add.tileSprite(bgObject.x,bgObject.y,this.config.width,bgObject.height,'bg-spikes-dark').setOrigin(0,1).setDepth(-10).setScrollFactor(0,1);
    
        this.skyImg=this.add.tileSprite(0,0,this.config.width,180,'bg-sky').setOrigin(0,0).setDepth(-11).setScrollFactor(0,1);
    }

    createEnemies(spawnLayer,colliders)
    {   
        const enemies=new Enemies(this);
        const enemyTypes=enemies.getTypes();
        spawnLayer.objects.map(spawnPoint=>{

            const enemy=new  enemyTypes[spawnPoint.type](this,spawnPoint.x,spawnPoint.y);
            enemy.setPlatformColliders(colliders);
            enemies.add(enemy);
        })
        return enemies;
    }
    onPlayerCollision(enemy,player)
    {
        player.takesHit(enemy);
    }
    createEnemyColiders(enemies, { colliders }) {


        enemies.addColiider(colliders.collidable);
        enemies.addColiider(colliders.player,this.onPlayerCollision);
        enemies.addColiider(colliders.player.projectiles,this.onHit);
        enemies.addOverlap(colliders.player.meleeWeapon,this.onHit);

    }

    createCollectables(collectableLayer)
    {
        const collectables=new Collectables(this).setDepth(-1);
        collectables.addCollectables(collectableLayer);
        collectables.playAnimation('diamond-anim');
        return collectables;
    }


    onCollect(entity,collectable)
    {   
        this.collectSound.play();
        this.score+=collectable.score;
        this.hud.updateScoreboard(this.score);
        collectable.disableBody(true,true);
    }

    createPlayer({start}) {
        return new Player(this, start.x, start.y);
    }


    onHit(entity,source)
    {
        entity.takesHit(source);
    }

    createPlayerColliders(player, { colliders }) {
        player.addColiider(colliders.collidable);
        player.addColiider(colliders.projectiles,this.onHit);
        player.addColiider(colliders.traps,this.onHit);
        player.addOverlap(colliders.collectables,this.onCollect,this);
    }

    createBackButton()
    {
       const btn= this.add.image(this.config.rightBottomCorner.x,this.config.rightBottomCorner.y,'back').setScrollFactor(0).setScale(2).setInteractive().setOrigin(1);
    
        btn.on('pointerup',()=>{
            this.theme.stop();
            this.scene.start('MenuScene');
        })
    }

    setupFollowupCameraOn(player){
        const{height,width,mapOffset}=this.config;
        this.physics.world.setBounds(0,0,width+mapOffset,height+200);
        this.cameras.main.setBounds(0,0,width+mapOffset,height+200).setZoom(1.25);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer){
    const playerZones=playerZonesLayer .objects;
    return {
        start:playerZones.find(zone=>zone.name==='startZone'),
        end:playerZones.find(zone=>zone.name==='endZone')
    }
    }


    getCurrentLevel(){

        return this.registry.get('level')||1;
    }
    createEndOfLevel(end,player){
       const endOfLevel= this.physics.add.sprite(end.x,end.y,'end').setAlpha(0).setSize(5,this.config.height*2);
        
        const eolOverlap=this.physics.add.overlap(player,endOfLevel,()=>{
            eolOverlap.active=false;
            this.registry.inc('level',1);
            if(this.getCurrentLevel()==3)
                this.registry.set('level',1);
            this.theme.stop();
            this.scene.restart({gameStatus:'LEVEL_COMPLETED'});
        })
    
    
    }

    update() {
       this.spikeImg.tilePositionX=this.cameras.main.scrollX*0.3;
       this.skyImg.tilePositionX=this.cameras.main.scrollX*0.1;
    }


}
export default PlayScene;