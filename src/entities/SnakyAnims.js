






export default anims=>
{

    anims.create({
        key:'snakyidle',
        frames:anims.generateFrameNumbers('snaky',{start:0,end:8}),
        frameRate:8,
        repeat:-1
    });


    anims.create({
        key:'snakyhurt',
        frames:anims.generateFrameNumbers('snaky',{start:21,end:22}),
        frameRate:6,
        repeat:0
    });

    
} 