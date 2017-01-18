// TODO: Program Advance map (PA is just a factory move unlocked with a combo)
// TODO: ENUM.Element, ENUM.ChipClass, ENUM.RarityClass

var FactoryMove = function( _input ) {
  let input = _input || {};
  this.name = input.name || "";
  this.desc = input.desc || "";
  this.dmg = input.dmg || 0;
  this.target = input.target || "";
  this.range = input.range || ;
  this.element = input.element || "default";
};


// A subclass of FactoryMove
var FactoryChip = function( _input ) {
  let input = _input || {};
  this.code = input.code || "";
  this.weight = input.weight || ""; // Cost of user's RAM
  this.class = input.class || ""; // Standard, Mega, Giga, Dark (has its own storage cost)
  this.rarity = input.rarity || 0; // 0, 1, 2, 3, 4, 5
  
  let temp = new FactoryMove( input );
  for (t in temp) { 
    if ( temp.hasOwnProperty(t) ) this[t] = temp[t];
  }
};





var BATTLE = {
  // Constructors for different move-related objects
  BattleChip: FactoryChip,
  BasicAtk: FactoryMove,
  BossAtk: FactoryMove,
  MinionAtk: FactoryMove
  
};

if (Object.freeze) Object.freeze(BATTLE);
module.exports = BATTLE;