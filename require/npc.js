var NPC_Base = {
  name: "NPC",
  color: {
    normal: "#70C040",
    warning: "#DF6777",
    error: "#FAA61A"
  },
  img: {
    normal: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    warning: "https://cdn.pbrd.co/images/hXrbGDHil.png",
    error: "https://cdn.pbrd.co/images/hXrbGDHil.png"
  },
  getEmbed: function( imgID, colorID, desc, foot, title, image ) {
    return {
      author: this.name,
      description: text,
      thumbnail: this.img[imgID],
      color: this.color[colorID],
      footer: foot,
      title: title,
      image: image
    };
  }
};

var NPC = {
  
  guide: {
    name: "MR.PROG",
    protoype: NPC_Base
  },
  
  announcer: {
    name: "NetOfficial",
    color = {
      normal: "#609088",
      warning: "#E07828",
      error: "#E89018"
    },
    img = {
      normal: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetOfficial.png",
      warning: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetOfficial.png",
      error: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetPolice.png"
    },
    protoype: NPC_Base
  }
  
};

if (Object.freeze) Object.freeze(NPC);
module.exports = NPC;