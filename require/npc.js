// ===============================================
// Factory NPC properties (to copy or overwrite)
// ===============================================
var FactoryNPC = function( input ) {
  this.name = input.name || "NPC";
  this.color = input.color || {
    normal: "#70C040",
    warning: "#DF6777",
    error: "#FAA61A"
  };
  this.img = input.img || {
    normal: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    warning: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    error: "https://cdn.pbrd.co/images/hXrbGDHil.png"
  };
};


// ===============================================
// Factory NPC methods (for prototypal inheritance)
// ===============================================
FactoryNPC.prototype.getEmbed = function( imgID, colorID, text, foot, title, image ) {
  return {
    author: this.name,
    desc: text,
    thumb: this.img[imgID],
    color: this.color[colorID],
    foot: foot,
    title: title,
    imgurl: image
  };
};


// ===============================================
// Factory NPC Instantiation (new instances)
// ===============================================

// Object to export to Node.JS app
var NPC = {
  
  // Main responder for the bot
  guide: new FactoryNPC ( {
    name: "MR.PROG"
  } ),
  
  // Battle responder for the bot
  announcer: new FactoryNPC ( {
    name: "NetOfficial",
    color: {
      normal: "#609088",
      warning: "#E07828",
      error: "#E89018"
    },
    img: {
      normal: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetOfficial.png",
      warning: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetOfficial.png",
      error: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetPolice.png"
    }
  } ),
  
  // Shop responder for the bot
  dealer: new FactoryNPC ( {
    name: "NetDealer",
    color: {
      normal: "#7840A8",
      warning: "#DF6777",
      error: "#FAA61A"
    },
    img: {
      normal: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Egg.png",
      warning: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Egg.png",
      error: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Egg.png"
    }
  } )
  
};

if (Object.freeze) Object.freeze(NPC);
module.exports = NPC;