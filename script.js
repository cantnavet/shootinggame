// Copyright (C) 2025 cantnavet
const canvas = document.getElementById('gameCanvas');
const bgE = document.getElementById('bg');
const bg2E = document.getElementById('bg2');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const shop = document.getElementById('shop');
const shopD = document.getElementById('shopDisplay');
const gameD = document.getElementById('gameDisplay');
const coinsD = document.getElementById('coins');
const deb = document.getElementById('deb');

const damageTypes =[2,200,70000,20000000,7000000000,2000000000000];
const XTypes =[1,2,3,4,5,6];
const upgradeSpawnTime =[200,400,600,800,1000,99999999];
const colors =['#663300','#ffffff','#ffff00','#888888','#00ffff','#000000'];
// 这辈子都用不着的神必单位合集
const numberToEng =['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid','Sxd','Spd', 'Ocd', 'Nod', 'VgUvg' ,'Dvg' ,'Tvg', 'Qavg', 'Qivg', 'Sxvg', 'Spvg', 'Ocvg', 'Novg', 'TgUtg', 'Dtg', 'Ttg', 'Qatg','Qitg','Sxtg','Sptg', 'Octg', 'Notg', 'QagUqag', 'Dqag' ,'Tqag', 'Qaqag' ,'QiQag' ,'SxQag', 'SpQag', 'OcQag', 'NoQag','Bruh'];
const bulletSpeeds =[5,8,12,16,20,25];
const fireLims =[5,4,3.3,2.5,2,1];
const MaxD = 11;
const playerImg = new Image();
playerImg.src = 'textures/player.png';
var dx = new Array();
var dxb = new Array();
for (i=1;i<=MaxD;i++){
    dx[i] = new Image();
    dx[i].src = 'textures/d'+i+'.png';
}
// for (i=1;i<=MaxD;i++){
//     dxb[i] = new Image();
//     dxb[i].src = 'textures/d'+i+'b.png';
// }

const bType1 = new Image();
bType1.src = 'textures/leather_boots.png';
const bType2 = new Image();
bType2.src = 'textures/iron_boots.png';
const bType3 = new Image();
bType3.src = 'textures/gold_boots.png';
const bType4 = new Image();
bType4.src = 'textures/chainmail_boots.png';
const bType5 = new Image();
bType5.src = 'textures/diamond_boots.png';
const bType6 = new Image();
bType6.src = 'textures/netherite_boots.png';

const bTypes = [bType1,bType2,bType3,bType4,bType5,bType6];

let Maxbullets = [6,6,6,6,6,6];
const MaxBuys = [35,35,35,35,35,50];
const MaxHeart = 20;
let buyCoins = [1,3,10,30,100,150];
let buys = [6,6,6,6,6,5];
let defaults = false;

let coins = 0;
let bulletCache;
let timeScale = 1;
let bulletWeight;
let kickbackDistance;
let damageDe = 1;
let enemyHealthRate;
let gameTime;
let deltaTime;
let lastFrameTime = Date.now();
const minFrameTime = 1000 / 60; 
let enemiesSizeBase = 15;
let fallSpeedBase = 0.7;
let player, bullets, enemies, barriers, lastFire, gameOver, stops;
let score = 0;
let enemySpawnTimer = 0;
let upgradeSpawnTimer = 0;
let enemyHealthBase = 3;
let enemySpawnRate = 2000;
let barrierCD = false;
let buttonR = document.getElementById('right');
let buttonL = document.getElementById('left');
let interval;
let interval2;
let stopTime;
let lastSec = 0;
let mouseX = canvas.width/2;
let scale;
let difficultyApplyed;
let noFireRate; //连续出现无攻速加成的次数
let zindex1 = -1145141919;
let zindex2 = -1145141920;
let difficulty;
let quality;
let getBarrierLW;
let getBarrierRW;
let getBarrierType;
let getBarrierNum;
let getBarrierAlpha = 0;
let frameRate;
let resets = 0;
let BGD = 0;
let stopCD = 0;

const speedRange = document.getElementById('speedRange');
speedRange.addEventListener('input', function() {
    timeScale = parseFloat(this.value);
    document.getElementById('speedValue').textContent = this.value + 'x';
});

const speedRange2 = document.getElementById('speedRange2');
speedRange2.addEventListener('input', function() {
    quality = 3-parseInt(this.value);
    document.getElementById('speedValue2').textContent = this.value;
});

// 敌人太多血怎么办?
function formatNum(num) {
    if (num < 1000) return num.toFixed(1);
    const pow = Math.min(numberToEng.length-1,Math.floor(Math.log10(Math.abs(num)) / 3)); 
    const x = num / Math.pow(1000, pow); 
    return x.toFixed(1) + numberToEng[pow];
}

// 双重背景笑传之层层搬(
function updateBG() {
    if (BGD != difficulty){
        if (zindex1<zindex2) {
            BGD = difficulty;
            zindex1=zindex2+1;
            bgE.style.zIndex = zindex2+1;
            bgE.style.backgroundImage= "url('textures/d"+difficulty+"b2.png')";
            triggerAnimation(offAnimation2);
        }else{
            BGD = difficulty
            zindex2=zindex1+1;
            bg2E.style.zIndex = zindex1+1;
            bg2E.style.backgroundImage= "url('textures/d"+difficulty+"b2.png')";
            triggerAnimation2(offAnimation);
        }
    }
}

// 设置 Canvas + bg 的CSS显示大小
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const logicalWidth = canvas.width; 
    const logicalHeight = canvas.height;

    const mainShop = document.getElementById("mainshop");
    const products = document.getElementById("products");

    scale = Math.min((windowWidth-100) / logicalWidth, (windowHeight-80) / logicalHeight);

    canvas.style.width = `${logicalWidth * scale}px`;
    canvas.style.height = `${logicalHeight * scale}px`;
    bgE.style.width = `${logicalWidth * scale}px`;
    bgE.style.height = `${logicalHeight * scale}px`;
    bg2E.style.width = `${logicalWidth * scale}px`;
    bg2E.style.height = `${logicalHeight * scale}px`;

    mainShop.style.height = `${logicalHeight * scale}px`;
    mainShop.style.width = `${(Math.min(400,windowWidth/2))}px`;
    mainShop.style.left = `50%`;
    mainShop.style.transform = `translateX(-50%)`;
    products.style.height = `${logicalHeight * scale-180}px`;
    document.documentElement.style.setProperty('--bg-pos-ys', -800 * scale+'px');
    document.documentElement.style.setProperty('--bg-speed', 10/fallSpeedBase+'s');
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    draw(); 
});

function updateDeltaTime() {
    const now = Date.now();
    lastFrameTime = now;
    gameTime += deltaTime;
}


