var CUSTOM = {
  Customization: function( input ) {
    var input = input || {};
    this.name = input.name || null;
    this.img = input.img || null;
    this.color = input.color || null;
    this.capacity = input.capacity || null;
    this.alignment = input.alignment || null;
    this.personality = input.personality || null;
    this.modifiers = input.modifiers || new Modifiers();
  },

  Modifiers: function( input ) {
    var input = input || {};
    this.greeting = input.greeting || { mod: null, dialogue: new Dialogue() };
    this.feeling = input.feeling || { mod: null, dialogue: new Dialogue() };
    this.netalert = input.netalert || { mod: null, dialogue: new Dialogue() };
    this.herosuccess = input.herosuccess || { mod: null, dialogue: new Dialogue() };
    this.herofailure = input.herofailure || { mod: null, dialogue: new Dialogue() };
    this.accepts = input.accepts || { mod: null, dialogue: new Dialogue() };
    this.declines = input.declines || { mod: null, dialogue: new Dialogue() };
    this.wins = input.wins || { mod: null, dialogue: new Dialogue() };
    this.loses = input.loses || { mod: null, dialogue: new Dialogue() };
    this.battles = input.battles || { mod: null, dialogue: new Dialogue() };
    this.cheats = input.cheats || { mod: null, dialogue: new Dialogue() };
    this.bails = input.bails || { mod: null, dialogue: new Dialogue() };
    this.confused = input.confused || { mod: null, dialogue: new Dialogue() };
  },

  Dialogue: function( input ) {
    var input = input || {};
    this.happy = input.happy || null;
    this.content = input.content || null;
    this.okay = input.okay || null;
    this.withdrawn = input.withdrawn || null;
    this.upset = input.upset || null;
  }
};

if (Object.freeze) Object.freeze(CUSTOM);
module.exports = CUSTOM;