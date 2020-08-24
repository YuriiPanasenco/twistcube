

function changeMatrix(matrix, res){
    let reserv = [];

    for (let i = 0; i < res.length; i++) {
        reserv[i]=[];
        for (let j = 0; j < res[i].length; j++) {
            reserv[i][j] = res[i][j].mesh;
        }
    }

    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
            matrix[i][j].mesh = reserv[i][j];
        }
    }

}

export function rotateClockwise(matrix, change=false) {
    let res = [];
    for (let i in matrix) {
        for (let j in matrix[i]) {
            if (res[j] === undefined) {
                res[j] = [];
            }
            res[j][i] = matrix[matrix.length - i - 1][j];
        }
    }

    if(matrix.length===matrix[0].length && change) {
        changeMatrix(matrix, res);
    }

    return res;
}

export function rotateUnClockwise(matrix, change=false){
    let res = [];
    for ( let i in matrix ){
        for ( let j in matrix[i] ) {
            if(res[j] === undefined){
                res[j] = [];
            }
            res[j][i] = matrix[i][matrix[i].length - j - 1];
        }
    }

    if(matrix.length===matrix[0].length && change) {
        changeMatrix(matrix, res);
    }

    return res;
}