function initGame() {
    loadData();
    resets = 0;
    quality = 0;
    ctx.imageSmoothingEnabled = false; 
    player = {
        x: canvas.width/2,
        y: canvas.height - 30,
        speed: 5,
        bulletSpeed: 2,
        fireRate: 1000,
        damage: 1,
        bulletWidth: 4.5,
        bulletCount: 1,  // 初始弹道数量
        bulletSpread: 18, // 子弹间距
        bulletX: 1,
        health: 5,
        maxHealth: 5,
        bulletType: 1,
        fireLim: 5,
        ar: 1,
        at: 0,
        miss: 0
    };
    //预渲染靴子弹 (?)
    bulletCache = [{
        left: createCachedImage(bTypes[0], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[0], 8, 3, 10, 10, 30, 30) 
    },{
        left: createCachedImage(bTypes[1], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[1], 8, 3, 10, 10, 30, 30) 
    },{
        left: createCachedImage(bTypes[2], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[2], 8, 3, 10, 10, 30, 30) 
    },{
        left: createCachedImage(bTypes[3], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[3], 8, 3, 10, 10, 30, 30) 
    },{
        left: createCachedImage(bTypes[4], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[4], 8, 3, 10, 10, 30, 30) 
    },{
        left: createCachedImage(bTypes[5], -2, 3, 10, 10, 30, 30),
        right: createCachedImage(bTypes[5], 8, 3, 10, 10, 30, 30) 
    }];

    if (defaults){
      Maxbullets = [6,6,6,6,6,6];
      player.maxHealth = 5;
    }else{
      for (i = 0; i < 5; i++){
        Maxbullets[i] = buys[i];
      }
      Maxbullets[5] = 6;
      player.maxHealth = buys[5];
      player.health = buys[5];
    }
    
    upgradeSpawnTimer = 0;
    bulletWeight = 1;
    kickbackDistance = 2;
    gameTime = 0;
    lastFrameTime = Date.now();
    stops = false;
    damageDe = 2.5;
    bullets = [];
    enemies = [];
    barriers = [];
    lastFire = 0;
    gameOver = false;
    score = 0;
    enemiesSizeBase = 15;
    enemyHealthBase = 3;
    enemyHealthRate = 1.45;
    enemySpawnRate = 2000;
    fallSpeedBase = 0.7;    //你敢相信我都快写完了，才发现这里是fill而不是fall?
    lastFire = Date.now();
    mouseX = canvas.width/2;  
    shop.style.display = 'none';
    restartBtn.style.display = 'none';
    speedRange.style.display = 'none';
    deb.style.display = 'none';
    difficultyApplyed = false;
    noFireRate = 0;
    difficulty = 1;
    bgE.style.animationPlayState = 'running';
    bg2E.style.animationPlayState = 'running';
    updateBG();
    //goShop();
}

// 鼠标控制
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    // ctx.fillStyle = '#fff';
    // ctx.fillText(`Test: ${((e.clientY))}`, 50, 240);

    if (!(mouseX >= 10 && mouseX <= (canvas.width - 10)* scale) || e.clientY - rect.top <= canvas.height * scale/8){
        if (e.clientY - rect.top <= canvas.height * scale/8){
            mouseX = player.x* scale;
        }else{
            if(mouseX < 10){
                mouseX = 10;
            }else if(mouseX > (canvas.width - 10)* scale){
                mouseX = (canvas.width - 10)* scale;
            }
        }
    }
});

// for 手机等触摸设备
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mouseX = e.touches[0].clientX - rect.left;
    if (!(mouseX >= 10 && mouseX <= (canvas.width - 10)* scale) || e.touches[0].clientY - rect.top <= canvas.height * scale/8){
        if (e.clientY - rect.top <= canvas.height * scale/8){
            mouseX = player.x* scale;
        }else{
            if(mouseX < 10){
                mouseX = 10;
            }else if(mouseX > (canvas.width - 10)* scale){
                mouseX = (canvas.width - 10)* scale;
            }
        }
    }
});

// 子弹移动
function updateBullets() {
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed* (deltaTime / 8.335)* timeScale;
        return bullet.y > -100;
    });
}

// 子弹绘制
function drawBullets() {
        // bullets.forEach(bullet => {
        //     ctx.fillStyle = bulletColor(bullet.type);
        //     ctx.beginPath();
        //     ctx.arc(bullet.x, bullet.y-3, player.bulletWidth, 0, Math.PI*2);
        //     ctx.fill();
        // })
        
        // if (bullet.type>=5) ctx.stroke();
    if (quality < 1){
        const leftBullets = bullets.filter(b => !b.side);
        const rightBullets = bullets.filter(b => b.side);
        
        // 单次绘制同类型子弹
        if (leftBullets.length) {
            leftBullets.forEach(b => ctx.drawImage(bulletCache[b.type-1].left, b.x-21, b.y-5));
        }
        if (rightBullets.length) {
            rightBullets.forEach(b => ctx.drawImage(bulletCache[b.type-1].right, b.x-8, b.y-5));
        }
    }else if (quality === 1){
        const leftBullets = bullets.filter(b => !b.side && b.draw);
        const rightBullets = bullets.filter(b => b.side && b.draw);
        
        // 单次绘制同类型子弹
        if (leftBullets.length) {
            leftBullets.forEach(b => ctx.drawImage(bulletCache[b.type-1].left, b.x-21, b.y-5));
        }
        if (rightBullets.length) {
            rightBullets.forEach(b => ctx.drawImage(bulletCache[b.type-1].right, b.x-8, b.y-5));
        }
    }else if (quality === 2) {
        
        bullets.forEach(b => {
            ctx.fillStyle = colors[b.type-1];
            ctx.fillRect(b.x, b.y, player.bulletWidth*2, player.bulletWidth*2);
        });
    }

}

function updateEnemies() {
    // 生成敌人
    if((gameTime%15<=10) && (Date.now() - enemySpawnTimer > enemySpawnRate/timeScale)) {
        spawnEnemies(enemyHealthBase,fallSpeedBase,enemiesSizeBase,0);
        // spawnEnemies(enemyHealthBase*6,fallSpeedBase*1.4,enemiesSizeBase*1.2,player.bulletType);
        if (Math.random()<0.1 && gameTime>40 && 1+Math.log(enemyHealthBase)/4-difficulty>0.05)  spawnEnemies(enemyHealthBase/1.5,fallSpeedBase*2.5,enemiesSizeBase/1.5,0);
        enemySpawnTimer = Date.now();
    }

    if (gameTime>=bulletTypeSpawnTimeBase(player.bulletType) && gameTime - upgradeSpawnTimer > 15){
        spawnEnemies(enemyHealthBase*6,fallSpeedBase*1.4,enemiesSizeBase*1.2,player.bulletType);
        upgradeSpawnTimer = gameTime;
    }

    // 更新敌人位置 + 受伤特效
    enemies = enemies.filter(enemy => {
        if (enemy.health>0){
            enemy.y += enemy.speed* (deltaTime / 8.335)* (timeScale);
            if (Math.abs(enemy.rotate)>0){
                if (Math.abs(enemy.rotate)<0.001){
                    enemy.rotate=0;
                }
                enemy.rotate /= 1.5 ** (deltaTime / 16.667); 
            }
            // 扣血+失败条件
            if(enemy.y + enemy.size >= player.y && enemy.type===0) {
                if (enemy.boss == 1){
                    player.health-=3;
                }else{
                    if (enemy.speed>fallSpeedBase*2){
                        player.health-=0.5
                    }else{
                        player.health--;
                    }  
                }
                player.miss++;
                if (player.health <= 0){
                    gameOver = true;
                    coinsD.textContent = coins.toFixed(1);
                }
                enemy.y = 99999;
            }
        }
        return enemy.y < canvas.height;
    });
}

// 确保文字在正中间的一系列函数
function fitTextToWidth(text, targetWidth, maxHeight, fontFamily) {
    let minSize = 1;
    let maxSize = maxHeight;
    let fontSize = (minSize + maxSize) / 2;
    let count = 0;

    // 二分字体大小，猜猜看不加count会发生什么(
    while (maxSize - minSize > 1 && count < 20) {
        count++;
        ctx.font = `${fontSize}px ${fontFamily}`;
        const textWidth = ctx.measureText(text).width;

        if (textWidth > targetWidth) {
            maxSize = fontSize; 
        } else {
            minSize = fontSize; 
        }

        fontSize = Math.floor((minSize + maxSize) / 2);
    }

    ctx.font = `${fontSize}px ${fontFamily}`;
}

function measureTextHeight(font) {
    ctx.font = font;
    const metrics = ctx.measureText('M'); 
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    return textHeight;
}

function drawText(text, x, y, targetWidth, maxHeight, fontFamily, color) {
    fitTextToWidth(text, targetWidth, maxHeight, fontFamily);
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y+measureTextHeight(text)/2);
}

