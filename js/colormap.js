const fs = require('fs');

let colormap = require('colormap')

let colors = colormap({
    colormap: 'density',
    nshades: 256,
    format: 'float',
    alpha: 1
})

const input = colors;

// create a new array where the elements at index 2 have been removed from each sub-array
const output = input.map((subarray) => subarray.filter((x, i) => i !== 3));

// create a new array of vec3 objects
const vec3s = output.map((subarray) => `vec3(${subarray})`);

// print the resulting array to the console
console.dir(vec3s, {'maxArrayLength': null}); // outputs ["vec3(1, 2, 3)", "vec3(4, 5, 6)", "vec3(7, 8, 9)"]
