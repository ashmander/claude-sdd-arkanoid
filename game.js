const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const BLOCK_W = 32;
const BLOCK_H = 16;
const BLOCK_TOP = 60;
const BLOCK_LEFT = 0;

const BLOCK_COLOR_ORDER = [ 'red', 'yellow', 'green', 'cyan', 'magenta', 'hotpink', 'gray' ];

const PADDLE_W = 162;
const PADDLE_H = 14;
const PADDLE_Y = 600;

const BALL_SIZE = 16;

const LIVES_START = 3;

const paddle = {
  x: ( canvas.width - PADDLE_W ) / 2,
  y: PADDLE_Y,
  w: PADDLE_W,
  h: PADDLE_H,
};

let gameState = 'start';
let lives = LIVES_START;
let currentLevelIndex = 0;

const bounceSound = new Audio( 'assets/sounds/ball-bounce.mp3' );
const breakSound = new Audio( 'assets/sounds/break-sound.mp3' );

function playSound( sound ) {
  sound.currentTime = 0;
  sound.play();
}

const BALL_SPEED = 5;
const BALL_MAX_BOUNCE_ANGLE = ( 60 * Math.PI ) / 180;

const ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: paddle.y - BALL_SIZE,
  w: BALL_SIZE,
  h: BALL_SIZE,
  vx: BALL_SPEED * Math.sin( 0.4 ),
  vy: -BALL_SPEED * Math.cos( 0.4 ),
};

function resetBall() {
  ball.x = paddle.x + paddle.w / 2 - ball.w / 2;
  ball.y = paddle.y - ball.h;
  ball.vx = BALL_SPEED * Math.sin( 0.4 );
  ball.vy = -BALL_SPEED * Math.cos( 0.4 );
}

const PADDLE_SPEED = 6;

const keys = {
  left: false,
  right: false,
};

window.addEventListener( 'keydown', ( e ) => {
  if ( e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ) keys.left = true;
  if ( e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ) keys.right = true;
} );

window.addEventListener( 'keyup', ( e ) => {
  if ( e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ) keys.left = false;
  if ( e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ) keys.right = false;
} );

function updatePaddle() {
  if ( keys.left ) paddle.x -= PADDLE_SPEED;
  if ( keys.right ) paddle.x += PADDLE_SPEED;

  if ( paddle.x < 0 ) paddle.x = 0;
  if ( paddle.x + paddle.w > canvas.width ) paddle.x = canvas.width - paddle.w;
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if ( ball.x <= 0 ) {
    ball.x = 0;
    ball.vx = -ball.vx;
    playSound( bounceSound );
  } else if ( ball.x + ball.w >= canvas.width ) {
    ball.x = canvas.width - ball.w;
    ball.vx = -ball.vx;
    playSound( bounceSound );
  }

  if ( ball.y <= 0 ) {
    ball.y = 0;
    ball.vy = -ball.vy;
    playSound( bounceSound );
  }

  const hitsPaddle =
    ball.vy > 0 &&
    ball.y + ball.h >= paddle.y &&
    ball.y + ball.h <= paddle.y + paddle.h &&
    ball.x + ball.w >= paddle.x &&
    ball.x <= paddle.x + paddle.w;

  if ( hitsPaddle ) {
    const ballCenterX = ball.x + ball.w / 2;
    const paddleCenterX = paddle.x + paddle.w / 2;
    const hitPos = ( ballCenterX - paddleCenterX ) / ( paddle.w / 2 );
    const clampedHitPos = Math.max( -1, Math.min( 1, hitPos ) );
    const angle = clampedHitPos * BALL_MAX_BOUNCE_ANGLE;

    ball.y = paddle.y - ball.h;
    ball.vx = BALL_SPEED * Math.sin( angle );
    ball.vy = -BALL_SPEED * Math.cos( angle );
    playSound( bounceSound );
  }

  if ( ball.y > canvas.height ) {
    lives -= 1;
    if ( lives <= 0 ) {
      gameState = 'gameover';
    } else {
      resetBall();
    }
  }
}