// 敌人绘制
// 优先保证高速敌人在最上面，其次保证靠前的敌人在最上面
function drawEnemies() {
    const healthTextColor = ['#f00','#fff','#0ff'];
    const enemySpeeds = [0,fallSpeedBase/2.5, fallSpeedBase*1.2, 114514];
    for (let i = 0; i < 3; i++) {
        Array.from(enemies).reverse().forEach(enemy => {
            if (enemy.speed < enemySpeeds[i+1] && enemy.speed > enemySpeeds[i]){
                const difficulty = enemy.d;
                let add = '';
                if (enemy.remain<1/3){
                    add = '-';
                }
                if (enemy.remain>2/3){
                    add = '+';
                }
                // 绘制敌人主体
                if (enemy.type===0){
                    if (quality<=1){
                        // ctx.fillStyle = `hsl(${enemy.health * 20 /enemy.maxHealth * (3+Math.log(1+enemy.health))}, 70%, 50%)`;
                        ctx.beginPath();
                        
                        if (i!==1 && enemy.health>0){
                            ctx.shadowColor = healthTextColor[i];
                            ctx.shadowOffsetX = 0; 
                            ctx.shadowOffsetY = 0; 
                            ctx.shadowBlur = 12;  
                        }else{
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                            ctx.shadowOffsetX = 0; 
                            ctx.shadowOffsetY = enemy.size**0.5; 
                            ctx.shadowBlur = 12; 
                        }
                        
                        ctx.globalAlpha = enemy.alpha;
                        ctx.save();
                        // 做了半天才发现有translate这玩意(
                        ctx.globalAlpha = 1;
                        ctx.translate(enemy.x, enemy.y);
                        ctx.rotate(enemy.rotate * Math.PI / 180); 
                        // if (i!==1 && enemy.health>0) ctx.filter = 'drop-shadow(0px 0px 5px '+healthTextColor[i]+')';
                        ctx.drawImage(dx[difficulty], -enemy.size, -enemy.size, 2*enemy.size,2*enemy.size);
                        ctx.globalAlpha = enemy.alpha;
                        drawText('D'+difficulty+add, 0, 0, enemy.size*2/1.2, enemy.size*2, 'Jellee', '#FFF');
                        ctx.restore();
                        // ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
                        // ctx.fill();
                        ctx.shadowColor = 'transparent';
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;
                        ctx.filter = 'none';
                    }else{
                        ctx.beginPath();
                        ctx.drawImage(dx[difficulty], enemy.x-enemy.size, enemy.y-enemy.size, 2*enemy.size,2*enemy.size);
                        if (enemy.health>0) drawText('D'+difficulty+add, enemy.x, enemy.y, enemy.size*2/1.2, enemy.size*2, 'Jellee', '#FFF');
                    }
                }else{
                    ctx.beginPath();
                    if (quality<=1) {
                        ctx.shadowColor = bulletColor(enemy.type+1);
                        ctx.shadowOffsetX = 0; 
                        ctx.shadowOffsetY = 0; 
                        ctx.shadowBlur = 12; 
                    }
                    //if (quality===0) ctx.filter = 'drop-shadow(0px 0px 5px '++')';
                    // ctx.fillRect(enemy.x-enemy.size, enemy.y-enemy.size,enemy.size*2,enemy.size*2);
                    // 十分激烈的坐标转换
                    ctx.drawImage(bTypes[player.bulletType], enemy.x-enemy.size-enemy.size/8, enemy.y-enemy.size+enemy.size/8, 16/7*enemy.size,16/7*enemy.size);
                    if (quality<=1) {
                        ctx.shadowColor = 'transparent';
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;
                        ctx.filter = 'none';
                    }
                }
                
                if (enemy.health>0){
                    // 绘制血条背景
                    ctx.fillStyle = 'rgba(0,0,0,0.5)';
                    if (enemy.boss<1){
                        ctx.fillRect(enemy.x - 20, enemy.y - 10 - enemy.size, 40, 5);
                    }else{
                        ctx.fillRect(enemy.x - 40, enemy.y - 10 - enemy.size, 80, 5);
                    }
                    
                    // 绘制当前血量
                    const healthWidth = (enemy.health / enemy.maxHealth) * 36;
                    ctx.fillStyle = enemy.health > enemy.maxHealth*0.4 ? '#0f0' : '#f00';
                    ctx.fillStyle = `hsl(${enemy.health / enemy.maxHealth * 120}, 70%, 50%)`;

                    if (enemy.boss<1){
                        ctx.fillRect(enemy.x - 18, enemy.y - 8 - enemy.size, healthWidth, 2);
                    }else{
                        ctx.fillRect(enemy.x - 38, enemy.y - 8 - enemy.size, healthWidth*2, 2);
                        
                    }

                    // 显示血量数值
                    // document.fonts.ready.then(function() {
                    ctx.font = "15px 'Jellee'";
                    ctx.textAlign = 'center';
                    ctx.lineWidth = 3;
                    
                    ctx.strokeStyle = '#000';
                    ctx.strokeText(formatNum(enemy.health), enemy.x, enemy.y - 15 - enemy.size);
                    ctx.strokeStyle = 'rgba(255,255,255,0)';

                    ctx.fillStyle = healthTextColor[i];
                    ctx.fillText(formatNum(enemy.health), enemy.x, enemy.y - 15 - enemy.size);
                    //});
                }
                ctx.globalAlpha = 1.0;
            }
        });
    }
}

function spawnEnemies(health,speed,size,type) {
    const maxAttempts = 50; // 最大尝试次数
    let newEnemy = null;
    let isValidPosition = false;
    const d = Math.min(MaxD,1+Math.floor(Math.log(health)/4));
    const r =1+Math.log(health)/4-d;
    
    // 生成有效位置
    for(let i=0; i<maxAttempts; i++){
        newEnemy = {
            x: Math.random() * (canvas.width - 30 - size * 2) + 15 + size,
            y: -100,
            health: health,
            size: size, 
            speed: speed,
            maxHealth: health,
            boss: 0,
            type: type,
            rotate: 0,
            alpha: 0.99999,
            ySpeed: 0,
            xSpeed: 0,
            yAddSpeed: 0,
            d: d,
            remain: r
        };

        // 碰撞检测
        if(!checkEnemyCollision(newEnemy)){
            isValidPosition = true;
            break;
        }
    }

    if(!isValidPosition){
        console.log('哥们好像没位了,给你随便找个地方生了(?)');
    }
    enemies.push(newEnemy);
}

