var NPC_Base = function() {
  this.name= "NPC";
  this.color= {
    normal: "#70C040",
    warning: "#DF6777",
    error: "#FAA61A"
  };
  this.img= {
    normal: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    warning: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    error: "https://cdn.pbrd.co/images/hXrbGDHil.png"
  };
  this.getEmbed= function( imgID, colorID, desc, foot, title, image ) {
    return {
      author: this.name,
      description: text,
      thumbnail: this.img[imgID],
      color: this.color[colorID],
      footer: foot,
      title: title,
      image: image
    };
  };
}();

var NPC_Construct = function( obj ) {
  if (obj.name) this.name = obj.name;
  if (obj.color) this.color = obj.color;
  if (obj.img) this.img = obj.img;
  this.prototype = NPC_Base;
};

var NPC = {
  
  guide: new NPC_Construct ( {
    name: "MR.PROG"
  } ),
  
  announcer: new NPC_Construct ( {
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
  } )
  
};

if (Object.freeze) Object.freeze(NPC);
module.exports = NPC;