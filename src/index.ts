import day1puzzle1 from "./day-1/puzzle-1.js";
import day1puzzle2 from "./day-1/puzzle-2.js";
import day2puzzle1 from "./day-2/puzzle-1.js";
import day2puzzle2 from "./day-2/puzzle-2.js";
import day3puzzle1 from "./day-3/puzzle-1.js";
import day3puzzle2 from "./day-3/puzzle-2.js";
import day4puzzle1 from "./day-4/puzzle-1.js";
import day4puzzle2 from "./day-4/puzzle-2.js";
import day5puzzle1 from "./day-5/puzzle-1.js";
import day5puzzle2 from "./day-5/puzzle-2.js";

const solve = async () => {
  console.time("Total solve time");
  await day1puzzle1();
  await day1puzzle2();
  await day2puzzle1();
  await day2puzzle2();
  await day3puzzle1();
  await day3puzzle2();
  await day4puzzle1();
  await day4puzzle2();
  await day5puzzle1();
  await day5puzzle2();
  console.timeEnd("Total solve time");
};

solve();