// 加成屏障绘制
function drawBarriers() {
    const maxDisplayValue = 9999999;
    if (getBarrierAlpha > 0){
        getBarrierAlpha = Math.max(0,getBarrierAlpha-0.01*(deltaTime / 8.335));
        ctx.globalAlpha = getBarrierAlpha;
        ctx.fillStyle = getBarrierNum >= 0 ? 'rgba(0,255,0,40%)' : 'rgba(255,0,0,40%)';
        ctx.fillRect(getBarrierLW, player.y - 40, getBarrierRW - getBarrierLW, 40);
        const v = Math.abs(getBarrierNum) > maxDisplayValue? getBarrierNum.toExponential(3): getBarrierNum.toFixed(2);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';       
        ctx.fillText(
            `${getBarrierType}`, 
            (getBarrierRW - getBarrierLW)/2+getBarrierLW, player.y - 25
        );
        ctx.font = '15px Arial';
        ctx.fillText(
            `${(getBarrierNum >= 0 ?"+":"")+v}`, 
            (getBarrierRW - getBarrierLW)/2+getBarrierLW, player.y - 7
        );
        ctx.fillStyle = '#000';
        if (getBarrierLW){
            ctx.fillRect(getBarrierLW-2, player.y - 40, 4, 40);
        }
        if (getBarrierRW<canvas.width){
            ctx.fillRect(getBarrierRW-2, player.y - 40, 4, 40);
        }
        ctx.globalAlpha = 1;
    }
    barriers.forEach(barrier => {
        // 绘制左侧区域
        ctx.fillStyle = barrier.leftValue >= 0 ? 'rgba(0,255,0,40%)' : 'rgba(255,0,0,40%)';
        ctx.fillRect(0, barrier.y, barrier.lw, 40);
        
        // 绘制中间区域
        ctx.fillStyle = barrier.midValue >= 0 ? 'rgba(0,255,0,40%)' : 'rgba(255,0,0,40%)';
        ctx.fillRect(barrier.lw, barrier.y, barrier.rw-barrier.lw, 40);

        // 绘制右侧区域
        ctx.fillStyle = barrier.rightValue >= 0 ? 'rgba(0,255,0,40%)' : 'rgba(255,0,0,40%)';
        ctx.fillRect(barrier.rw, barrier.y, canvas.width-barrier.rw, 40);

        // 绘制隔断
        ctx.fillStyle = '#000';
        ctx.fillRect(barrier.lw-2, barrier.y, 4, 40);
        ctx.fillRect(barrier.rw-2, barrier.y, 4, 40);
        
        // 显示数值
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';

        // 屏障加成显示3位科学计数，但敌人血量却显示单位是有原因的(
        const lv = Math.abs(barrier.leftValue) > maxDisplayValue? barrier.leftValue.toExponential(3): barrier.leftValue.toFixed(2);
        const mv = Math.abs(barrier.midValue) > maxDisplayValue? barrier.midValue.toExponential(3): barrier.midValue.toFixed(2);
        const rv = Math.abs(barrier.rightValue) > maxDisplayValue? barrier.rightValue.toExponential(3): barrier.rightValue.toFixed(2);
        if (barrier.leftValue > 0){
            ctx.fillText(
                `${barrier.typel}`, 
                barrier.lw/2, barrier.y+15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `+${lv}`, 
                barrier.lw/2, barrier.y + 33
            );
        }else{
            ctx.fillText(
                `${barrier.typel}`, 
                barrier.lw/2, barrier.y+15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `${lv}`, 
                barrier.lw/2, barrier.y + 33
            );
        }
        ctx.font = '12px Arial';
        if (barrier.midValue > 0){
            ctx.fillText(
                `${barrier.typem}`, 
                barrier.lw+(barrier.rw-barrier.lw)/2, barrier.y + 15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `+${mv}`, 
                barrier.lw+(barrier.rw-barrier.lw)/2, barrier.y + 33
            );
        }else{
            ctx.fillText(
                `${barrier.typem}`, 
                barrier.lw+(barrier.rw-barrier.lw)/2, barrier.y + 15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `${mv}`, 
                barrier.lw+(barrier.rw-barrier.lw)/2, barrier.y + 33
            );
        }
        ctx.font = '12px Arial';
        if (barrier.rightValue > 0){
            ctx.fillText(
                `${barrier.typer}`, 
                barrier.rw+(canvas.width-barrier.rw)/2, barrier.y + 15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `+${rv}`, 
                barrier.rw+(canvas.width-barrier.rw)/2, barrier.y + 33
            );
        }else{
            ctx.fillText(
                `${barrier.typer}`, 
                barrier.rw+(canvas.width-barrier.rw)/2, barrier.y + 15
            );
            ctx.font = '15px Arial';
            ctx.fillText(
                `${rv}`, 
                barrier.rw+(canvas.width-barrier.rw)/2, barrier.y + 33
            );
        }
    });
}

let checktime = 0;
// 碰撞检测
function checkCollisions() {
    // player.bulletCount = 35;
    // player.fireRate = 5;
    const bulletsToRemove = new Set();
    const enemiesToRemove = new Set();
    const startDT = Date.now();
    const scaleFactor = (deltaTime / 8.335) * timeScale;

    


    //  // 预过滤有效对象‌:ml-citation{ref="4,6" data="citationList"}
    const validEnemies = enemies.filter(enemy => enemy.health > 0);

      bullets.forEach((bullet, bIndex) => {
        validEnemies.forEach((enemy, eIndex) => {
              // const xDistance = Math.abs(bullet.x - enemy.x);
              let l=0;
              let r=0;
          
              if (bullet.side){
                  l=bullet.width*2;
              }else{
                  r=bullet.width*2;
              }

              // 令人忍俊不禁的碰撞检测，主要是为了子弹穿透效果包的饺子(
              if( bullet.y>-2 &&
                  enemy.health>0 &&
                  bullet.x - enemy.x < enemy.size + bullet.width +r &&
                  enemy.x - bullet.x < enemy.size + bullet.width +l &&
                  bullet.y <= enemy.y + enemy.size + bullet.width &&
                  bullet.y > enemy.y + enemy.size + bullet.width - bullet.speed* (deltaTime / 8.335)*timeScale - enemy.speed* (deltaTime / 8.335)*timeScale
              ){
                  // 其实，如果你不小心错过了第一个升级，游戏会给你偷偷上一个临时的伤害加成，不然你完全不可能赶上怪物的血量增长速度(
                  if (gameTime > bulletTypeSpawnTimeBase(player.bulletType)){
                      enemy.health -= (bullet.damage * player.damage)*1.14514**((gameTime-bulletTypeSpawnTimeBase(player.bulletType))/10);
                      enemy.health -= (bullet.damage * player.damage)*1.14514**((gameTime-bulletTypeSpawnTimeBase(player.bulletType))/10);
                  }else{
                    enemy.health -= bullet.damage * player.damage;
                  }
              
                  //没错，受伤抖动幅度甚至和敌人剩余血量有关
                  if (Math.abs(enemy.rotate)<0.5){
                      const rotateA = Math.min(30,5+40/(enemy.size) * (Math.random()+(enemy.maxHealth/enemy.health)**1.5));
                      enemy.rotate = Math.random()>0.5?rotateA:-rotateA;
                  }
              
                  if (enemy.type===0){
                      if (enemy.boss===1){
                          enemy.y=Math.max(-100,enemy.y-kickbackDistance/(Math.min(16,player.bulletCount)**0.5));
                      }else{
                          enemy.y=Math.max(-100,enemy.y-kickbackDistance);
                      }
                  }else{
                      enemy.y=Math.max(-100,enemy.y-kickbackDistance/2);                          
                  }
              
                  bullet.c-=1;
                  bullet.y-=bullet.speed* (deltaTime / 8.335) * timeScale;
                  if (bullet.c<1){
                      bulletsToRemove.add(bIndex);
                  }
              }
          });
      });
    checktime = Date.now()-startDT;

    const bSpeed = ((fallSpeedBase**1/2)+0.8) * timeScale* (deltaTime / 8.335);
    bullets.forEach((bullet) => {
        barriers.forEach((barrier) => {
            if (bullet.y - bullet.width <= barrier.y + 40 &&
                bullet.y - bullet.width + bullet.speed * scaleFactor > barrier.y + 40 - bSpeed * scaleFactor
            ){
                if (bullet.x < barrier.lw){
                    if (barrier.lc + 100/timeScale < Date.now()){
                        barrier.lc = Date.now();
                        if (barrier.typel == "伤害"){
                            barrier.leftValue += Math.max(barrier.la,0.04);
                        }else{
                            barrier.leftValue += 0.05;
                        }
                    }
                    if (barrier.typel == "弹道" && barrier.leftValue + player.bulletCount > Maxbullets[player.bulletType-1]){
                        barrier.leftValue = Maxbullets[player.bulletType-1] - player.bulletCount;
                    }
                }else if (bullet.x < barrier.rw){
                    if (barrier.mc + 100/timeScale < Date.now()){
                        barrier.mc = Date.now();
                        if (barrier.typem == "伤害"){
                            barrier.midValue += Math.max(0.04,barrier.ma);
                        }else{
                            barrier.midValue += 0.05;
                        }
                    }
                    if (barrier.typem == "弹道" && barrier.midValue + player.bulletCount > Maxbullets[player.bulletType-1]){
                        barrier.midValue = Maxbullets[player.bulletType-1] - player.bulletCount;
                    }
                }else{
                    if (barrier.rc + 100/timeScale < Date.now()){
                        barrier.rc = Date.now();
                        if (barrier.typer == "伤害"){
                            barrier.rightValue += Math.max(0.04,barrier.ra);
                        }else{
                            barrier.rightValue += 0.05;
                        }
                    }
                    if (barrier.typer == "弹道" && barrier.rightValue + player.bulletCount > Maxbullets[player.bulletType-1]){
                        barrier.rightValue = Maxbullets[player.bulletType-1] - player.bulletCount;
                    }
                }
            }
        });
    });
    enemies.forEach((enemy, eIndex) => {
        if (enemy.health < 0.05) {
            enemy.health=0;
            enemy.alpha = Math.max(0.01,(enemy.alpha-0.03));
            //没错，敌人死亡后的抛物线甚至和子弹速度有关
            if (enemy.yAddSpeed == 0){
                enemy.ySpeed = -(player.bulletSpeed**0.5*(Math.random()/3+1.1))-7;
                enemy.yAddSpeed = 0.98/1.5;    //地心引力.jpg
                enemy.xSpeed = (enemy.x<canvas.width/2?-1:1)*((Math.random()+0.5)*(player.bulletSpeed**0.5)+3);
                enemy.rotate = 0;
                if (enemy.boss == 1){
                    score += 30 * (1+difficulty/10)**3/2;
                    coins += 0.3 * (1+difficulty/10)**3/2;
                }else{
                    score += 10 * (1+difficulty/10)**3/2;
                    coins += 0.1 * (1+difficulty/10)**3/2;
                }
            }else{
                enemy.x+=enemy.xSpeed* (deltaTime / 16.667);
                enemy.y+=enemy.ySpeed* (deltaTime / 16.667);
                enemy.ySpeed+=enemy.yAddSpeed* (deltaTime / 16.667);
                enemy.rotate+=enemy.xSpeed* (deltaTime / 16.667)*2;
            }
        }
        if (enemy.health == 0 && (enemy.alpha <= 0.001 || enemy.type >= 1)) {
            enemiesToRemove.add(eIndex);
            if (enemy.boss == 1){
                score += 30 * (1+difficulty/10)**3/2;
                coins += 0.3 * (1+difficulty/10)**3/2;
            }else{
                score += 10 * (1+difficulty/10)**3/2;
                coins += 0.1 * (1+difficulty/10)**3/2;
            }
            if (enemy.type>=1){
                player.bulletType = enemy.type+1;
                player.bulletCount = 4;
                player.fireRate *= 30;
                player.bulletSpeed = bulletSpeed(player.bulletType);
                player.fireLim = fireLims[player.bulletType-1];
                player.ar=3;
                player.at=1;
            }
        }
    });

    // 猜猜不加reverse会怎么样
    Array.from(bulletsToRemove).reverse().forEach(i => bullets.splice(i, 1));
    Array.from(enemiesToRemove).reverse().forEach(i => enemies.splice(i, 1));
    storageData();
}

