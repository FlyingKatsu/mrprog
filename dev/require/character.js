const CUSTOM = require("./custom.js");
const ENUM = require("./enum.js");
const CONFIG = require("./config/server.js");

const LevelTiers = {
  scale: [ 100, 200, 350, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000 ],
  getTier: function(lvl) {
    return this.scale[lvl];
  }
};


// ===============================================
// Factory Char properties (to copy or overwrite)
// ===============================================
var FactoryChar = function( _input ) {
    let input = _input || {};
    this.owner = input.owner || null;
    this.presetKey = ENUM.Preset[input.preset] || 1;
    this.variantKey = input.variant || Object.keys(ENUM.Preset.properties[presetKey].variants)[0];
    this.level = input.level || 0;
};
// ===============================================
// Factory Char methods (for prototypal inheritance)
// ===============================================
FactoryChar.prototype.getVariant = function() {
  return ENUM.Preset.properties[this.presetKey].variants[this.variantKey];
};
FactoryChar.prototype.updateXP = function( delta ) {
  this.xp += delta;
  if ( this.xp > LevelTiers.getTier(this.level) ) {
    this.level++;
    this.xp = 0;
  }
};


// ===============================================
// SUB CLASSES of FactoryChar
// ===============================================

// ============ PARTNER =============
var FactoryPartner = function( _input ) {
  let input = _input || {};
  // Own Properties
  this.xp = 0;
  this.mood = 1.00;
  this.numResets = 0;
  this.zenny = 0;
  this.bugfrag = 0;
  this.custom = new CUSTOM.Customization( { name: input.name } );  
  // Extend FactoryChar
  let temp = new FactoryChar( input );
  for (t in temp) { 
    if ( temp.hasOwnProperty(t) ) this[t] = temp[t]; 
  }
};
// Inherited methods for FactoryPartner
FactoryPartner.prototype.reset = function() {
  this.numResets++;
  this.custom = new CUSTOM.Customization();
};
FactoryPartner.prototype.applyMod = function( num ) {
  this.mood -= num;
  if ( this.mood > 5.00 ) this.mood = 5.00; //Angriest
  if ( this.mood < 1.00 ) this.mood = 1.00; //Happiest
};

