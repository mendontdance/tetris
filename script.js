function makeTable() {
  let table = document.querySelector('#tbl');
  for (let i = 0; i < 20; i++) {
    let tr = document.createElement('tr');
    tbl.appendChild(tr);
    for (let j = 0; j < 11; j++) {
      let td = document.createElement('td');
      tr.appendChild(td);
      td.classList.add(`tr_${i}_td_${j}`);
      td.classList.add(`tr_${i}`);
      td.classList.add(`td_${j}`);
      td.classList.add('white')
    }
  }
}

makeTable();

let index = 0;
let score = 0;
let scoreDiv = document.querySelector('#score');
let recordDiv = document.querySelector('#record');
let timer = 500;
let level = 1;
let levelDiv = document.querySelector('#level');
let initialTime = timer;

let colors = ['red', 'blue', 'black', "violet", "dark-green", "orange", "cyan"];
let color = '';

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
    ],
    [
      [6, -3],
      [5, -3],
      [5, -2],
      [5, -1]
    ],
    [
      [4, -3],
      [4, -2],
      [5, -2],
      [5, -1]
    ],
    [
      [5, -3],
      [6, -3],
      [6, -2],
      [6, -1]
    ],
    [
      [5, -3],
      [5, -2],
      [6, -2],
      [5, -1]
    ],
  ]
  index = index + 1;
  choosingRandomFigure = Math.round(Math.random() * 6); // выбираю рандомную фигуру
  nameFigure = choosingRandomFigure

  if (score > 5 && score <= 10) {
    timer = 400
    level = 2
    levelDiv.textContent = `${level}`;
    initialTime = timer
  } else if (score > 20 && score <= 40) {
    timer = 300
    level = 3
    levelDiv.textContent = `${level}`;
    initialTime = timer
  } else if (score > 30 && score <= 80) {
    timer = 200
    level = 4
    levelDiv.textContent = `${level}`;
    initialTime = timer
  } else if (score > 80) {
    timer = 100
    level = 5
    levelDiv.textContent = `${level}`;
    initialTime = timer
  }

  recordDiv.textContent = localStorage.getItem('record')
  color = colors[choosingRandomFigure];
  return figure[choosingRandomFigure];
}
let nameFigure = 0
let currentFigure = createFigure(); // Создаю первую фигуру
let gameOver = false;

function canPutHere(future, history) {
  for (let k = 0; k < future.length; k++) {
    if (future[k][1] === 20) return false
    for (let i = 0; i < history.length; i++) {
      if (history[i][1] < 0 || history[i][0] < 0) continue;
      if (filled(future[i][0], future[i][1])) {
        if (future[i][1] > 19) return false
        let itsMe = false;
        for (let j = 0; j < future.length; j++) {
          const cell = document.querySelector(`.tr_${future[i][1]}_td_${future[i][0]}`)
          if (cell.classList.contains(`${color}_${index}`)) {
            itsMe = true;
            break;
          } else if (!cell.classList.contains(`${color}_${index}`)) {
            itsMe = false
          }
        }
        if (!itsMe) return false;
      }
    }
  }
  return true;
}

function filled(x, y) {
  const cell = document.querySelector(`.tr_${y}_td_${x}`)
  for (let i = 0; i < colors.length; i++) {
    if (cell && cell.classList.contains(colors[i])) {
      return true
    }
  }
  return false
}

if (score >= localStorage.getItem('record')) {
  recordDiv.textContent = score;
  localStorage.setItem('record', score)
}


