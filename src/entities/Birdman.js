import Enemy from './Enemy'
import initAnims from './BirdAnims'
class Birdman extends Enemy{

constructor(scene,x,y)
{
    super(scene,x,y,'birdman');
    initAnims(scene.anims);
    this.setSize(20,45);
    this.setOffset(7,20);
}


update(time,delta)
{

    super.update(time,delta);
    if(!this.active)
        return;
    if(this.isPlayingAnims('birdhurt'))
        return;
    this.play('birdidle',true);
}

takesHit(source)
{
    super.takesHit(source);
    this.play('birdhurt',true);
}


}
export default Birdman