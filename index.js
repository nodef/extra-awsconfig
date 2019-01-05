const ini = require('ini');
const fs = require('fs');


// Global variables.
const E = process.env;
const CONFIG = {
  computeChecksums: boolean(E['AWS_COMPUTECHECKSUMS']),
  convertResponseTypes: boolean(E['AWS_CONVERTRESPONSETYPES']),
  correctClockSkew: boolean(E['AWS_correctClockSkew']),
};


function options(o, k, a, i) {
  if(k==='--help') o.help = true;
  else if(k==='--computechecksums') o.computeChecksums = true;
  else if(k==='--convertresponsetypes') o.convertResponseTypes = true;
  else if(k==='--convertresponsetypes') o.convertResponseTypes = true;

};
