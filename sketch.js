var lowerN
var upperN
var coordrange
var v0
var vMax
var A
var start = false
var stepsX
var stepsY

function setup() {
  inputFile = createFileInput(fileSelected);
  inputFile.position(30)

}

function draw() {
  if(start){
    let deltaX = (vMax[0] - v0[0]) / stepsX
    let deltaY = (vMax[1] - v0[1]) / stepsY
    let startCol0 = color(200, 100, 0);
    let startColMax = color(0, 0, 255);
    let endCol0 = color(50, 200, 0);
    let endColMax = color(0, 255, 255);


    background(20);

    //Achsen
    let xMinv = worldToPixel([[coordrange[0][0]], [0]]);
    let xMaxv = worldToPixel([[coordrange[0][1]], [0]]);
    let yMinv = worldToPixel([[0], [coordrange[1][0]]]);
    let yMaxv = worldToPixel([[0], [coordrange[1][1]]]);

    stroke(100)
    strokeWeight(2.6)
    //x-Achse
    line(xMinv[0], xMinv[1], xMaxv[0], xMaxv[1]);
    //y-Achse
    line(yMinv[0], yMinv[1], yMaxv[0], yMaxv[1]);

    for(let itx = 1; itx <= stepsX; itx++){
      for(let ity = 1; ity <= stepsY; ity++){
        let v = [[v0[0] + deltaX * itx], [v0[1] + deltaY * ity]]
        let bahn = getBahn(v, A);
        let t = (itx + ity) / (stepsX + stepsY)
        let col1 = lerpColor(startCol0, startColMax, t);
        let col2 = lerpColor(endCol0, endColMax, t);
        for(let k = 0; k < bahn.length - 1; k++){
          let vec1 = worldToPixel(bahn[k]);
          let vec2 = worldToPixel(bahn[k + 1]);

          //stroke(lerpColor(col1, col2, (k / (bahn.length - 2))));

          stroke(lerpColor(col1, col2, (k / (bahn.length - 2))));
          strokeWeight(2);
          line(vec1[0], vec1[1], vec2[0], vec2[1]);
          stroke(200)
          strokeWeight(4)
          point(vec1[0], vec1[1])
        }
      }
    }
    noLoop()
  }
}

function setParameters(data){
  paras = data.split('\n')
  lowerN = parseInt(paras[0])
  upperN = parseInt(paras[1])
  let x_min = parseInt(paras[2])
  let x_max = parseInt(paras[3])
  let y_min = parseInt(paras[4])
  let y_max = parseInt(paras[5])
  coordrange = [[x_min, x_max], [y_min, y_max]]
  let gxmin = parseInt(paras[6])
  let gxmax = parseInt(paras[7])
  let gymin = parseInt(paras[8])
  let gymax = parseInt(paras[9])
  v0 = [gxmin, gymin]
  vMax = [gxmax, gymax]
  stepsX = parseInt(paras[10])
  stepsY = parseInt(paras[11])
  let a = parseInt(paras[12])
  let b = parseInt(paras[13])
  let c = parseInt(paras[14])
  let d = parseInt(paras[15])
  A = [[a,b], [c, d]]
  console.log(A)
}

function fileSelected(file){  
  setParameters(file.data);
  start = true;
  createCanvas(1000, 1000); 
}

function getBahn(v, mat){
  let result = [];
  for(let i = lowerN; i <= upperN; i++){
    let matrix = matrixPower(mat, i);
    
    let res = matrixMult(matrix, v);
    append(result, matrixMult(matrix, v));
  }
  return result;
}

function worldToPixel(v){

  let tx = clamp(0,1,(v[0][0] - coordrange[0][1]) / (coordrange[0][0] - coordrange[0][1]));
  let ty = clamp(0,1,(v[1][0] - coordrange[1][1]) / (coordrange[1][0] - coordrange[1][1]));
  return [tx * width, height * (1 - ty)];
}

function clamp(a, b, x){
  return x//(max(a, min(x, b)));
}

function matrixPower(mat, n){
  let result = [[1, 0], [0, 1]];
  if(n < 0){
    let det = (mat[0][0] * mat[1][1]) - (mat[1][0] * mat[0][1]);
    if(det == 0) {
      return result;
    }
    else{
      let matinv =  [[mat[1][1] / det, -(mat[0][1] / det)], [-(mat[1][0] / det) , mat[0][0] / det]]
      for(let i = 0; i < -n; i++){
        result = matrixMult(result, matinv);
      }
    }
  }
  else if(n > 0){
    for(let i = 0; i < n; i++){
      result = matrixMult(result, mat);
    }
  }
  return result;
}

function matrixMult(A, B) {
  if(A[0].length !== B.length) return "A col != B row"
  l = A.length;      // Number of rows in A
  m = A[0].length;   // Number of columns in A and number of rows in B
  n = B[0].length;   // Number of columns in B
  
  //console.log("A is an :" + l + "x" + m + " Matrix ")
  //console.log("B is an :" + m + "x" + n + " Matrix ")
  
  let C = []
  for(let i = 0; i < l; i++){
    C[i] = [];
    for(let j = 0; j < n; j++){
      C[i][j] = [];
    }
  }
  
  for(let row = 0; row < l ; row++){
    for(let col = 0; col < n; col++){
      let v = [];
      let w = [];
      for(let i = 0; i < m ; i++){
         v.push(A[row][i])
         w.push(B[i][col])
      }
      C[row][col] = dot(v,w)
    }
  }
  return C;
}

function dot(v, w){
  if(v.length != w.length) return "Error, vector lengths do not match"
  let sum = 0;
  for(i = 0; i < v.length; i++){
    sum += v[i] * w[i];
  }
  return sum;
}

