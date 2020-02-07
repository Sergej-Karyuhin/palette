let canvas = document.getElementById('cs');
let ctx = canvas.getContext('2d');

let matrix = [
  ["#C0C0C0", "#000000","#808080","#C0C0C0"],
  ["#000000", "#808080","#C0C0C0","#000000"],
  ["#808080", "#C0C0C0","#000000","#808080"],
  ["#C0C0C0", "#000000","#808080","#C0C0C0"]
];

let tools = ['bucket', 'choose', 'pencil'];
let tool_flag = "pencil";
let allow_flag = false;
let color_flag = '#008000';

let color_pick = document.getElementById('color-pick');
let current = document.getElementById('currentC');
let prev = document.getElementById('prevC');





function drawMatrix() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      ctx.fillStyle = matrix[i][j];
      ctx.fillRect( (i * 128), (j * 128), 128, 128 );
    }
  }
}

function changeTool(tool) {
  for (i of tools) {
    let tmp = document.getElementById(i);
    if (tmp.id == tool.id) {
      continue;
    }
    else {
      tmp.style.backgroundColor = '#ffffff';
    }
  }
  tool.style.backgroundColor = '#ad1fa6';
  tool_flag = tool.id;
}

function btnPrev() {
  let tmp = current.style.backgroundColor;
  color_flag = prev.style.backgroundColor;
  current.style.backgroundColor = prev.style.backgroundColor;
  prev.style.backgroundColor = tmp;
}

function btnRed() {
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = 'red';
  color_flag = 'red';
}

function btnBlue() {
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = 'blue';
  color_flag = 'blue';
}

function currentClick() {
  color_pick.click();
}

function getCoords(event) {
    let target;
    let canv_x = event.offsetX;
    let canv_y = event.offsetY;
    let counterX = 0;
    let counterY = 0;
    let flag = false;

    if (tool_flag == 'pencil') {
      return
    }

    for (let i = 0; i < 512; i += 128) {
      if (canv_y >= i && canv_y <= i + 128) {
        for (let j = 0; j < 512; j += 128) {
          if (canv_x >= j && canv_x <= j + 128) {
            target = matrix[counterX][counterY];
            flag = true;
            break;
          }
            counterY += 1;
        }
      }
      if (flag == true) {
        break;
      }
      counterX += 1;
    }

    switch (tool_flag) {
      case 'bucket':
        let countY = 0;
        let countX = 0;
        bucket_flag = true;
        ctx.fillStyle = color_flag;
        ctx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 512; i += 128) {
          for (let j = 0; j < 512; j += 128) {
            matrix[countY][countX] = color_flag;
            countY += 1;
          }
          countY = 0;
          countX += 1;
        }
        break;
      case 'choose':
        prev.style.backgroundColor = color_flag;
        color_flag = target;
        current.style.backgroundColor = target;
        break;
    }
}

function pencilCore() {
  let flag = false;
  let counterY = 0;
  let counterX = 0;

  canv_x = event.offsetX;
  canv_y = event.offsetY;
  ctx.fillStyle = color_flag;

  if (tool_flag != 'pencil') {
    return;
  }

  for (let i = 0; i < 512; i += 128) {
    if ( (canv_y >= i) && (canv_y <= (i + 128)) ) {
        for (let j = 0; j < 512; j += 128) {
            if ( (canv_x >= j) && (canv_x <= (j + 128)) ) {
              matrix[counterY][counterX] = color_flag;
              ctx.fillRect( (128 * counterX), (128 * counterY), 128, 128);
              flag = true;
              break;
            }
            counterX += 1;
        }
    }
    if (flag == true) {
      break;
    }
    counterY += 1;
  }
}

function allowed_pencil() {
  if (!(allow_flag)) {
    return;
  }
  pencilCore();
}

function init_pencil() {
  allow_flag = true;
  pencilCore();
}

function close_pencil() {
  allow_flag = false;
}

function drawImageActualSize() {
  canvas.width = this.naturalWidth;
  canvas.height = this.naturalHeight;
  ctx.drawImage(this, 0, 0);
  ctx.drawImage(this, 0, 0, this.width, this.height);
}


// localStorage.clear();


canvas.width = 512;
canvas.height = 512;
document.getElementById('pencil').style.backgroundColor = '#ad1fa6';
color_pick.addEventListener('input', function() {
  color_flag = color_pick.value;
  prev.style.backgroundColor = current.style.backgroundColor;
  current.style.backgroundColor = color_flag;
});
document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyB') {
    changeTool(bucket);
  }
  if (event.code == 'KeyC') {
    changeTool(choose);
  }
  if (event.code == 'KeyP') {
    changeTool(pencil);
  }
});
window.onload = function() {
  if (!localStorage.getItem('canvasImage')) {
    drawMatrix();
  }
  let url = localStorage.getItem('canvasImage');
  let img = new Image(512, 512);
  img.onload = drawImageActualSize;
  img.src = url;
}
window.onbeforeunload = function() {
  localStorage.setItem('canvasImage', canvas.toDataURL());
};