// 游戏界面
function drawUI() {
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.font = '20px Jellee';
    
    // 
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.strokeText(`Score: ${score.toFixed(1)}`, 10, 30);
    ctx.fillText(`Score: ${score.toFixed(1)}`, 10, 30);
    ctx.strokeText(`Time: ${(gameTime)}`, 10, 60);
    ctx.fillText(`Time: ${(gameTime)}`, 10, 60);
    ctx.strokeText(`Miss: ${(player.miss)}`, 10, 90);
    ctx.fillText(`Miss: ${(player.miss)}`, 10, 90);
    ctx.font = '12px Jellee';

    ctx.lineWidth = 3;
    ctx.strokeText(`弹道上限: ${(Maxbullets[player.bulletType-1])}`, 10, 760);
    ctx.fillText(`弹道上限: ${(Maxbullets[player.bulletType-1])}`, 10, 760);
    ctx.textAlign = 'right';
    ctx.strokeText(`伤害: ${player.damage.toFixed(1)}`, canvas.width-10, 760);
    ctx.fillText(`伤害: ${player.damage.toFixed(1)}`, canvas.width-10, 760);
    if (defaults){
        ctx.fillStyle = "#f00"
        ctx.strokeText(`默认加成开启`, canvas.width-10, 740);
        ctx.fillText(`默认加成开启`, canvas.width-10, 740);
    }
    if (stops || gameOver){
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.05)'
        ctx.font = '12px Jellee';
        ctx.fillText(`De: ${(damageDe.toFixed(2))}`, 10, 150);
        ctx.fillText(`ct: ${(checktime)}`, 10, 120);
        ctx.fillText(`BW: ${(bulletWeight.toFixed(2))}`, 10, 180);
        ctx.fillText(`EHR: ${(enemyHealthRate.toFixed(2))}`, 10, 210);
        ctx.fillText(`ESR: ${(enemySpawnRate.toFixed(2))}`, 10, 240);
        ctx.fillText(`NF: ${(noFireRate.toFixed(2))}`, 10, 270);
        ctx.fillText(`FLim: ${(player.fireLim.toFixed(2))}`, 10, 300);
        ctx.fillText(`KB: ${(kickbackDistance.toFixed(4))}`, 10, 330);
        ctx.fillText(`at: ${(player.at.toFixed(4))}`, 10, 360);
        ctx.fillText(`ar: ${(player.ar.toFixed(4))}`, 10, 390);
        ctx.fillText(`d: ${(difficulty)}`, 10, 420);
        ctx.fillText(`dt: ${(player.bulletType-1)}`, 10, 450);
        ctx.fillText(`bs: ${(1000/player.fireRate).toFixed(1)}`, 10, 480);
    }
    ctx.textAlign = 'center';

    ctx.stroke();
    if(gameOver) {
        bgE.style.animationPlayState = 'paused';
        bg2E.style.animationPlayState = 'paused';
        ctx.fillStyle = '#f00';
        ctx.font = 'bold 40px Arial';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000';
        ctx.strokeText('游戏结束!', canvas.width/2, canvas.height/2);
        ctx.fillText('游戏结束!', canvas.width/2, canvas.height/2);     
        restartBtn.style.display = 'block';
        shop.style.display = 'block';
        speedRange.style.display = 'block';
        deb.style.display = 'block';
    }
}

// 暂停
function stop() {
    if (Date.now() - stopCD < 1000 || Date.now() - stopTime < 500) return;
    if (gameOver) return;
    stops = !stops;
    if (stops) {
        drawUI();
        bgE.style.animationPlayState = 'paused';
        bg2E.style.animationPlayState = 'paused';
        restartBtn.style.display = 'block';
        shop.style.display = 'block';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Arial';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000';
        ctx.strokeText('暂停', canvas.width/2, canvas.height/2);
        ctx.fillText('暂停', canvas.width/2, canvas.height/2);
        stopTime = Date.now();
        clearInterval(interval);
        clearInterval(interval2);
        background.classList.add('animate');
    }else{
        // 这里貌似有点小bug，但不好修，也不知道是什么，反正到时候发生了再说吧.jpg()
        stopCD = Date.now();
        enemySpawnTimer += (Date.now()-stopTime);
        lastFrameTime = Date.now();
        lastFire += (Date.now()-stopTime);
        lastSec += (Date.now()-stopTime)/1000/timeScale;
        barriers.forEach(barrier => {
            barrier.lc = Date.now();
            barrier.mc = Date.now();
            barrier.rc = Date.now();
        });
        bgE.style.animationPlayState = 'running';
        bg2E.style.animationPlayState = 'running';
        restartBtn.style.display = 'none';
        shop.style.display = 'none';
        gameLoop();
        
    }

}

