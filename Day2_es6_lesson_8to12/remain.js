// Sets ..................
let fruits = new Set(['apple', 'orange', 'apple', 'banana', 'papaya']);
//add to set
fruits.add("mango").add("lemon").add("blah");
if (fruits.has('apple')) {
  console.log("Apple exist");
} else {
  console.log("Apple doesn't exist");
}
// delete from set
fruits.delete('blah');
console.log(fruits);

let mm = new Set([
  'f', 'e', 't', 'r'
]);
// delete all elements from set
mm.clear();
console.log(mm);

//looping
for (let fruit of fruits) {
  console.log(`${fruit} is a fruit`);
}

//key and values in set is identical
for (let [key, value] of fruits.entries()) {
  console.log(key === value);
}

//Invoking callback in set
let nums = [1, 2, 3, 4, 5, 6, 7, 8]
nums.forEach(num =>
console.log(`Square of ${num} is ${(num*num)}`));

//WeakSet
let grade10 = { type: 'classroom' };
let student = { type: 'student' };
let checkStudent = new WeakSet([grade10, student]);
if (checkStudent.has(student)) {
  console.log('Student exist in classroom');
}

//Map
let cat = { name: "Browny", age: 3 },
    dog = { name: "Blacky", age: 5 },
  horse = { name: "Lovely", age: 8 }
    blah={name:"unknow",age:6}
    
let animals = new Map([
  [cat, 'cheer'],
  [dog, 'house watching'],
  [horse, 'travel'],
  [blah,'blah']
]);
animals.delete(blah);
for (const animal of animals.keys()) {
  console.log(`I am ${animal.name} and ${animal.age} years old`);
}
for (const duty of animals.values()) {
  console.log(`My duty is to ${duty}`);
}
for (let [animal, duty] of animals.entries()) {
  console.log(`I am ${animal.name} and my duty is to ${duty}`)
}

//Array extensions
//of
let colors = Array.of('Red', 'Green', 'Blue', 'Yellow', 'Brown');
for (color of colors) {
  console.log(color);
}
console.log(colors.length);

let characters = Array.from("abcdefgh");
console.log(characters);

//from
let doubleArray = [1, 2, 3, 4, 5, 6]
let doubled = Array.from(doubleArray, (x) => (x * 2));
console.log(doubled);

//find
let numbers = Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9);
console.log("Two "+numbers.find(num => num % 2 == 0));

//findIndex
let index = numbers.findIndex(num => num === 6);
console.log(index);

//Object.assign
let book = {
  width: 10,
  height: 2
}
let box = {
  volume: 30
}
let bookBox = Object.assign({}, book, box);
console.log(bookBox);
console.log(`Volume ${bookBox.volume}`);
//Object.is
console.log(+0 === -0);
console.log(Object.is(+0, -0));


//String extensions
const welcome = "Welcome from Myanmar , a beautiful country";
console.log(welcome.startsWith("Welcome"));
console.log(welcome.startsWith("from", 8));
console.log(welcome.endsWith("country"));
console.log(welcome.includes("a"));