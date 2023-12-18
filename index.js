function makeTable() {
  let table = document.querySelector('#tbl');
  for (let i = 0; i < 20; i++) {
    let tr = document.createElement('tr');
    tbl.appendChild(tr);
    for (let j = 0; j < 11; j++) {
      let td = document.createElement('td');
      tr.appendChild(td);
      td.classList.add(`tr_${i}_td_${j}`);
    }
  }
}

makeTable();

function createFigure() {
  let figure = [
    [
      [5, -3],
      [5, -2],
      [4, -2],
      [4, -1]
    ],
    [
      [5, -4],
      [5, -3],
      [5, -2],
      [5, -1]
    ],
    [
      [4, -2],
      [4, -1],
      [5, -2],
      [5, -1]
    ]
  ]

  rnd = Math.round(Math.random()*2);
  return figure[rnd];
}

let currentFigure = createFigure();

function filled(x, y) {
  if (outside(x, y)) return false;

  let b = document.querySelector(`.tr_${y}_td_${x}`);
  return b.classList.contains('red');
}

function canPutHere(nf, cf) {

  for (let i = 0; i < nf.length; i++) {
    // check if COORDS are outside the borders
    console.log(nf[i][1]);
   // if (outside(nf[i][0], nf[i][1])) continue;
    if (filled(nf[i][0], nf[i][1])) {
      // IT IS ME OR NOT
      let itsme = false;
      for (let j = 0; j < cf.length; j++) {
        if (nf[i][0] === cf[j][0] && nf[i][1] === cf[j][1]) {
          itsme = true;
          break;
        }
      }
      if (!itsme) return false;
    }

    if (nf[i][1]==20) return false

  }
  return true;
}


function fall(f) {
  let nf = [];
  for (let i = 0; i < f.length; i++) {
    nf[i] = [f[i][0], f[i][1] + 1];
  }
  return nf;
}

function move(f,dir) {
  let nf = [];

  for (let i = 0; i < f.length; i++) {
    nf[i]=f[i];

    if ( dir === 'left' ) {
      nf[i][0]=f[i][0]-1
    } else {
      nf[i][0]=f[i][0]+1
    }

    if (nf[i][0]<0 || nf[i][0]>11) return;
  }

  if (canPutHere(nf,f)) f = nf;
}

function outside(x, y) {
  return x < 0 || y < 0 || y > 19;
}

function clear(cf) {
  for (let i = 0; i < cf.length; i++) {
    if (outside(cf[i][0], cf[i][1])) continue;
    document.querySelector(`.tr_${cf[i][1]}_td_${cf[i][0]}`).classList.remove('red');
  }
}

function draw(nf) {
  for (let i = 0; i < nf.length; i++) {
    if (outside(nf[i][0], nf[i][1])) continue;
    document.querySelector(`.tr_${nf[i][1]}_td_${nf[i][0]}`).classList.add('red')
  }
}



function run() {

  let nextFigure = fall(currentFigure);

  if(Math.random()>0.7) move(nextFigure,'left');
  else if (Math.random()<0.2) move(nextFigure,'right');


  if (!canPutHere(nextFigure, currentFigure)) {
    currentFigure = createFigure();
    nextFigure = fall(currentFigure);
  }


  clear(currentFigure);
  draw(nextFigure);

  currentFigure = JSON.parse(JSON.stringify(nextFigure))

  const asdf = setTimeout(() => {
    run();
  }, 200);

}

run();
