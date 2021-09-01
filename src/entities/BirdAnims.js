






export default anims=>
{

    anims.create({
        key:'birdidle',
        frames:anims.generateFrameNumbers('birdman',{start:0,end:12}),
        frameRate:8,
        repeat:-1
    });


    anims.create({
        key:'birdhurt',
        frames:anims.generateFrameNumbers('birdman',{start:25,end:26}),
        frameRate:6,
        repeat:0
    });

    
} 