// 别问我为什么这点东西都要单独开2个函数()
function moveLeft() {
    player.x = Math.max(10, player.x - player.speed);
}
function moveRight() {
    player.x = Math.min(canvas.width-10, player.x + player.speed);
}

// 游戏主循环
function gameLoop() {
    if(gameOver) return;
    if(stops) return;

    // 每秒一次
    const currentTime = Date.now();
    if (lastSec+1/timeScale < currentTime/1000){
        lastSec = currentTime/1000;
        gameTime++;

        bossSpawn();
        if (player.bulletType==1){
            if (gameTime<=20){
                player.fireRate/=1.07;
                player.bulletSpeed = Math.min(5,player.bulletSpeed*1.05);
            }
        }

        frameRate = 1000 / deltaTime;
    }

    if (player.at>0.0001){
        player.at/=1.05**(deltaTime / 16.667);
        player.ar*=1.2**(deltaTime / 16.667);
    }
    
    deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // if(keys.ArrowLeft) player.x = Math.max(10, player.x - player.speed);
    // if(keys.ArrowRight) player.x = Math.min(canvas.width-10, player.x + player.speed);
    // 更新玩家位置
    player.x = mouseX / scale;

    // 生成子弹
    if(Date.now() - lastFire > player.fireRate / timeScale) {
        const fires = Math.floor((Date.now() - lastFire)/player.fireRate);
        const spreadStep = player.bulletSpread;
        const startOffset = -(player.bulletCount-1)*spreadStep/2;
        const bulletDamage = bulletDamageCalc(player.bulletType);
        const bulletX = bulletXCalcs(player.bulletType);
        // 攻速多到60fps加不完? 没事，我们有最陷阱的自动子弹补间（
        for (let j=0; j<fires; j++){
            for(let i=0; i<player.bulletCount; i++){
                bullets.push({
                    draw: j===0,
                    c: bulletX,
                    x: player.x + startOffset + i*spreadStep,
                    y: player.y + j * ((player.bulletSpeed* (deltaTime / 8.335))*timeScale/fires),
                    type: player.bulletType,
                    width: player.bulletWidth,
                    speed: player.bulletSpeed,
                    damage: bulletDamage,
                    side: i+1>player.bulletCount/2+0.5
                });
            }
        }
        
        lastFire += fires * player.fireRate / timeScale;
    }
    
    // 更新游戏对象
    increaseDifficulty();
    updateBullets();
    updateEnemies();
    updateBarriers();
    checkCollisions();
    
    // 绘制所有元素
    drawBullets();
    drawPlayer();
    drawEnemies();
    drawBarriers();
    drawUI();
    ctx.textAlign = 'right';
    ctx.fillStyle = '#888';
    ctx.font = '20px Jellee';
    ctx.fillText(`FPS: ${frameRate.toFixed(1)}`, canvas.width-10, 30);
    ctx.textAlign = 'center';

    requestAnimationFrame(gameLoop);

    
}

// 玩家绘制
function drawPlayer() {
    ctx.fillStyle = colorWithOpacity(colors[player.bulletType-1],player.at)
    ctx.arc(player.x, player.y, player.ar, 0, Math.PI * 2);
    ctx.fill();
    //玩家血条
    ctx.fillStyle = '#000';
    ctx.fillRect(0, canvas.height-30, canvas.width, 30);

    ctx.fillStyle = `hsl(${player.health * 20 /player.maxHealth * (3+Math.log(1+player.health))}, 70%, 45%)`;
    ctx.fillRect(5, canvas.height-25, canvas.width*player.health/player.maxHealth-10, 19);

    ctx.fillStyle = '#fff';
    ctx.font = '15px Jellee';
    ctx.fillText(` ${player.health.toFixed(1)} / ${player.maxHealth.toFixed(1)}`, canvas.width/2,canvas.height-11);

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; 
    ctx.shadowOffsetX = 0; 
    ctx.shadowOffsetY = 5; 
    ctx.shadowBlur = 12; 
    const playerSize = 30;
    ctx.drawImage(playerImg, player.x-playerSize/2, player.y-playerSize/2, playerSize,playerSize)
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.filter = 'none';
}

// 神必的颜色和透明度合成
function colorWithOpacity(color, opacity) {
    if (color.startsWith('#')) {
        color = hexToRgb(color);
    }
    if (color.startsWith('rgb')) {
        return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    }
    return color; 
}

// 十六进制转RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r},${g},${b})`;
}

// 事件监听
// const keys = { ArrowLeft: false, ArrowRight: false };
// window.addEventListener('keydown', e => keys[e.key] = true);
// window.addEventListener('keyup', e => keys[e.key] = false);
window.addEventListener('keydown', e => {
    if (e.key=='s'){
        setTimeout(() => stop(),200);
    }
});
restartBtn.addEventListener('click', () => {
    initGame();
    gameLoop();
});

//为了应对btype6加载好了，但btype2却没加载好的异步魅力时刻(
let imgs = 0;
bTypes.forEach(img => {
    img.onload = function() {
        imgs++;
        if (imgs == bTypes.length) {
        initGame();
        gameLoop();
    }
    };
    if (img.complete) imgs++;
    if (imgs == bTypes.length) {
        initGame();
        gameLoop();
    }
});

// 预裁剪优化，这都掉帧就赶紧改画质吧(
function createCachedImage(source, sx, sy, sw, sh, dw, dh) {
    const cacheCanvas = new OffscreenCanvas(dw, dh);
    const cacheCtx = cacheCanvas.getContext('2d');
    cacheCtx.drawImage(source, sx, sy, sw, sh, 0, 0, dw, dh);
    return cacheCanvas;
}

// function createCachedEnemy(d, type, size) {
//     const cacheCanvas = new OffscreenCanvas(size*2,size*2);
//     const cacheCtx = cacheCanvas.getContext('2d');
//     const healthTextColor = ['#f00','#fff','#0ff'];

//     let add = '';
//     if (d-Math.floor(d)<1/3){
//         add = '-';
//     }
//     if (d-Math.floor(d)>2/3){
//         add = '+';
//     }
                            
//     cacheCtx.beginPath();
//     cacheCtx.shadowColor = 'rgba(0, 0, 0, 0.5)'; 
//     cacheCtx.shadowOffsetX = 0; 
//     cacheCtx.shadowOffsetY = size**0.5; 
//     cacheCtx.shadowBlur = 12; 

//     if (type!=1) ctx.filter = 'drop-shadow(0px 0px 5px '+healthTextColor[i]+')';
//     cacheCtx.drawImage(dx[d], 0,0, 2*size,2*size);
//     drawText('D'+d+add, size, size, size*2/1.2, size*2, 'Jellee', '#FFF');

//     cacheCtx.shadowColor = 'transparent';
//     cacheCtx.shadowOffsetX = 0;
//     cacheCtx.shadowOffsetY = 0;
//     cacheCtx.shadowBlur = 0;
//     cacheCtx.filter = 'none';
//     return cacheCanvas;
// }

// 鼠标和触摸事件的处理函数
function startIncrement() {
    if (stops) return;
    interval = setInterval(() => {
        moveRight();
    }, 10);
}

function stopIncrement() {
    clearInterval(interval);
}

function startIncrement2() {
    if (stops) return;
    interval2 = setInterval(() => {
        moveLeft();
    }, 10);
}

function stopIncrement2() {
    clearInterval(interval2);
}

