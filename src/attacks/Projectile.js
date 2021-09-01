import Phaser from 'phaser'
import EffectManager from '../effects/EffectManager';


class Projectile extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,key)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed=300;
        this.maxDistance=300;
        this.traveledDistance=0;
        this.cooldown=500;
        this.damage=10;
        this.effectManager=new EffectManager(scene);
        this.body.setSize(this.width-13,this.height-20);
    }

    preUpdate(time,delta){
    super.preUpdate(time,delta);
    this.traveledDistance+=this.body.deltaAbsX();
    if(this.isOutOfRange())
        {
        this.body.reset(0,0);
        this.setActive(false);
        this.setVisible(false);
        this.traveledDistance=0;}

    }

    fire(x,y,anim)
    {   
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(x,y);
        this.setVelocityX(this.speed);
       anim&&this.play(anim,true);
    }

    deliversHit(enemy)
    {
    this.setActive(false);
    this.setVisible(false);
    const impactPosition={x:this.x,y:this.y};
    this.body.reset(0,0);
    this.traveledDistance=0;
    this.effectManager.playEffectOn('hit-effect',enemy,impactPosition);
    }
    isOutOfRange()
    {
        return this.traveledDistance&&this.traveledDistance>=this.maxDistance
    }
}

export default Projectile