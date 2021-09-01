import Phaser from 'phaser';
import initAnims from'./PlayerAnims'
import collidable from'../mixins/collidable'
import anims from'../mixins/anims'
class Enemy extends Phaser.Physics.Arcade.Sprite{

constructor(scene,x,y,key)
{
    super(scene,x,y,key);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.init();
    this.initEvents();
    Object.assign(this,collidable);
    Object.assign(this,anims);
}


initEvents()
{
    this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this);
}


init()
{   

    this.gravity=500;
    this.speed=100;
    this.timeFromLestTurn=0;
    this.maxPatrolDistance=3000;
    this.currentPatrolDistance=0;
    this.platformCollidersLayer=null;
    this.health=30;
    this.rayGraphics=this.scene.add.graphics({lineStyle:{width:2,color:0xaa00aa}});
    this.body.setGravityY(500);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0.5,1);

    this.setVelocityX(this.speed);  
    this.damage=20;

}
update(time,delta)
{   

    this.patrol(time,delta);
    if(this,this.getBounds().bottom>600)
    {   
        this.scene.events.removeListener(Phaser.Scenes.Events.UPDATE,this.update,this);
        this.rayGraphics.clear();
        this.setActive(false);
        this.destroy();
        return;
    }

}
patrol(time,delta)
{   
    if(!this.body||!this.body.onFloor()){
        return;
    }

    this.currentPatrolDistance+=Math.abs(this.body.deltaX());
    const {ray,hasHit}=this.raycast(this.body,this.platformCollidersLayer,{raylenght:30,precision:2,steepnes:0.5});
    if((!hasHit||this.currentPatrolDistance>=this.maxPatrolDistance)&&this.timeFromLestTurn+100<time)
    {   
        this.setFlipX(!this.flipX);
        this.setVelocityX(this.speed=-this.speed);
        this.timeFromLestTurn=time;
        this.currentPatrolDistance=0;
    }
   // this.rayGraphics.clear();
    //this.rayGraphics.strokeLineShape(ray);
}

takesHit(source)
{   


    this.health-=source.damage;
    source.deliversHit(this);
    if(this.health<=0)
    {
        this.setTint(0xFF0000);
        this.setVelocity(0,-200);
        this.body.checkCollision.none=true;
        this.setCollideWorldBounds(false);
    }
}

setPlatformColliders(platformCollidersLayer)
{
    this.platformCollidersLayer=platformCollidersLayer;
}




}
export default Enemy