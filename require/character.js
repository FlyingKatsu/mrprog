// ===============================================
// Factory Char properties (to copy or overwrite)
// ===============================================
var FactoryChar = function( _input ) {
  //return function( _input ) {
    let input = _input || {};
    //this.owner = input.owner || CLIENT.user;
    this.baseKey = input.baseKey || 1;
    this.variantKey = input.variantKey || 0;
    this.level = 0;
    this.xp = 0;
    this.mood = 1;
    this.numResets = 0;
    //this.custom = new Customization();
    // for property in extra, create this.prop
    //for( let e in extra ) { this[e] = extra[e]; } 
  //}
};


// ===============================================
// Factory Char methods (for prototypal inheritance)
// ===============================================
FactoryChar.prototype.getEmbed = function() {
  console.log('got embed');
};


// ===============================================
// Factory Partner properties (to copy or overwrite)
// ===============================================
var FactoryPartner = function( _input ) {
  let input = _input || {};
  this.propA = input.propA || "A";  
  // Extend FactoryChar
  let temp = new FactoryChar();
  for (t in temp) { 
    if ( temp.hasOwnProperty(t) ) this[t] = temp[t]; 
  }
};

// ===============================================
// Factory Partner methods (for prototypal inheritance)
// ===============================================
FactoryPartner.prototype.methodB = function() {
  console.log("method b");
};
// Extend FactoryChar.prototype
for (f in FactoryChar.prototype) { 
  if ( FactoryChar.prototype.hasOwnProperty(f) ) FactoryPartner.prototype[f] = FactoryChar.prototype[f]; 
}

// ===============================================
// Factory Char Instantiation (new instances)
// ===============================================
var CHARACTER = {
  
  // Partner Constructor
  Partner: FactoryPartner,
  
  // Enemy Constructor
  Enemy: FactoryEnemy
  
};

if (Object.freeze) Object.freeze(CHARACTER);
//module.exports = CHARACTER;