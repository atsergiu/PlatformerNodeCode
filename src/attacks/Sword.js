import Phaser from 'phaser'
import EffectManager from '../effects/EffectManager';


class Sword extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,key)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.weaponName=key;
        this.attackSpeed=1000;
        this.damage=15;
        this.weaponAnim=key+'-swing';
        this.effectManager=new EffectManager(scene);
        //this.body.setSize(this.width-13,this.height-20);
        this.wielder=null;
        this.setOrigin(0.5,1);
        this.setDepth(10);
        this.activateWeapon(false)
        this.on('animationcomplete',animation=>{
            if(animation.key===this.weaponAnim){
                this.activateWeapon(false);
                this.body.reset(0,0);
                this.body.checkCollision.none=false;
            }
        })
    }

    preUpdate(time,delta){
        super.preUpdate(time,delta);
        if(!this.active)
        {
            return;
        }
        if(this.wielder.lastDirection===Phaser.Physics.Arcade.FACING_RIGHT){
            this.setFlipX(false);
            this.body.reset(this.wielder.x+20,this.wielder.y)
        }
        else{
            this.setFlipX(true);
            this.body.reset(this.wielder.x-20,this.wielder.y);
        }

    }

    deliversHit(enemy)
    {
    const impactPosition={x:this.x,y:this.getRightCenter().y};
    this.body.checkCollision.none=true;
    this.effectManager.playEffectOn('hit-effect',enemy,impactPosition);
}



    swing(wielder){
    this.wielder=wielder;
    this.activateWeapon(true);
    this.anims.play(this.weaponAnim,true);

    }

    activateWeapon(x)
    {   
        this.setActive(x)
        this.setVisible(x);
    }
    
}

export default Sword