const board=document.querySelector('.board');
const blockHeight=30;
const blockWidth=30;

const rows=Math.floor(board.clientHeight/blockHeight);
const cols=Math.floor(board.clientWidth/blockWidth);

const blocks=[];
const snake=[
  { x:3,
    y:3
  }
];

let direction='right';
const food={
  x:Math.floor(Math.random()*rows),
  y:Math.floor(Math.random()*cols)
};

for(let i=0;i<rows;i++){
  for(let j=0;j<cols;j++){
    const block=document.createElement('div');
    block.classList.add('block');
    board.append(block);
    blocks[`${i},${j}`]=block;
  }
}

function rendor(){
  snake.forEach((segment)=>{
    blocks[`${segment.x},${segment.y}`].classList.add('fill');
  })

  blocks[`${food.x},${food.y}`].classList.add('food');
}

setInterval(() => {
  let head=snake[0];  
  if(direction==='left'){
    snake.unshift({x:head.x,y:head.y-1});
  }else if(direction==='right'){
    snake.unshift({x:head.x,y:head.y+1});
  }else if(direction==='up'){
    snake.unshift({x:head.x-1,y:head.y});
  }else if(direction==='down'){
    snake.unshift({x:head.x+1,y:head.y});
  }
  snake.forEach((segment)=>{
    blocks[`${segment.x},${segment.y}`].classList.remove('fill');
  });
  snake.pop();
  rendor();
}, 300);

addEventListener('keydown',(event)=>{
  if(event.key==='ArrowLeft'){
    direction='left';
  }else if(event.key==='ArrowRight'){
    direction='right';
  }else if(event.key==='ArrowUp'){
    direction='up';
  }else if(event.key==='ArrowDown'){
    direction='down';
  }
});

