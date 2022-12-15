const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.write("<h3>Go to /api/add/[num1]/[num2] to Add<h3>");
    res.write("<h3>Go to /api/sub/[num1]/[num2] to Subtract<h3>");
    res.write("<h3>Go to /api/mul/[num1]/[num2] to Multiply<h3>");
    res.write("<h3>Go to /api/div/[num1]/[num2] to Divide<h3>");
    res.write("<h3>Go to /api/mod/[num1]/[num2] to get modulus<h3>");
    res.write("<h3>Go to /api/area/[radius] to get Area of the circle<h3>");
    res.write("<h3>Go to /api/cm/[feet]/[inches] to convert feet+inches to centimeter<h3>");
    res.send();
})
router.get("/api/add/:num1/:num2", (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const add = num1 + num2;
    res.send(`<h3>Add result is ${add}<h3>`);
});
router.get("/api/sub/:num1/:num2", (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const sub = num1 - num2;
    res.send(`<h3>Subtract result is ${sub}<h3>`);
});
router.get("/api/mul/:num1/:num2", (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const mul = num1 * num2;
    res.send(`<h3>Multiply result is ${mul}<h3>`);
});
router.get("/api/div/:num1/:num2", (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const div = num1 / num2;
    res.send(`<h3>Divide result is ${div}<h3>`);
});
router.get("/api/mod/:num1/:num2", (req, res) => {
    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);
    const mod = num1 % num2;
    res.send(`<h3>Modulo result is ${mod}<h3>`);
});
router.get("/api/area/:radius", (req, res) => {
    const radius = Number(req.params.radius);
    const areaOfCircle = (Math.PI * Math.pow(radius, 2)).toFixed(2);
    res.send(`<h3>Area of circle is ${areaOfCircle}<h3>`);
});
router.get("/api/cm/:feet/:inches", (req, res) => {
    const feet = Number(req.params.feet);
    const inches = Number(req.params.inches);
    const feetToCm = feet * 30.48;
    const inchesToCm = inches * 2.54;
    const final = feetToCm + inchesToCm;
    res.send(`<h3>${feet} feet ${inches} inches is equal to ${final} centimeters.<h3>`);
});
module.exports = router;