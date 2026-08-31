const canvas = document.getElementById( 'game' );
const ctx = canvas.getContext( '2d' );

const BLOCK_W = 32;
const BLOCK_H = 16;
const BLOCK_ROWS = 7;
const BLOCK_COLS = 15;
const BLOCK_TOP = 60;
const BLOCK_LEFT = 0;

const BLOCK_COLOR_ORDER = [ 'red', 'yellow', 'green', 'cyan', 'magenta', 'hotpink', 'gray' ];

const PADDLE_W = 162;
const PADDLE_H = 14;
const PADDLE_Y = 600;

const BALL_SIZE = 16;

const paddle = {
  x: ( canvas.width - PADDLE_W ) / 2,
  y: PADDLE_Y,
  w: PADDLE_W,
  h: PADDLE_H,
};

const ball = {
  x: canvas.width / 2 - BALL_SIZE / 2,
  y: paddle.y - BALL_SIZE,
  w: BALL_SIZE,
  h: BALL_SIZE,
};

const blocks = [];
for ( let row = 0; row < BLOCK_ROWS; row++ ) {
  for ( let col = 0; col < BLOCK_COLS; col++ ) {
    blocks.push( {
      x: BLOCK_LEFT + col * BLOCK_W,
      y: BLOCK_TOP + row * BLOCK_H,
      w: BLOCK_W,
      h: BLOCK_H,
      color: BLOCK_COLOR_ORDER[ row % BLOCK_COLOR_ORDER.length ],
    } );
  }
}

function draw() {
  ctx.clearRect( 0, 0, canvas.width, canvas.height );

  for ( const block of blocks ) {
    drawSprite( ctx, `block_${ block.color }`, block.x, block.y, block.w, block.h );
  }

  drawSprite( ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h );
  drawSprite( ctx, 'ball', ball.x, ball.y, ball.w, ball.h );
}

loadSpritesheet( draw );