// PARTNER GETTERS
FactoryPartner.prototype.getEmbed = function( author, useOC, sit, foot ) {
  let feeling = ENUM.Feeling.properties[parseInt(this.mood)];
  let dialogue = CUSTOM.replaceTextVar( 
      this.owner, author, this.getDialogue( sit, feeling.id ) );
  this.applyMod(this.getModifier(sit));
  return {
    title: `${this.getName()} 「${feeling.name}」`,
    thumb: this.getImg( useOC ),
    color: this.getColor(),
    desc: dialogue,
    foot: foot || `Level ${this.level} | XP: ${this.xp}/${LevelTiers.getTier(this.level)} | Zenny: ${this.zenny} | BugFrag: ${this.bugfrag}`
  }
};
FactoryPartner.prototype.getStats = function( useOC ) {
  let feeling = ENUM.Feeling.properties[parseInt(this.mood)];
  return {
    title: `${this.getName()} 「${feeling.name}」`,
    thumb: this.getImg( useOC ),
    color: this.getColor(),
    desc: "\r\nMy Stats!\r\n" + this.getBattleStats(),
    foot: `Level ${this.level} | XP: ${this.xp}/${LevelTiers.getTier(this.level)} | Zenny: ${this.zenny} | BugFrag: ${this.bugfrag}`
  }
};
FactoryPartner.prototype.getBattleStats = function() {
    // TODO: put this in constructor for partner and custom data
    let hp = 100;
    let boost = {
      hp: 0,
      basic: "Buster",
      charge: 0,
      atk: 0,
      def: 0,
      spd: 0,
      folder: "None",
      weak: "None"
    };
    let preset = {
      hp: 100,
      basic: "Buster",
      charge: 1,
      atk: 1,
      def: 1,
      spd: 1,
      folder: "None",
      weak: "None"
    };
    /*let hist = {
        crisis: {
          accept: 0,
          bail: 0,
          win: 0,
          assist: 0,
          lose: 0
        },
        virus: {
          accept: 0,
          bail: 0,
          win: 0,
          assist: 0,
          lose: 0,
          deleted: {
            bunny: 0,
            met: 0,
            spikey: 0,
            can: 0,
            swordy: 0
          }
        },
        boss: {
          accept: 0,
          bail: 0,
          win: 0,
          assist: 0,
          lose: 0,
          deleted: {
            bass: 0,
            darkmega: 0
          }
        },
        naviduel: {
          accept: 0,
          bail: 0,
          started: 0,
          requested: 0,
          win: 0,
          assist: 0,
          cheat: 0,
          lose: 0
        },
        virusduel: {
          accept: 0,
          bail: 0,
          started: 0,
          requested: 0,
          win: 0,
          assist: 0,
          cheat: 0,
          lose: 0
        },
        royale: {
          accept: 0,
          bail: 0,
          started: 0,
          requested: 0,
          win: 0,
          assist: 0,
          lose: 0
        },
        raid: {
          accept: 0,
          bail: 0,
          win: 0,
          assist: 0,
          lose: 0
        }
      };*/
    output =  "\r\n```\r\n";
    output +=  `HP            ${hp} / ${preset.hp + boost.hp}\r\n`;
    output +=  `ATK           ${preset.atk}  (+${boost.atk})\r\n`;
    output +=  `DEF           x${preset.def} (+${boost.def})\r\n`;
    output +=  `SPD           x${preset.spd} (+${boost.spd})\r\n`;
    output +=  "```\r\n```\r\n";
    output +=  `Basic         ${boost.basic}\r\n`;
    output +=  `Charge        x${preset.charge} (+${boost.charge})\r\n`;
    output +=  "```\r\n```\r\n";
    output +=  `Weakness      ${preset.weak}\r\n`;
    output +=  "```\r\n```\r\n";
    output +=  `Total RAM     4MB\r\n`;
    output +=  `Total Drive   500MB\r\n`;
    output +=  `ChipFolder    0 / 250MB\r\n`;
    output +=  `SubFolder     0 / 50MB\r\n`;
    output +=  `NaviCust      0 / 50MB\r\n`;
    output +=  `Virus Farm    0 / 150MB\r\n`;
    output +=  "```\r\n";
    return output;
};
FactoryPartner.prototype.getName = function() {
  let output = this.custom.name || this.getVariant().custom.name;
  if (CONFIG.enforceSuffix) {
    if (output.substr(-CONFIG.suffix.length).toUpperCase() === CONFIG.suffix.toUpperCase()) {
      output = output.substr(0, output.length - CONFIG.suffix.length);
    }
    output += CONFIG.suffix;
  }
  return output;
  };
FactoryPartner.prototype.getImg = function( useOC ) {
    if ( useOC && this.custom.img ) {
      return this.custom.img;
    } else {
      return this.getVariant().custom.img;
    }
  };
FactoryPartner.prototype.getColor = function() {
    return this.custom.color || this.getVariant().custom.color;
  };
FactoryPartner.prototype.getCapacity = function() {
    return this.custom.capacity || this.getVariant().custom.capacity;
  };
FactoryPartner.prototype.getAlignment = function() {
    return this.custom.alignment || this.getVariant().custom.alignment;
  };
FactoryPartner.prototype.getPersonality = function() {
    return this.custom.personality || this.getVariant().custom.personality;
  };
FactoryPartner.prototype.getModifierSet = function() {
    return this.custom.modifiers || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].modifiers;
  };
FactoryPartner.prototype.getModifier = function( sit ) {
    return this.custom.modifiers[sit].mod || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].modifiers[sit].mod;
  };
FactoryPartner.prototype.getDialogue = function( sit, feeling ) {
    return this.custom.modifiers[sit].dialogue[feeling] || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].modifiers[sit].dialogue[feeling];
  };
FactoryPartner.prototype.getPhrases = function() {
    return this.custom.phrases || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].phrases;
  };