// 偷窥狂合集 (?)
buttonR.addEventListener('mousedown', startIncrement);
buttonR.addEventListener('mouseup', stopIncrement);
buttonR.addEventListener('mouseleave', stopIncrement); 
buttonL.addEventListener('mousedown', startIncrement2);
buttonL.addEventListener('mouseup', stopIncrement2);
buttonL.addEventListener('mouseleave', stopIncrement2);
buttonR.addEventListener('touchstart', (event) => {
    event.preventDefault(); 
    startIncrement();
});
buttonR.addEventListener('touchend', stopIncrement);
buttonL.addEventListener('touchstart', (event) => {
    event.preventDefault(); 
    startIncrement2();
});
buttonL.addEventListener('touchend', stopIncrement2);

function bulletProb() {
    let n = 0.114514, count = 0;
    do {
        n = Math.random();
    } while (n == 0 && count++ < 100); // 要是去掉count后你游戏炸了，那哥们你是这个👍
    return Math.min(10,Math.log(1/n) / Math.log(2)+1);
}

function updateBarriers() {
    // 每5秒生成屏障 (加成)
    if(gameTime !== 0 && gameTime%7 ===0 && barrierCD === false) {
        let firstV = Math.min(Maxbullets[player.bulletType-1],bulletProb()) * (Math.random()>0.5?1:-0.3);
        let secV = Math.min(Maxbullets[player.bulletType-1],bulletProb()) * (Math.random()>0.5?1:-0.3);
        let thirdV = Math.min(Maxbullets[player.bulletType-1],bulletProb()) * (Math.random()>0.5?1:-0.3);
        let ltypes = '弹道';
        let mtypes = '弹道';
        let rtypes = '弹道';

        // 十分激烈的概率计算
        bulletWeight = 1.5*(0.5+(20*player.bulletCount/Maxbullets[player.bulletType-1])**(0.7)/4);
        if (gameTime>bulletTypeSpawnTimeBase(player.bulletType)-50 && player.bulletCount < Maxbullets[player.bulletType-1]/2) bulletWeight /=3;
        if (gameTime>20 && gameTime<200 && player.bulletCount < 2) bulletWeight /=3;
        if((noFireRate>=5 && player.fireRate > player.fireLim) || Math.random()*bulletWeight > 0.1 || player.bulletCount>=Maxbullets[player.bulletType-1]){
            firstV = 2*(Math.random()*5 - 3);
            ltypes = '攻速';
            if ((noFireRate<5 && Math.random()>0.35) || player.fireRate <= player.fireLim){
                ltypes = '伤害';
                firstV *= enemyHealthBase/3/damageDe;
                firstV += firstV>=0?0.5:-0.5;
            }else{
                firstV += firstV>=0?1:-0.2;
            }
        }
        if((noFireRate>=5 && player.fireRate > player.fireLim) || Math.random()*bulletWeight > 0.1 || player.bulletCount>=Maxbullets[player.bulletType-1]){
            secV = 2*(Math.random()*5 - 3);
            mtypes = '攻速';
            if ((noFireRate<5 && Math.random()>0.35) || player.fireRate <= player.fireLim){
                mtypes = '伤害';
                secV *= enemyHealthBase/3/damageDe;
                secV += secV>=0?0.5:-0.5;
            }else{
                secV += secV>=0?1:-0.2;
            }
        }
        if((noFireRate>=5 && player.fireRate > player.fireLim) || Math.random()*bulletWeight > 0.1 || player.bulletCount>=Maxbullets[player.bulletType-1]){
            thirdV = 2*(Math.random()*5 - 3);
            rtypes = '攻速';
            if ((noFireRate<5 && Math.random()>0.35) || player.fireRate <= player.fireLim){
                rtypes = '伤害';
                thirdV *= enemyHealthBase/3/damageDe;
                thirdV += thirdV>=0?0.5:-0.5;
            }else{
                thirdV += thirdV>=0?1:-0.2;
            }
        }

        if(Math.random()<1/3){
            if (firstV<0 && secV<0 && thirdV<0) firstV = -firstV;
        }else if(Math.random()<1/2){    //你能第一时间察觉出，为什么上面是1/3，而这里是1/2吗？
            if (firstV<0 && secV<0 && thirdV<0) secV = -secV;
        }else{
            if (firstV<0 && secV<0 && thirdV<0) thirdV = -thirdV;
        }

        if ((firstV<=0 || ltypes !== '攻速') && (secV<=0 || mtypes !== '攻速') && (thirdV<=0 || rtypes !== '攻速')){
            noFireRate++;
        }else{
            noFireRate = 0;
        }

        if (ltypes == '伤害') firstV *=2;
        if (mtypes == '伤害') secV *=2;
        if (rtypes == '伤害') thirdV *=2;

        const lWall = Math.random()*7/10*canvas.width+canvas.width/10; 
        const rWall = Math.random()*(canvas.width-lWall-2*canvas.width/10)+lWall+canvas.width/10;
        barriers.push({
            y: 0,
            leftValue: firstV,  
            midValue: secV,
            rightValue: thirdV,
            la: Math.abs(firstV/100),
            ma: Math.abs(secV/100),
            ra: Math.abs(thirdV/100),
            typel: ltypes,
            typem: mtypes,
            typer: rtypes,
            lc: 0,
            mc: 0,
            rc: 0,
            lw: lWall,
            rw: rWall
        });


        
        barrierCD = true;
    }else if(gameTime%7 !=0 ){
        barrierCD = false;
    }

    // 记录到底的屏障以供移除
    const barriersToRemove = [];
    barriers.forEach(barrier => {
        barrier.y += ((fallSpeedBase**1/2)+0.8) * timeScale* (deltaTime / 8.335);
        if(barrier.y + 40 >= player.y) {
            applyUpgrade(barrier);
            barriersToRemove.push(barrier);
        }
    });
    barriers = barriers.filter(b => !barriersToRemove.includes(b));
}

// 屏障碰到玩家所应用的加成
function applyUpgrade(barrier) {
    let area;
    let typeI;
    if (player.x < barrier.lw){
        area = 'leftValue';
        typeI = 'typel';
        getBarrierLW = 0;
        getBarrierRW = barrier.lw;
    }else if (player.x < barrier.rw){
        area = 'midValue';
        typeI = 'typem';
        getBarrierLW = barrier.lw;
        getBarrierRW = barrier.rw;
    }else{
        area = 'rightValue';
        typeI = 'typer';
        getBarrierLW = barrier.rw;
        getBarrierRW = canvas.width;
    }
    const types = barrier[typeI];
    const value = barrier[area];
    getBarrierType = types;
    getBarrierNum = value;
    getBarrierAlpha = 1;

    switch(types) {
        case '攻速':
            if (player.fireRate >= player.fireLim ){
                player.fireRate = Math.max(player.fireLim, player.fireRate/=value/7+1);
            }else{
                player.damage += value*enemyHealthBase/5/damageDe;
            }
            break;
        case '伤害':
            player.damage += value;
            break;
        case '弹道':
            player.bulletCount = Math.min(
                Maxbullets[player.bulletType-1], 
                Math.max(1, player.bulletCount + Math.floor(value+0.005)) // 你也不想攻速+0.995显示的+1吃到后变成0吧(
            );
            break;
    }
}

function checkEnemyCollision(newEnemy) {
    // 边界检测（左右各留1.5倍半径空间）
    const safeMargin = newEnemy.size * 1.5;
    if(newEnemy.x < safeMargin || 
    newEnemy.x > canvas.width - safeMargin) {
        return true;
    }

    // 与现有敌人的碰撞检测
    return enemies.some(existingEnemy => {
        const dx = Math.abs(newEnemy.x - existingEnemy.x);
        const dy = Math.abs(newEnemy.y - existingEnemy.y);
        const dsize = (newEnemy.size + existingEnemy.size);
        return dx<dsize && dy<dsize;
        //return distance < (newEnemy.size + existingEnemy.size);
    });
}