function run() {
  let historyFigure = JSON.parse(JSON.stringify(currentFigure));
  for (let i = 0; i < currentFigure.length; i++) {
    currentFigure[i] = [currentFigure[i][0], currentFigure[i][1] + 1];
  }
  let futureFigure = JSON.parse(JSON.stringify(currentFigure));

  if (score >= localStorage.getItem('record')) {
    recordDiv.textContent = score;
    localStorage.setItem('record', score)
  }

  if (!canPutHere(futureFigure, historyFigure)) {
    for (let i = 0; i < currentFigure.length; i++) {
      if (currentFigure[i][1] < 0) {
        gameOver = true
        clearTimeout();
        return;
      }
    }
    for (let i = 0; i < 20; i++) {
      let arr = [];
      let cells = document.querySelectorAll(`.tr_${i}`);
      for (let j = 0; j < cells.length; j++) {
        if (!cells[j].classList.contains('white')) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      }
      if (arr.every(cell => cell === true)) {
        score = score + level;
        scoreDiv.textContent = score;
        for (let j = 0; j < cells.length; j++) {
          cells[j].classList.add('white')
          for (let k = 0; k < colors.length; k++) {
            cells[j].classList.remove(colors[k]);
            for (let k = 0; k <= index; k++) {
              cells[j].classList.remove(`${colors[k]}_${k}`);
            }
          }
        }
        for (let j = i - 1; j >= 0; j--) {
          for (let k = 0; k < 11; k++) {
            const cell = document.querySelector(`.tr_${j}_td_${k}`);
            const cellNext = document.querySelector(`.tr_${j + 1}_td_${k}`);
            if (cell && cellNext) {
              for (let l = 0; l < colors.length; l++) {
                if (cell.classList.contains(colors[l]) && cellNext.classList.contains('white')) {
                  cellNext.classList.add(colors[l])
                  cell.classList.remove(colors[l])
                  cellNext.classList.remove('white')
                  cell.classList.add('white')
                  for (let p = 0; p <= index; p++) {
                    if (cell.classList.contains(`${colors[l]}_${p}`)) {
                      cell.classList.remove(`${colors[l]}_${p}`);
                      cellNext.classList.add(`${colors[l]}_${p}`);
                    }
                  }
                }
              }
            }
          }
        }
        // for (let j = 20; j >= 0; j--) {
        //   const cells1 = document.querySelectorAll(`.tr_${j}`);
        //   const cells2 = document.querySelectorAll(`.tr_${j - 1}`);
        //
        //   for (let k = 0; k < cells1.length; k++) {
        //     console.log(cells1[k])
        //     console.log(cells2[k])
        //     if (cells1[k] && cells2[k]) {
        //       if(cells2[k] && cells2[k].classList.contains('red')) {
        //         cells2[k].classList.add('white')
        //         cells2[k].classList.remove(`red`);
        //
        //         cells1[k].classList.remove('white');
        //         cells1[k].classList.add(`red`);
        //         for (let p = 0; p <= index; p++) {
        //           if (cells2[k].classList.contains(`red_${p}`)) {
        //             cells2[k].classList.remove(`red_${p}`);
        //             cells1[k].classList.add(`red_${p}`);
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
    position = 0
    currentFigure = createFigure();
  } else {
    for (let i = 0; i < historyFigure.length; i++) {
      const cell = document.querySelector(`.tr_${historyFigure[i][1]}_td_${historyFigure[i][0]}`);
      if (cell) {
        cell.classList.add('white')
        cell.classList.remove(color);
        cell.classList.remove(`${color}_${index}`);
      }
    }

    for (let i = 0; i < futureFigure.length; i++) {
      let cell = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
      if (cell) {
        cell.classList.remove('white')
        cell.classList.add(color);
        cell.classList.add(`${color}_${index}`);
      }
    }
  }
  // cells.every(elem => console.log(elem))
  // if(cells.every(cell => cell.classList.contains('red'))) {
  //   cells.every(cell => cell.classList.remove('red'))
  //   for (let k = 0; k < index; k++) {
  //     cells[k].classList.remove(`red_${k}`);
  //   }
  // }
  // for (let j = 0; j < cells.length; j++) {
  //   let flag2 = false
  //   if(cells[j].classList.contains(`red`)) flag2 = true;
  //   if (flag2) {
  //     for (let q = 0; q < cells.length; q++) {
  //       cells[q].classList.remove('red')
  //       for (let k = 0; k < index; k++) {
  //         cells[q].classList.remove(`red_${k}`);
  //       }
  //     }
  //   }
  // }
  // }
  // Короче надо по индексу сделать, если индекс содержит красный с тем же индексом - это я
  // Если ячейка содержит красный цвет, но не тот же индекс, то это не я и возвращаем false

  setTimeout(() => {
    if (!gameOver) run()
  }, timer);
  timer = initialTime;
}

let position = 0;
document.addEventListener('keydown', function (event) {
  if (event.key === "ArrowLeft") {
    let historyFigure = JSON.parse(JSON.stringify(currentFigure));
    let asdf = JSON.parse(JSON.stringify(currentFigure));
    let flag = true;
    for (let i = 0; i < historyFigure.length; i++) {
      if (asdf[i][0] + 1 < 0 || asdf[i][1] + 1 > 20) return
      asdf[i][0] -= 1;
    }
    let futureFigure = JSON.parse(JSON.stringify(asdf))


    // Здесь надо переработать функцию для проверки движения фигуры вбок, если там уже занято,
    // то нельзя ставить туда фигуру и отменять движение
    // for (let k = 0; k < futureFigure.length; k++) {
    //   if (futureFigure[k][1] === 20) return false
    //   if (outside(futureFigure[k][0], futureFigure[k][1])) return false
    //   let itsMe = false;
    //   for (let j = 0; j < futureFigure.length; j++) {
    //     const cell = document.querySelector(`.tr_${futureFigure[j][1]}_td_${futureFigure[j][0]}`)
    //     if (cell.classList.contains(`red_${index}`)) {
    //       itsMe = true;
    //       break;
    //     } else if (!cell.classList.contains(`red_${index}`)) {
    //       itsMe = false
    //     }
    //   }
    //   if (!itsMe) return false;
    // }

    for (let k = 0; k < futureFigure.length; k++) {
      if (futureFigure[k][1] === 20) return
      if (futureFigure[k][0] + 1 < 0 || futureFigure[k][1] + 1 > 20) {
        flag = false;
        break
      }
      const cell = document.querySelector(`.tr_${futureFigure[k][1]}_td_${futureFigure[k][0]}`);
      for (let i = 0; i < colors.length; i++) {
        if (cell && cell.classList.contains(colors[i]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        }
      }
      if (futureFigure[k][0] < 0) {
        flag = false;
        return;
      }
    }

    for (let k = 0; k < colors.length; k++) {
      for (let i = 0; i < historyFigure.length; i++) {
        const cell = document.querySelector(`.tr_${historyFigure[i][1]}_td_${historyFigure[i][0]}`);
        const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        if (cell2 && cell2.classList.contains(colors[k]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        } else if (cell) {
          cell.classList.add('white')
          cell.classList.remove(color);
          cell.classList.remove(`${color}_${index}`);
        }
      }

      for (let i = 0; i < futureFigure.length; i++) {
        let cell = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        if (cell2 && cell2.classList.contains(colors[k]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          break
        } else if (cell) {
          cell.classList.remove('white')
          cell.classList.add(color);
          cell.classList.add(`${color}_${index}`);
        }
      }
    }
    if (flag) {
      currentFigure = JSON.parse(JSON.stringify(asdf));
    }
  }

  if (event.key === "ArrowRight") {
    let historyFigure = JSON.parse(JSON.stringify(currentFigure));
    let asdf = JSON.parse(JSON.stringify(currentFigure));
    let flag = true;
    for (let i = 0; i < historyFigure.length; i++) {
      if (asdf[i][0] + 1 < 0 || asdf[i][1] + 1 > 20) return
      asdf[i][0] += 1
    }
    let futureFigure = JSON.parse(JSON.stringify(asdf))

    // Здесь надо переработать функцию для проверки движения фигуры вбок, если там уже занято,
    // то нельзя ставить туда фигуру и отменять движение
    // for (let k = 0; k < futureFigure.length; k++) {
    //   if (futureFigure[k][1] === 20) return false
    //   if (outside(futureFigure[k][0], futureFigure[k][1])) return false
    //   let itsMe = false;
    //   for (let j = 0; j < futureFigure.length; j++) {
    //     const cell = document.querySelector(`.tr_${futureFigure[j][1]}_td_${futureFigure[j][0]}`)
    //     if (cell.classList.contains(`red_${index}`)) {
    //       itsMe = true;
    //       break;
    //     } else if (!cell.classList.contains(`red_${index}`)) {
    //       itsMe = false
    //     }
    //   }
    //   if (!itsMe) return false;
    // }

    for (let k = 0; k < futureFigure.length; k++) {
      if (futureFigure[k][1] === 20) return
      if (futureFigure[k][0] + 1 < 0 || futureFigure[k][1] + 1 > 20) {
        flag = false;
        break
      }
      const cell = document.querySelector(`.tr_${futureFigure[k][1]}_td_${futureFigure[k][0]}`);
      for (let i = 0; i < colors.length; i++) {
        if (cell && cell.classList.contains(colors[i]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        }
      }
      if (futureFigure[k][0] > 10) {
        flag = false;
        return;
      }
    }

    for (let k = 0; k < colors.length; k++) {
      for (let i = 0; i < historyFigure.length; i++) {
        const cell = document.querySelector(`.tr_${historyFigure[i][1]}_td_${historyFigure[i][0]}`);
        const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        if (cell2 && cell2.classList.contains(colors[k]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        } else if (cell) {
          cell.classList.add('white')
          cell.classList.remove(color);
          cell.classList.remove(`${color}_${index}`);
        }
      }

      for (let i = 0; i < futureFigure.length; i++) {
        let cell = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
        if (cell2 && cell2.classList.contains(colors[k]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          break
        } else if (cell) {
          cell.classList.remove('white')
          cell.classList.add(color);
          cell.classList.add(`${color}_${index}`);
        }
      }
    }
    if (flag) {
      currentFigure = JSON.parse(JSON.stringify(asdf));
    }
  }

  if (event.key === "ArrowUp" || event.key === " ") {
    let historyFigure = JSON.parse(JSON.stringify(currentFigure));
    let asdf = JSON.parse(JSON.stringify(currentFigure));
    let flag = true;
    let initial = position;
    if (nameFigure === 0) {
      if (position === 0) {
        asdf[0][0] -= 1;
        asdf[0][1] += 1;
        asdf[2][0] += 1;
        asdf[2][1] += 1;
        asdf[3][0] += 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][0] += 1;
        asdf[0][1] -= 1;
        asdf[2][0] -= 1;
        asdf[2][1] -= 1;
        asdf[3][0] -= 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0;
        }
      }
    } else if (nameFigure === 1) {
      if (position === 0) {
        asdf[0][0] -= 2;
        asdf[0][1] += 2;
        asdf[1][0] -= 1;
        asdf[1][1] += 1;
        asdf[3][0] += 1;
        asdf[3][1] -= 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][0] += 2;
        asdf[0][1] -= 2;
        asdf[1][0] += 1;
        asdf[1][1] -= 1;
        asdf[3][0] -= 1;
        asdf[3][1] += 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0
        }
      }
    } else if (nameFigure === 2) {
      return
    } else if (nameFigure === 3) {
      if (position === 0) {
        asdf[0][0] -= 2;
        asdf[1][0] -= 1;
        asdf[1][1] += 1;
        asdf[3][0] += 1;
        asdf[3][1] -= 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][1] += 1;
        asdf[1][0] += 1;
        asdf[2][1] -= 1;
        asdf[3][0] -= 1;
        asdf[3][1] -= 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 2
        }
      } else if (position === 2) {
        asdf[0][0] += 2;
        asdf[1][0] -= 1;
        asdf[1][1] -= 1;
        asdf[3][0] += 1;
        asdf[3][1] += 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 2;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 3
        }
      } else if (position === 3) {
        asdf[0][1] -= 1;
        asdf[1][0] += 1;
        asdf[2][1] += 1;
        asdf[3][0] -= 1;
        asdf[3][1] += 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 3;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0
        }
      }
    } else if (nameFigure === 4) {
      if (position === 0) {
        asdf[0][1] += 1;
        asdf[1][0] -= 1;
        asdf[1][1] += 1;
        asdf[3][0] -= 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][1] -= 1;
        asdf[1][0] += 1;
        asdf[1][1] -= 1;
        asdf[3][0] += 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0;
        }
      }
    } else if (nameFigure === 5) {
      // [
      //   [5, -3], [5, -2]
      //   [6, -3], [5, -3]
      //   [6, -2], [6, -3]
      //   [6, -1], [7, -3]
      // ],
      if (position === 0) {
        asdf[0][1] += 1;
        asdf[1][0] -= 1;
        asdf[2][1] -= 1;
        asdf[3][0] += 1;
        asdf[3][1] -= 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][0] += 1;
        asdf[0][1] += 1;
        asdf[1][1] += 2;
        asdf[2][0] -= 1;
        asdf[2][1] += 1;
        asdf[3][0] -= 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 2;
        }
      } else if (position === 2) {
        asdf[0][0] += 1;
        asdf[0][1] -= 2;
        asdf[1][0] += 2;
        asdf[1][1] -= 1;
        asdf[2][0] += 1;
        asdf[3][1] += 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 2;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 3;
        }
      } else if (position === 3) {
        asdf[0][0] -= 2;
        asdf[1][0] -= 1;
        asdf[1][1] -= 1;
        asdf[3][0] += 1;
        asdf[3][1] += 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 3;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0;
        }
      }
    } else if (nameFigure === 6) {
      // [
      //   [6, -3],
      //   [6, -2],
      //   [5, -2],
      //   [6, -1]
      // ],
      if (position === 0) {
        asdf[0][0] -= 1;
        asdf[0][1] += 1;
        asdf[2][0] -= 1;
        asdf[2][1] -= 1;
        asdf[3][0] += 1;
        asdf[3][1] -= 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 0;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 1
        }
      } else if (position === 1) {
        asdf[0][0] += 2;
        asdf[0][1] += 1;
        asdf[1][0] += 1;
        asdf[2][1] += 1;
        asdf[3][1] -= 1;
        if (!canPutHere(asdf, historyFigure)) {
          position = 1;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 2
        }
      } else if (position === 2) {
        asdf[0][1] -= 2;
        asdf[1][0] -= 1;
        asdf[1][1] -= 1;
        asdf[3][0] -= 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 2;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 3
        }
      } else if (position === 3) {
        asdf[0][0] -= 1;
        asdf[1][1] += 1;
        asdf[2][0] += 1;
        asdf[3][0] += 1;
        asdf[3][1] += 2;
        if (!canPutHere(asdf, historyFigure)) {
          position = 2;
          asdf = JSON.parse(JSON.stringify(currentFigure));
        } else {
          position = 0
        }
      }
    }
    for (let i = 0; i < asdf.length; i++) {
      if (asdf[i][0] < 0 || asdf[i][0] > 10) {
        position = initial
        return
      }
    }

    let futureFigure = JSON.parse(JSON.stringify(asdf))

    for (let k = 0; k < futureFigure.length; k++) {
      if (futureFigure[k][1] === 20) return
      if (futureFigure[k][0] + 1 < 0 || futureFigure[k][1] + 1 > 20) {
        flag = false;
        break
      }
      const cell = document.querySelector(`.tr_${futureFigure[k][1]}_td_${futureFigure[k][0]}`);
      for (let i = 0; i < colors; i++) {
        if (cell && cell.classList.contains(colors[i]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        }
      }
      if (futureFigure[k][0] > 10) {
        flag = false;
        return;
      }
    }

    for (let i = 0; i < historyFigure.length; i++) {
      const cell = document.querySelector(`.tr_${historyFigure[i][1]}_td_${historyFigure[i][0]}`);
      const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
      for (let j = 0; j < colors.length; j++) {
        if (cell2 && cell2.classList.contains(colors[j]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          return
        } else if (cell) {
          cell.classList.add('white')
          cell.classList.remove(color);
          cell.classList.remove(`${color}_${index}`);
        }
      }
    }

    for (let i = 0; i < futureFigure.length; i++) {
      let cell = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
      const cell2 = document.querySelector(`.tr_${futureFigure[i][1]}_td_${futureFigure[i][0]}`);
      for (let j = 0; j < colors.length; j++) {
        if (cell2 && cell2.classList.contains(colors[j]) && !canPutHere(futureFigure, historyFigure)) {
          flag = false;
          break
        } else if (cell) {
          cell.classList.remove('white')
          cell.classList.add(color);
          cell.classList.add(`${color}_${index}`);
        }
      }
    }
    if (flag) {
      currentFigure = JSON.parse(JSON.stringify(asdf));
    }
  }
  if (event.key === "ArrowDown") {
    timer = 50;
  }
});

const buttonStart = document.querySelector('#button-start');
const buttonStop = document.querySelector('#button-stop');

buttonStart.addEventListener('click', (e) => {
  e.preventDefault();
  buttonStart.blur()
  run()
  gameOver = false
});

buttonStop.addEventListener('click', (e) => {
  e.preventDefault();
  buttonStop.blur()
  gameOver = true
});