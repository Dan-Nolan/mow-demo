import Phaser from "phaser";

interface EnemyData {
  id: string;
  position: { x: number; y: number };
  health: number;
}

export class Enemy {
  private scene: Phaser.Scene;
  public sprite: Phaser.GameObjects.Sprite;
  public healthBar: Phaser.GameObjects.Rectangle;
  public maxHealth: number;
  public isAlive: boolean = true;
  private targetPosition: { x: number; y: number };
  public currentHealth: number;

  constructor(scene: Phaser.Scene, enemyData: EnemyData) {
    this.scene = scene;
    this.maxHealth = enemyData.health;
    this.targetPosition = { ...enemyData.position };
    this.currentHealth = enemyData.health;

    this.sprite = this.scene.add.sprite(
      enemyData.position.x,
      enemyData.position.y,
      "slime"
    );
    this.sprite.play("enemy_idle_down");

    this.healthBar = this.scene.add.rectangle(
      this.sprite.x,
      this.sprite.y - 30,
      40,
      5,
      0x00ff00
    );
    this.healthBar.setOrigin(0.5, 0.5);
  }

  public static createAnimations(scene: Phaser.Scene) {
    const animConfig = [
      { key: "enemy_idle_down", start: 0, end: 3 },
      { key: "enemy_idle_right", start: 7, end: 10 },
      { key: "enemy_idle_up", start: 14, end: 17 },
      { key: "enemy_hop_down", start: 21, end: 26 },
      { key: "enemy_hop_right", start: 28, end: 33 },
      { key: "enemy_hop_up", start: 35, end: 40 },
      { key: "enemy_longJump_down", start: 42, end: 48 },
      { key: "enemy_longJump_right", start: 49, end: 55 },
      { key: "enemy_longJump_up", start: 56, end: 62 },
      { key: "enemy_confused_down", start: 63, end: 65 },
      { key: "enemy_confused_right", start: 70, end: 72 },
      { key: "enemy_confused_up", start: 77, end: 80 },
      { key: "enemy_dying", start: 84, end: 88 },
    ];

    animConfig.forEach((anim) => {
      scene.anims.create({
        key: anim.key,
        frames: scene.anims.generateFrameNumbers("slime", {
          start: anim.start,
          end: anim.end,
        }),
        frameRate: 10,
        repeat: anim.key !== "enemy_dying" ? -1 : 0,
      });
    });
  }

  updatePosition(position: { x: number; y: number }) {
    this.targetPosition = position;
  }

  updateHealth(health: number) {
    this.currentHealth = health;
    const healthPercentage = this.currentHealth / this.maxHealth;
    this.healthBar.width = healthPercentage * 40;
    if (healthPercentage > 0.5) {
      this.healthBar.setFillStyle(0x00ff00);
    } else if (healthPercentage > 0.2) {
      this.healthBar.setFillStyle(0xffff00);
    } else {
      this.healthBar.setFillStyle(0xff0000);
    }
  }

  interpolate() {
    const t = 0.1;
    this.sprite.x = Phaser.Math.Linear(this.sprite.x, this.targetPosition.x, t);
    this.sprite.y = Phaser.Math.Linear(this.sprite.y, this.targetPosition.y, t);
    this.healthBar.x = this.sprite.x;
    this.healthBar.y = this.sprite.y - 30;
  }

  destroy() {
    this.sprite.destroy();
    this.healthBar.destroy();
  }
}
