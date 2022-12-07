//Default parameters
function multiply(a = 5, b = 20) {
  return a * b;
}
let multi1 = multiply();
let multi2 = multiply(5, 2);
console.log("Multi1= " + multi1);
console.log("Multi2= " + multi2);

//Template literals
var age = 10;
var names = "John Doe";
age = 20;
console.log(`Hello I'm ${names} and I'm ${age} years old`);
//Array destructuring
let apple, orange, other;
[apple, orange, mango] = [500, 200, 300]
console.log(apple);
console.log(orange);
console.log(mango)

//Array destructuring with spread
let num1, num2, remain;
[num1, num2, ...remain] = [1, 2, 5, 7, 8, 9]
console.log(num1);
console.log(num2);
console.log("Remain " + remain);

//object destructuring
let car = {
  color: "red",
  model: "Honda",  
}
let { color, model } = car;
console.log(`Color is ${color}`);
console.log(`Model is ${model}`);


// For ... of
let fruits = ["apple", "orange", "mango", "banana", "papaya"];
for (const fruit of fruits) {
  console.log(fruit);
}

//Class with getter and setter
class Animal{
  constructor(name,color) {
    this.name = name;
    this.color = color;
  }
  get name() {
    return this._name;
  }
  get color() {
    return this._color;
  }
  set name(newName) {
    newName = newName.trim();
    if (newName === '') {
        throw 'The name cannot be empty';
    }
    this._name = newName;
  }
  set color(newColor) {
    newColor = newColor.trim();
    if (newColor === '') {
        throw 'The color cannot be empty';
    }
    this._color = newColor;
}
}
let cat = new Animal("Jinga", "White and Brown");
console.log(cat.name);
console.log(cat.color);

//Inheritance
class Person{
  constructor(sleep) {
    this.sleep = sleep;
  }
  sleep() {
    console.log(`I sleep about ${this.sleep} hours.`)
  }
}
class Footballer extends Person{
  constructor(sleep, play) {
    super(sleep);
    this.play = play;
  }
  play() {
    console.log(`I play about ${this.play} hours a day`);
  }
}
let player1 = new Footballer(8, 4);
console.log(`I sleep for ${player1.sleep} hours`);
console.log(`I play for ${player1.play} hours`);

//Arrow function
let add = (a, b) => {
  return a + b;
}
let addResult = add(20, 50);
console.log(`Add result is ${addResult}`);

const PI = 3.14;
let circleArea = r => PI * r * r;
let area = circleArea(5);
console.log(`Area of circle is ${area}`);

//Symbol and iterator
const symbol = Symbol('description');
console.log(symbol);
var numbers = [1, 2, 3, 4, 5];
var iterator = numbers[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

for (let i = 0; i < 5; i++){
  console.log(i)
}

let nums = ['one', 'two', 'three', 'four', 'five'];
for (num of nums) {
  console.log(`Number is ${num}`);
}

//generator and yield
function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generator();

console.log(gen.next().value);
console.log(gen.next().value); 
console.log(gen.next().value);