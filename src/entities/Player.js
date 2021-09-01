import Phaser from 'phaser';
import initAnims from'./PlayerAnims'
import collidable from'../mixins/collidable'
import HealthBar from '../hud/Healthbar' 
import Projectiles from '../groups/Projectiles'
import anims from'../mixins/anims'
import Sword from '../attacks/Sword'
import { getTimestamp } from '../utils/functions';
import EventEmitter from '../events/Emitter';
class Player extends Phaser.Physics.Arcade.Sprite{

constructor(scene,x,y)
{
    super(scene,x,y,'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.init();
    this.initEvents();
    Object.assign(this,collidable);
    Object.assign(this,anims);
}


init()
{   
    this.cursors=this.scene.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D',space:'SPACE' });
    this.gravity=500;
    this.jumpCount=0;
    this.consecutiveJumps=1;
    this.playerSpeed=150;
    this.health=100;
    this.isSliding=false;
    this.body.setGravityY(500);
    this.hasBeenHit=false;
    this.jumpSound=this.scene.sound.add('jump',{volume:0.2});
    this.projSound=this.scene.sound.add('proj-atk',{volume:0.2});
    this.stepSound=this.scene.sound.add('running',{volume:0.2});
    this.swipeSound=this.scene.sound.add('swipe',{volume:0.2});
    this.hp=new HealthBar(this.scene,this.scene.config.leftTopCorner.x+10,this.scene.config.leftTopCorner.y+10,2,this.health);
    this.bounceVelocity=180;
    this.lastDirection=Phaser.Physics.Arcade.FACING_RIGHT;
    this.body.setSize(20,36);
    this.timeFromLastSwing=null;

    this.projectiles=new Projectiles(this.scene,'iceball');
    this.meleeWeapon=new Sword(this.scene,0,0,'sword-attack');
    this.setCollideWorldBounds(true);
    this.setOrigin(0.5,1);
    initAnims(this.scene.anims);
    this.handleAttacks();
    this.handleMovements();



    this.scene.time.addEvent({
        delay:300,
        repeat:-1,
        callbackScope:this,
        callback:()=>{
            if(this.isPlayingAnims('run'))
                this.stepSound.play();

        }
    })

}

handleAttacks(){
    this.scene.input.keyboard.on('keydown-Q',()=>
    {   
        this.projSound.play();
        this.play('throw',true);
        this.projectiles.fireProjectile(this,'iceball');
    });
    this.scene.input.keyboard.on('keydown-E',()=>
    {   
        if(this.timeFromLastSwing&&
            this.timeFromLastSwing+this.meleeWeapon.attackSpeed>getTimestamp())
                return;
        this.swipeSound.play();
        this.play('throw',true);
        this.meleeWeapon.swing(this);
        this.timeFromLastSwing=getTimestamp();
    });
}

initEvents()
{
    this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);
}

update(){
    if(this.hasBeenHit||this.isSliding||!this.body)
        return;

    if(this.getBounds().top>this.scene.config.height+100){
        EventEmitter.emit('PLAYER_LOOSE');
        return;
    }

    const {left,right,space,down}=this.cursors;
    const isSpaceJustDown=Phaser.Input.Keyboard.JustDown(space);
    const onFloor=this.body.onFloor();

        if(left.isDown){
            this.setVelocityX(-this.playerSpeed);
            this.setFlipX(true);
            this.lastDirection=Phaser.Physics.Arcade.FACING_LEFT;
        }
        else if(right.isDown){
            this.setVelocityX(this.playerSpeed);
            this.setFlipX(false);
            this.lastDirection=Phaser.Physics.Arcade.FACING_RIGHT;
        }
        else{
            this.setVelocityX(0);
        }

        if(isSpaceJustDown&&(onFloor||this.jumpCount<this.consecutiveJumps)){
            this.setVelocityY(-300);
            this.jumpCount++;
            this.jumpSound.play();
        }
        if(onFloor)
        {
            this.jumpCount=0;
        }
        if(this.isPlayingAnims('throw')){
            return;

        }
        onFloor?
            this.body.velocity.x!==0?
                this.play('run',true):this.play('idle',true):
            this.play('jump',true);

}

playDamageTween(){
    return this.scene.tweens.add({
        targets:this,
        duration:100,
        repeat:-1,
        tint:0xffffff,

    });
}

handleMovements()
{
    this.scene.input.keyboard.on('keydown-S',()=>
    {       
        if(!this.body.onFloor()) return;
        this.isSliding=true;
        this.body.setSize(this.width,this.height/2);
            this.setOffset(0,this.height/2);
            this.setVelocityX(0);
            this.play('slides',true);
    });
    this.scene.input.keyboard.on('keyup-S',()=>
    {   
        this.body.setSize(this.width,38);
            this.setOffset(0,0);
            this.isSliding=false;
    });
}



takesHit(source)
{   if(this.hasBeenHit)
        return;  


    this.health-=source.damage||source.properties.damage||0;
    if(this.health<=0){
         EventEmitter.emit('PLAYER_LOOSE');
    return;

    }
    
    this.hasBeenHit=true;
    this.bounceOff(source);
    this.hp.decrease(this.health);
    const tween=this.playDamageTween();
    if(source.deliversHit)
    source.deliversHit(this);

    this.scene.time.delayedCall(500, ()=>{
        this.hasBeenHit=false;
        tween.stop();
        this.clearTint();
    });
}
bounceOff(source)
{
    if(source.body){
        this.body.touching.right ?
    this.setVelocityX(-this.bounceVelocity):
    this.setVelocity(this.bounceVelocity);
    }
    else{
        this.body.blocked.right ?
    this.setVelocityX(-this.bounceVelocity):
    this.setVelocity(this.bounceVelocity);
    }
    setTimeout(()=>this.setVelocityY(-this.bounceVelocity),0);

}
}
export default Player