const SCORE_PER_BLOCK = 10;
let score = 0;

const explosions = [];

function spawnExplosion( block ) {
  explosions.push( {
    x: block.x,
    y: block.y,
    color: block.color,
    startTime: Date.now(),
  } );
}

function updateExplosions() {
  const now = Date.now();
  for ( let i = explosions.length - 1; i >= 0; i-- ) {
    if ( now - explosions[ i ].startTime >= EXPLOSION_DURATION ) {
      explosions.splice( i, 1 );
    }
  }
}

function checkBlockCollisions() {
  for ( let i = 0; i < blocks.length; i++ ) {
    const block = blocks[ i ];

    const overlaps =
      ball.x < block.x + block.w &&
      ball.x + ball.w > block.x &&
      ball.y < block.y + block.h &&
      ball.y + ball.h > block.y;

    if ( !overlaps ) continue;

    const overlapX = Math.min( ball.x + ball.w, block.x + block.w ) - Math.max( ball.x, block.x );
    const overlapY = Math.min( ball.y + ball.h, block.y + block.h ) - Math.max( ball.y, block.y );

    if ( overlapX < overlapY ) {
      ball.vx = -ball.vx;
    } else {
      ball.vy = -ball.vy;
    }

    blocks.splice( i, 1 );
    score += SCORE_PER_BLOCK;
    spawnExplosion( block );
    playSound( breakSound );

    if ( blocks.length === 0 ) {
      gameState = 'victory';
    }

    break;
  }
}

const LEVEL_COLOR_CHARS = { R: 'red', Y: 'yellow', G: 'green', C: 'cyan', M: 'magenta', H: 'hotpink', A: 'gray' };

function buildLevelFromPattern( pattern ) {
  const created = [];
  for ( let row = 0; row < pattern.length; row++ ) {
    const line = pattern[ row ];
    for ( let col = 0; col < line.length; col++ ) {
      const ch = line[ col ];
      if ( ch === '.' ) continue;
      created.push( {
        x: BLOCK_LEFT + col * BLOCK_W,
        y: BLOCK_TOP + row * BLOCK_H,
        w: BLOCK_W,
        h: BLOCK_H,
        color: LEVEL_COLOR_CHARS[ ch ],
      } );
    }
  }
  return created;
}

const LEVEL_PATTERNS = [
  // Nivel 1: grid clasico, igual al layout unico del spec 01
  [
    'RRRRRRRRRRRRRRR',
    'YYYYYYYYYYYYYYY',
    'GGGGGGGGGGGGGGG',
    'CCCCCCCCCCCCCCC',
    'MMMMMMMMMMMMMMM',
    'HHHHHHHHHHHHHHH',
    'AAAAAAAAAAAAAAA',
  ],
  // Nivel 2: piramide
  [
    'RRRRRRRRRRRRRRR',
    '.YYYYYYYYYYYYY.',
    '..GGGGGGGGGGG..',
    '...CCCCCCCCC...',
    '....MMMMMMM....',
    '.....HHHHH.....',
    '......AAA......',
  ],
  // Nivel 3: tablero de ajedrez
  [
    'R.R.R.R.R.R.R.R',
    '.Y.Y.Y.Y.Y.Y.Y.',
    'G.G.G.G.G.G.G.G',
    '.C.C.C.C.C.C.C.',
    'M.M.M.M.M.M.M.M',
    '.H.H.H.H.H.H.H.',
    'A.A.A.A.A.A.A.A',
  ],
  // Nivel 4: diamante
  [
    '.......R.......',
    '......YYY......',
    '.....GGGGG.....',
    '....CCCCCCC....',
    '.....MMMMM.....',
    '......HHH......',
    '.......A.......',
  ],
  // Nivel 5: marco/caja
  [
    'RRRRRRRRRRRRRRR',
    'Y.............Y',
    'G.GGGGGGGGGGG.G',
    'C.C.........C.C',
    'M.MMMMMMMMMMM.M',
    'H.............H',
    'AAAAAAAAAAAAAAA',
  ],
];

