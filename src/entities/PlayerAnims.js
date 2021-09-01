






export default anims=>
{

    anims.create({
        key:'idle',
        frames:anims.generateFrameNumbers('player',{start:0,end:7}),
        frameRate:6,
        repeat:-1
    });


    anims.create({
        key:'run',
        frames:anims.generateFrameNumbers('player',{start:11,end:16}),
        frameRate:6,
        repeat:-1
    });

    anims.create({
        key:'jump',
        frames:anims.generateFrameNumbers('player',{start:17,end:23}),
        frameRate:2,
        repeat:1
    });
    anims.create({
        key:'throw',
        frames:anims.generateFrameNumbers('player-throw',{start:0,end:7}),
        frameRate:14,
        repeat:0,
    });
    anims.create({
        key:'slides',
        frames:anims.generateFrameNumbers('slide',{start:0,end:3}),
        frameRate:20,
        repeat:0,
    });
} 