// 你打不过都是它害的👇
function increaseDifficulty() {
    if(gameTime !== 0 && gameTime%10 === 0 && !difficultyApplyed) {
        
        difficultyApplyed = true;
        if (gameTime>=1200){
            damageDe *= 1.02;
        }else{
            damageDe = Math.max(1.17,enemyHealthRate/1.15)*damageDe;
        }
        enemyHealthRate = Math.max(1.2,enemyHealthRate/1.008);
        enemyHealthBase *= enemyHealthRate;
        enemySpawnRate = Math.max(50, enemySpawnRate*1/(0.945+1/((gameTime**0.22*2.5))));
        enemiesSizeBase = Math.min(35,enemiesSizeBase*1.05);
        fallSpeedBase = Math.min(2.5,fallSpeedBase+0.02);
        kickbackDistance = Math.max(0.06/1.25**(player.bulletType-1),kickbackDistance*0.9);
        // 原本呢，这里是只有一遍的，但那就需要2000秒才能完成游戏，过于坐牢，而且我不想再慢慢调平衡性，所以就成这样了()
        // 反正10秒才跑1次，没逝的)
        if (gameTime>=1200){
            damageDe *= 1.02;
        }else{
            damageDe = Math.max(1.17,enemyHealthRate/1.15)*damageDe;
        }
        enemyHealthRate = Math.max(1.2,enemyHealthRate/1.008);
        enemyHealthBase *= enemyHealthRate;
        enemySpawnRate = Math.max(50, enemySpawnRate*1/(0.945+1/(((gameTime+10)**0.22*2.5))));
        enemiesSizeBase = Math.min(35,enemiesSizeBase*1.05);
        fallSpeedBase = Math.min(2.5,fallSpeedBase+0.02);
        kickbackDistance = Math.max(0.06/1.25**(player.bulletType-1),kickbackDistance*0.9);

        const nowD = Math.min(MaxD,1+Math.floor(Math.log(enemyHealthBase)/4));

        if (difficulty !== nowD){
            difficulty = nowD;
            updateBG();
        }
    }else if(gameTime%10 != 0){
        difficultyApplyed = false;
    }
}

// 紧张刺激(存疑)的boss战
function bossSpawn() {
    if (gameTime !== 0 && gameTime%20 === 0){
        let newEnemy = null;
        let isValidPosition = false;
        const health = enemyHealthBase*10*Math.log(gameTime**(1/2));
        const d = Math.min(MaxD,1+Math.floor(Math.log(health)/4));
        const r =1+Math.log(health)/4-d;

        //玩家回血
        player.health = Math.min(player.maxHealth,player.health+player.maxHealth/25);
        
        // 照搬spawnEnemy就完事了
        for(let i=0; i<100; i++){
            newEnemy = {
                x: Math.random() * (canvas.width - 30 - enemiesSizeBase*6) + 15 + enemiesSizeBase*3,
                y: -105,
                health: health,
                size: enemiesSizeBase*3, 
                speed: fallSpeedBase/3.5,
                maxHealth: health,
                boss: 1,
                type: 0,
                rotate: 0,
                alpha: 0.99999,
                ySpeed: 0,
                xSpeed: 0,
                yAddSpeed: 0,
                d: d,
                remain: r
            };

            if(!checkEnemyCollision(newEnemy)){
                isValidPosition = true;
                break;
            }
        }
        enemies.push(newEnemy);
    }
}

// 别问为什么... 当我搓完一堆switch后突然意识到可以用数组就成这样了(
function bulletDamageCalc(type){
    if (type>=1 && type<=6) return damageTypes[type-1];
}

function bulletXCalcs(type){
    if (type>=1 && type<=6) return XTypes[type-1];
}

function bulletTypeSpawnTimeBase(type){
    if (type>=1 && type<=6) return upgradeSpawnTime[type-1];
}

function bulletColor(type){
    if (type>=1 && type<=6) return colors[type-1];
}

function bulletSpeed(type){
    if (type>=1 && type<=6) return bulletSpeeds[type-1];
}

// 背景动画合集
function triggerAnimation(callback) {
    resets = 1;
    const bg = document.querySelector('.bg-container');
    if (callback) {
        addEndListener(bg, callback);
    }
    bg.classList.add('midActive');
}

function triggerAnimation2(callback) {
    resets = 1;
    const bg = document.querySelector('.bg2-container');
    if (callback) {
        addEndListener(bg, callback);
    }
    bg.classList.add('midActive');
}

function offAnimation() {
    bgE.style.backgroundImage= "url('textures/d"+difficulty+"b2.png')";
    const bg = document.querySelector('.bg-container');
    bg.classList.remove('midActive');
}

function offAnimation2() {
    bg2E.style.backgroundImage= "url('textures/d"+difficulty+"b2.png')";
    const bg = document.querySelector('.bg2-container');
    bg.classList.remove('midActive');
}

// 背景动画结束后，再把上一层背景扬了(
function addEndListener(element, callback) {
    element.addEventListener('transitionend', function handler(event) {
        // 背景好像不需要这个if，但谁知道我以后会加些什么鬼玩意进来(
        if (event.target === element) {
            element.removeEventListener('transitionend', handler); 
            callback();
        }
    });
}

function goShop() {
  gameD.style.opacity = 0.5;
  shopD.style.top = 50+"%";
  updateShop();
}

function goGame() {
  gameD.style.opacity = 1;
  shopD.style.top = -100+"%";
  if (defaults){
    Maxbullets = [6,6,6,6,6,6];
    player.maxHealth = 5;
  }else{
    for (i = 0; i < 5; i++){
      Maxbullets[i] = buys[i];
    }
    Maxbullets[5] = 6;
    player.maxHealth = buys[5];
  }
}

function updateShop() {
  coinsD.textContent = coins.toFixed(1);
  for (let i=0; i<5; i++){
    if (buys[i] < MaxBuys[i]){
      document.getElementById('bootCount'+(i+1)).textContent =buys[i];
      document.getElementById('buy'+(i+1)).textContent =(buyCoins[i]+0.0499999).toFixed(1)+" coins";
    }else{
      document.getElementById('bootCount'+(i+1)).textContent =buys[i];
      document.getElementById('buy'+(i+1)).textContent ="Maxed out";
    }
  }

  if (buys[5] < MaxBuys[5]){
    document.getElementById("heart").textContent = buys[5];
    document.getElementById('buy6').textContent =(buyCoins[5]+0.0499999).toFixed(1)+" coins";
  }else{
    document.getElementById("heart").textContent = buys[5];
    document.getElementById('buy6').textContent ="Maxed out";
  }
}

function buy(i) {
  if (coins >= buyCoins[i] && buys[i] < MaxBuys[i]) {
    coins -= buyCoins[i];
    buyCoins[i] *= 1.1;
    buys[i]++;
    updateShop();
    storageData();
  }
}

function gameOvers() {
    gameOver = true;
    drawUI();
}

function defaultButton(){
    defaults = !defaults;
    if (defaults){
        deb.style.backgroundColor = "#f00";
    }else{
        deb.style.backgroundColor = "#fff"
    }
}

function storageData() {
  localStorage.setItem("coins", JSON.stringify(coins));
  localStorage.setItem("buys", JSON.stringify(buys));
  localStorage.setItem("buyCoins", JSON.stringify(buyCoins));
}

function loadData() {
    if (localStorage.getItem("coins") != null) {
        coins = JSON.parse(localStorage.getItem("coins"));
        buys = JSON.parse(localStorage.getItem("buys"));
        buyCoins = JSON.parse(localStorage.getItem("buyCoins"));
    }else{
        coins = 0;
        buyCoins = [1,3,10,30,100,150];
        buys = [6,6,6,6,6,5];
    }
}
