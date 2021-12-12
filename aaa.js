
let cur = 1
let t = setInterval(()=>{
    console.log(cur.toString())
    if(++cur == 5){
        clearInterval(t)
        console.log("5s finsih")
    }
}, 1000)

let cur2 = 1
let t2 = setInterval(()=>{
    console.log(cur.toString())
    if(++cur2 == 10){
        clearInterval(t2)
        console.log("55sss finsih")
    }
}, 500)

console.log('HI')