FactoryPartner.prototype.getSitFromPhrase = function (input) {
  let phraseArray = this.getPhrases();
  for ( let p = 0; p < phraseArray.length; p++ ) {    
    let stream = phraseArray[p].phrase.split(/[ ,]+/);
    
    let s = 0;
    let i = 0;    
    //console.log (stream.length);
    //console.log (input.length);
    while (s <= stream.length && i < input.length) {
      if (input[i].includes("@"+this.getName().toLowerCase())) {
        // ignore and proceed to check next i with current s
        i++;
      } else if (stream[s] === "*") {
        // anything goes, so continue to next pair
        //console.log("anything goes!");
        s++;
        i++;
      } else if (stream[s].includes("|")) {
        let substream = stream[s].split("|");
        let matched = false;
        for (w in substream) {
          //console.log(substream[w]);
          if (substream[w].includes("_")) {
            if (substream[w] === input[i]+"_"+input[i+1]) {
              matched = true;
              i++;
            }
          } else if (substream[w] === input[i]) matched = true;
        }
        if (matched) {
          // found a match, so continue to next pair
          //console.log("| Match!");
          s++;
          i++;
        } else {
          // No match, so exit to next p in phrases
          //console.log("No match checking | !");
          break;
        }
      } else if (stream[s] !== input[i]) {
        // No match, so exit to next p in phrases
        //console.log("No match this time!");
        break;
      } else {
        // stream[s] must match input[i] so increment both
        //console.log("Assumed Match!");
        s++;
        i++;
      }
      //console.log(s + ", " + i);
      if (s === stream.length) {
        // we matched the whole stream, so let's output the matching sit
        //console.log("quit all loops we found it!");
        return phraseArray[p].sit;
      } else {
        //console.log("keep searching yo");
      }
    }
  }
  // None of the phrases matched, so pretend to acknowledge user
  return "fakenod";
};
// PARTNER SETTERS
FactoryPartner.prototype.setName = function( v ) {
    this.custom.name = v;
  };
FactoryPartner.prototype.setPreset = function( v ) {
    this.custom.preset = v;
  };
FactoryPartner.prototype.setImg = function( v ) {
    this.custom.img = v;
  };
FactoryPartner.prototype.setColor = function( v ) {
    this.custom.color = v;
  };
FactoryPartner.prototype.setCapacity = function( v ) {
    this.custom.capacity = v;
  };
FactoryPartner.prototype.setAlignment = function( v ) {
    this.custom.alignment = v;
  };
FactoryPartner.prototype.setPersonality = function( v ) {
    this.custom.personality = v;
  };
FactoryPartner.prototype.setModifier = function( sit, mod ) {
    this.custom.modifiers[sit].mod = mod;
  };
FactoryPartner.prototype.setDialogue = function( sit, feeling, text ) {
    this.custom.modifiers[sit].dialogue[feeling] = text;
  };
FactoryPartner.prototype.setPhrases = function( v ) {
    this.custom.phrases = v;
  };
// Extend FactoryChar.prototype
for (f in FactoryChar.prototype) { 
  if ( FactoryChar.prototype.hasOwnProperty(f) ) FactoryPartner.prototype[f] = FactoryChar.prototype[f]; 
}

// ============= BOSS =============
var FactoryBoss = function( _input ) {
  let input = _input || {};
  // Own Properties
  this.propA = input.propA || "A";
  // Defaults
  input.preset = "boss";
  input.owner = null;  
  // Extend FactoryChar
  let temp = new FactoryChar( input );
  for (t in temp) { 
    if ( temp.hasOwnProperty(t) ) this[t] = temp[t]; 
  }
};
// Inherited methods for FactoryBoss
FactoryBoss.prototype.getEmbed = function( text, foot ) {
  console.log("Boss Embed");
  return {
    author: this.getVariant().custom.name,
    thumb: this.getVariant().custom.img,
    color: this.getVariant().custom.color,
    desc: text,
    foot: foot
  }
};

// ============= MINION =============
var FactoryMinion = function( _input ) {
  let input = _input || {};
  // Own Properties
  this.xp = 0;
  this.mood = 1;
  // Defaults
  input.preset = "virus";  
  // Extend FactoryChar
  let temp = new FactoryChar( input );
  for (t in temp) { 
    if ( temp.hasOwnProperty(t) ) this[t] = temp[t]; 
  }
};
// Inherited methods for FactoryMinion
FactoryMinion.prototype.getEmbed = function( text, foot ) {
  console.log("Minion Embed");
  return {
    author: this.getVariant().custom.name,
    thumb: this.getVariant().custom.img,
    color: this.getVariant().custom.color,
    desc: text,
    foot: foot
  }
};


// ===============================================
// Factory Char Instantiation (new instances)
// ===============================================
var CHARACTER = {
  
  // Constructors
  Partner: FactoryPartner,
  Boss: FactoryBoss,
  Minion: FactoryMinion
  
};


if (Object.freeze) Object.freeze(CHARACTER);
module.exports = CHARACTER;