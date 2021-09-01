import Phaser from 'phaser';
import Projectile from '../attacks/Projectile'
import collidable from'../mixins/collidable'
import { getTimestamp } from '../utils/functions';
class Projectiles extends Phaser.Physics.Arcade.Group{

constructor(scene,key)
{
    super(scene.physics.world,scene);
   this.createMultiple({
    frameQuantity:5,
    active:false,
    visible:false,
    key:key,
    classType:Projectile
   })
   this.timeFromLastAction=null;
}

fireProjectile(initiator,anim)
{
    const projectile=this.getFirstDead(false);
    if(!projectile){
        return;
    }
    if(this.timeFromLastAction&&this.timeFromLastAction+projectile.cooldown>getTimestamp())
        return;
    const center =initiator.getCenter();
    let centerX;

    if(initiator.lastDirection=== Phaser.Physics.Arcade.FACING_RIGHT)
    {
        projectile.speed=Math.abs(projectile.speed);
        projectile.setFlipX(false);
        centerX=center.x+12;
    }
    else {
        projectile.speed=-Math.abs(projectile.speed);
        projectile.setFlipX(true);
        centerX=center.x-12;
    }
    projectile.fire(centerX,center.y,anim);
    this.timeFromLastAction=getTimestamp();
}

}

export default Projectiles;