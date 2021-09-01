import Phaser from 'phaser'








export default anims=>
{

    anims.create({
        key:'hit-effect',
        frames:anims.generateFrameNumbers('hit-sheet',{start:0,end:4}),
        frameRate:10,
        repeat:0
    });
    anims.create({
        key:'sword-attack-swing',
        frames:anims.generateFrameNumbers('sword-attack',{start:0,end:3}),
        frameRate:10,
        repeat:0
    });
    anims.create({
        key:'fireball',
        frames:[
            {key:'fireball-1'},
            {key:'fireball-2'},
            {key:'fireball-3'},
        ],
        frameRate:3,
        repeat:0
    });
    anims.create({
        key:'iceball',
        frames:[
            {key:'iceball-1'},
            {key:'iceball-2'},
        ],
        frameRate:2,
        repeat:0
    });
    anims.create({
        key:'diamond-anim',
        frames:[
            {key:'diamond-1'},
            {key:'diamond-2'},
            {key:'diamond-3'},
            {key:'diamond-4'},
            {key:'diamond-5'},
            {key:'diamond-6'},
        ],
        frameRate:8,
        repeat:-1
    });
} 