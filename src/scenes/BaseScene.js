import Phaser from 'phaser'
class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [this.config.width / 2, this.config.height / 2];
        this.fontSize = 65;
        this.lineHeight = 70;
        this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#fff',stroke : '#000000',strokeThickness : 3};
    }

    create() {
        this.add.image(0, 0, 'menu-bg').setOrigin(0).setScale(5);
        if(this.config.canGoBack){
            const btnBack =this.add.image(this.config.width-10,this.config.height-10,'back').setScale(3).setOrigin(1).setInteractive();
            btnBack.on('pointerdown',()=>{
            this.scene.start('MenuScene');
                return;
            })
        
        }
    }

    createMenu(menu,setupMenuEvents) {
        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
           menuItem.textGO=this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);

        })
    }
}

export default BaseScene;