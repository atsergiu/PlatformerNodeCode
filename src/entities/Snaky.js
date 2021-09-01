import Enemy from './Enemy'
import initAnims from './SnakyAnims'
import Projectiles from '../groups/Projectiles'

class Snaky extends Enemy{

constructor(scene,x,y)
{
    super(scene,x,y,'snaky');
    initAnims(scene.anims);
    this.scene=scene;
}


init()
{
    super.init();
    this.speed=50;
    this.setSize(12,45);
    this.setOffset(10,15);
    this.projectiles=new Projectiles(this.scene,'fireball-1');
    this.timeFromLastAttack=0;
    this.attackDelay=this.getAttackDelay();
    this.lastDirection=null;
}


getAttackDelay()
{
    return Phaser.Math.Between(1000,4000);
}


update(time,delta)
{

    if(!this.active)
    return;
if(this.body.velocity.x>0)
{
    this.lastDirection=Phaser.Physics.Arcade.FACING_RIGHT;
}
else
this.lastDirection=Phaser.Physics.Arcade.FACING_left;

    if(this.timeFromLastAttack+this.attackDelay<=time)
    {
        this.projectiles.fireProjectile(this,'fireball');
        this.timeFromLastAttack=time;
        this.attackDelay=this.getAttackDelay();
    }

    super.update(time,delta);
    if(!this.active)
        return;
    if(this.isPlayingAnims('snakyhurt'))
        return;
    this.play('snakyidle',true);
}

takesHit(source)
{
    super.takesHit(source);
    this.play('snakyhurt',true);
}


}
export default Snaky