const levels = LEVEL_PATTERNS.map( buildLevelFromPattern );

function getLevelBlocks( index ) {
  return levels[ index ].map( ( block ) => ( { ...block } ) );
}

let blocks = getLevelBlocks( currentLevelIndex );

function resetGame() {
  score = 0;
  lives = LIVES_START;
  blocks = getLevelBlocks( currentLevelIndex );
  explosions.length = 0;
  paddle.x = ( canvas.width - paddle.w ) / 2;
  resetBall();
  gameState = 'start';
}

window.addEventListener( 'keydown', ( e ) => {
  if ( ( e.key === 'r' || e.key === 'R' ) && ( gameState === 'gameover' || gameState === 'victory' ) ) {
    resetGame();
    return;
  }

  if ( gameState === 'start' && e.key === ' ' ) {
    gameState = 'playing';
    return;
  }

  if ( e.key === 'p' || e.key === 'P' || e.key === ' ' ) {
    if ( gameState === 'playing' ) {
      gameState = 'paused';
    } else if ( gameState === 'paused' ) {
      gameState = 'playing';
    }
  }
} );

function draw() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height );

  for ( const block of blocks ) {
    drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.w, block.h );
  }

  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.w, ball.h );

  const now = Date.now();
  for ( const explosion of explosions ) {
    const elapsed = now - explosion.startTime;
    const frames = EXPLOSION_FRAMES[ explosion.color ];
    const frameIndex = Math.min( frames.length - 1, Math.floor( ( elapsed / EXPLOSION_DURATION ) * frames.length ) );
    drawFrame( ctx, frames[ frameIndex ], explosion.x, explosion.y, BLOCK_W, BLOCK_H );
  }

  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText( `Score: ${ score }`, 10, 20 );
  ctx.fillText( `Lives: ${ lives }`, canvas.width - 90, 20 );
  ctx.textAlign = 'center';
  ctx.fillText( `Nivel ${ currentLevelIndex + 1 } / ${ levels.length }`, canvas.width / 2, 20 );
  ctx.textAlign = 'left';

  if ( gameState === 'gameover' || gameState === 'victory' ) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '32px sans-serif';
    ctx.fillText(
      gameState === 'gameover' ? 'GAME OVER' : 'VICTORY',
      canvas.width / 2,
      canvas.height / 2
    );

    ctx.font = '16px sans-serif';
    ctx.fillText( 'Presiona R para reiniciar', canvas.width / 2, canvas.height / 2 + 30 );
    ctx.textAlign = 'left';
  }

  if ( gameState === 'start' ) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '24px sans-serif';
    ctx.fillText( 'ARKANOID', canvas.width / 2, canvas.height / 2 - 20 );

    ctx.font = '16px sans-serif';
    ctx.fillText( 'Presiona ESPACIO para comenzar', canvas.width / 2, canvas.height / 2 + 10 );
    ctx.textAlign = 'left';
  }

  if ( gameState === 'paused' ) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = '32px sans-serif';
    ctx.fillText( 'PAUSA', canvas.width / 2, canvas.height / 2 );

    ctx.font = '16px sans-serif';
    ctx.fillText( 'Presiona P o ESPACIO para continuar', canvas.width / 2, canvas.height / 2 + 30 );
    ctx.textAlign = 'left';
  }
}

function loop() {
  if ( gameState === 'playing' ) {
    updatePaddle();
    updateBall();
    checkBlockCollisions();
  }
  updateExplosions();
  draw();
  requestAnimationFrame( loop );
}

loadSpritesheet( loop );
