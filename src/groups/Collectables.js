import Phaser from 'phaser'
import Collectable from '../collectables/Collectable'

class Collectables extends Phaser.Physics.Arcade.StaticGroup{
    constructor(scene)
    {
        super(scene.physics.world,scene);

        this.createFromConfig({
            classType:Collectable

        })

    }


mapProperties(propertiesList)
{
    if(!propertiesList|| propertiesList.length===0)
    {
        return{};
    }

    return propertiesList.reduce((map,obj)=>{
    
        map[obj.name]=obj.value;
        return map;
    },{})
}


addCollectables(collectableLayer)
{   
    const{score:defaultScore,type}=this.mapProperties(collectableLayer.properties);
    collectableLayer.objects.forEach(collectableO=>{
        const a=this.get(collectableO.x,collectableO.y,type);
        const oProps=this.mapProperties(collectableO.properties);
        a.score=oProps.score||defaultScore;
    });

}


}


export default Collectables;