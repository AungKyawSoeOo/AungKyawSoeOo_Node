//promises
//sample 1
let result = new Promise((resolve, reject) => {
  let result = 1 + 5;
  if (result == 6) {
    resolve('Success');
  } else {
    reject('Failed')
  }
})
result.then((message) => {
  console.log(`This is in the then-- ${message}`);
}).catch((message) => {
  console.log(`This is in the catch-- ${message}`);
})

//sample 2
// Allow or not
let adult = false
let allow = false
function finished() {
  console.log("Promise function finished");
}
function permit() {
  return new Promise((resolve, reject) => {
    if (adult) {
      resolve("You are adult , Go..")
    } else if (allow) {
      resolve("You are allowed , Go..")
    } else {
      reject({
        name: 'Reject',
        message:'Sorry you are not allowed'
      });
    }
  })
}
permit().then((message) => {
  console.log(message);
}).catch((error) => {
  console.log(error.name + ":" + error.message);
}).finally(() => {
  finished();
})

//sample 3
//promise method chaining
function triangleAreaFirst(b,h) {
  return new Promise((resolve, reject) => {
    console.log("Get the base and height from db");
    setTimeout(() => {
      resolve({
        base: b,
        height: h
      });
    }, 1000);
  })
}
function triangleAreaSecond(para) {
  return new Promise((resolve, reject) => {
    console.log("Calculated circle area");
    setTimeout(() => {
      resolve(1 / 2 * (para.base * para.height));
    },3000)  
  })
}

triangleAreaFirst(3, 4).then(triangleAreaSecond)
  .then(console.log);

//promise.all
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("I am running first");
    resolve("Apple")
  }, 1000)
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("I am running second");
    resolve("Orange")
  }, 2000)
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("I am running third");
    resolve("Banana")
  }, 3000)
});
Promise.all([p1, p2, p3]).then((results) => {
  console.log(results);
})
// promise race and error handling remain


