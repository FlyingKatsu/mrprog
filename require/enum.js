var ENUM = {
  Moral: {
    lawfulgood: 1,
    lawfulneutral: 2,
    lawfulevil: 3,
    neutralgood: 4,
    trueneutral: 5,
    neutralevil: 6,
    chaoticgood: 7,
    chaoticneutral: 8,
    chaoticevil: 9,
    properties: {
      1: { 
            id: "lawfulgood", 
            name: "Lawful Good", 
            desc: "TBD",
            value: 1 
         },
      2: { 
            id: "lawfulneutral", 
            name: "Lawful Neutral", 
            desc: "TBD",
            value: 2 
         },
      3: { 
            id: "lawfulevil", 
            name: "Lawful Evil", 
            desc: "TBD",
            value: 3 
         },
      4: { 
            id: "neutralgood", 
            name: "Neutral Good", 
            desc: "TBD",
            value: 4 
         },
      5: { 
            id: "trueneutral", 
            name: "True Neutral", 
            desc: "TBD",
            value: 5 
         },
      6: { 
            id: "neutralevil", 
            name: "Neutral Evil", 
            desc: "TBD",
            value: 6 
         },
      7: { 
            id: "chaoticgood", 
            name: "Chaotic Good", 
            desc: "TBD",
            value: 7 
         },
      8: { 
            id: "chaoticneutral", 
            name: "Chaotic Neutral", 
            desc: "TBD",
            value: 8 
         },
      9: { 
            id: "chaoticevil", 
            name: "Chaotic Evil", 
            desc: "TBD",
            value: 9 
         }
    },
    getDetails: function() {
      let str = `Here is a list of all available moral alignments:\n\n`;
      for ( let p in this.properties ) {
        str += `**${this.properties[p].id}** :: ${this.properties[p].name}\n${this.properties[p].desc}\n\n`;
      }
      return str;
    } 
},

  Sit: {
    greeting: 1,
    feeling: 2,
    netalert: 3,
    herosuccess: 4,
    herofailure: 5,
    accepts: 6,
    declines: 7,
    wins: 8,
    loses: 9,
    battles: 10,
    cheats: 11,
    bails: 12,
    disobeys: 13,
    confused: 14,
    properties: {
      1: { id: "greeting", desc: "Greets Someone", value: 1 },
      2: { id: "feeling", desc: "Is Asked 'How are you?'", value: 2 },
      3: { id: "netalert", desc: "Jacks In during a NetAlert", value: 3 },
      4: { id: "herosuccess", desc: "Saves the day during a NetAlert", value: 4 },
      5: { id: "herofailure", desc: "Failed to save the day during a NetAlert", value: 5 },
      6: { id: "accepts", desc: "Accepts a challenge from someone (at NetOp's orders)", value: 6 },
      7: { id: "declines", desc: "Declines a challenge from someone (at NetOp's orders)", value: 7 },
      8: { id: "wins", desc: "Wins a battle", value: 8 },
      9: { id: "loses", desc: "Loses a battle", value: 9 },
      10: { id: "battles", desc: "Fights during a battle", value: 10 },
      11: { id: "cheats", desc: "Cheats during a battle", value: 11 },
      12: { id: "bails", desc: "Jacks Out during a battle", value: 12 },
      13: { id: "disobeys", desc: "Disobeys the NetOp's orders", value: 13 },
      14: { id: "confused", desc: "Confused by the NetOp's poorly typed command", value: 14 }
    },
    getDetails: function() {
      let str = `Here is a list of all current situation keywords for dialogue tables:\n\n`;
      for ( let p in this.properties ) {
        str += `**${this.properties[p].id}**\n${this.properties[p].desc}\n\n`;
      }
      return str;
    }
},

  Feeling: {
    happy: 1,
    content: 2,
    okay: 3,
    withdrawn: 4,
    upset: 5,
    properties: {
      1: { id: "happy", desc: "Smiling, so happy!", value: 1 },
      2: { id: "content", desc: "Satisfied with life", value: 2 },
      3: { id: "okay", desc: "Not feeling anything in particular", value: 3 },
      4: { id: "withdrawn", desc: "Not interested in talking", value: 4 },
      5: { id: "upset", desc: "Raging mad or terribly hurt", value: 5 }
    },
    getDetails: function() {
      let str = `Here is a list of all current feeling keywords for dialogue tables:\n\n`;
      for ( let p in this.properties ) {
        str += `**${this.properties[p].id}**\n${this.properties[p].desc}\n\n`;
      }
      return str;
    }
  },
  
  Personality: {
    default: 1,
    properties: {
      1: { 
        id: "default",
        desc: "Default dialogue lines for anyone",
        value: 1,
        modifiers: {
          greeting: { mod: 0.1, dialogue: { 
            happy: "Hello, @user!", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          }  },
          feeling: { mod: 0.1, dialogue: { 
            happy: "I'm doing great! How are you, @user?", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          netalert: { mod: null, dialogue: { 
            happy: "Let's do this, @owner!", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          herosuccess: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          herofailure: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          accepts: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          declines: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          wins: { mod: null, dialogue: { 
            happy: "Great teamwork, @owner!", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          loses: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          battles: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          cheats: { mod: null, dialogue: { 
            happy: "", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          bails: { mod: null, dialogue: { 
            happy: "Let's try again next time!", 
            content: "", 
            okay: "", 
            withdrawn: "", 
            upset: "" 
          } },
          confused: { mod: -0.25, dialogue: { 
            happy: "Hahaha, @User did you mess up again?", 
            content: "@User, I don't think that's what you meant to do", 
            okay: "@User, I don't understand...", 
            withdrawn: "...", 
            upset: "How stupid." 
          } },
          customized: { mod: -0.5, dialogue: { 
            happy: "@User, thanks for the upgrade!", 
            content: "@User, do you think this suits me better?", 
            okay: "@User, I don't know if this suits me, but okay.", 
            withdrawn: "Oh...", 
            upset: "HMPH" 
          } }
        }
      }
    },
    getDetails: function() {
      let str = `Here is a list of all dialogue-related personalities:\n\n`;
      for ( let p in this.properties ) {
        str += `**${this.properties[p].id}**\n${this.properties[p].desc}\n\n`;
      }
      return str;
    }
  },

  Command: {
    
    shutdown: 1,
    test: 2,
    clear: 3,
    
    help: 4,
    init: 5,
    list: 6,
    
    create: 7,
    rename: 8,
    recolor: 9,
    save: 10,
    load: 11,
    reset: 12,
    
    netalerts: 13,
    jack: 14,
    hey: 15,
    status: 16,
    
    properties: {
      1: {
        id: "shutdown",
        usage: "shutdown",
        cmd: "shutdown",
        value: 1,
        desc: "SHUTS DOWN THE BOT. Tread carefully.",
        perm: ["mod", "admin"],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      },
      2: {
        id: "test",
        usage: "test",
        cmd: "test",
        value: 2,
        desc: "Sends a test message via embed to the debug channel",
        perm: ["mod", "admin"],
        enableDM: true,
        channels: [ "debug" ]
      },
      3: {
        id: "clear",
        usage: "clear [number] (main|shop|battle|oc|debug)",
        cmd: "clear",
        value: 3,
        desc: "Delete last [number] of messages in the specified channel. If unspecified, defaults to deleting last 10 messages in current channel.\n2 < [number] < 200",
        perm: ["mod", "admin"],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      },

      4: {
        id: "help",
        usage: "help [channel]",
        cmd: "help",
        value: 4,
        desc: "Sends a DM listing all recognized bot commands permitted for the user in [channel]. If unspecified, this will list commands for all channels.",
        perm: [],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      },
      5: {
        id: "init",
        usage: "init [channel]",
        cmd: "init",
        value: 5,
        desc: `Sends an initial message to the specified [channel], describing what the channel is for and what commands can be used.  If [channel] is not specified, this will be done for all channels.`,
        perm: ["admin"],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      },
      6: {
        id: "info",
        usage: "info [option] [suboption]",
        cmd: "info",
        value: 6,
        desc: `Lists information about [option], filtered by [suboption].\nCurrently supports the following options:\n*presets* :: List all available preset categories\n*variants [preset]* :: List all available variants for the given [preset]`,
        perm: [],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },
      
      7: {
        id: "create",
        usage: "create [name] [preset] [variant]",
        cmd: "create",
        value: 7,
        desc: `Creates a character named [name] using the [variant] of [preset] and makes it your partner.\n[name] should be alphanumeric, kana, and/or kanji.\nAny required extension will be added automatically.\nUse * to use a default name.\n[variant] is optional, but [preset] is required if [variant] is supplied`,
        perm: [],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },
      8: {
        id: "rename",
        usage: "rename [name]",
        cmd: "rename",
        value: 8,
        desc: `Change your partner's name to [name].\n[name] should be alphanumeric, kana, and/or kanji.\nAny required extension will be added automatically.`,
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },
      9: {
        id: "recolor",
        usage: "recolor [hexcolor]",
        cmd: "recolor",
        value: 9,
        desc: `Change your partner's dialogue box color to [hexcolor]\n[hexcolor] is a hexadecimal color code such as #FF0000`,
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },
      10: {
        id: "save",
        usage: "save (dialogue|partition|folder)",
        cmd: "save",
        value: 10,
        desc: "Download a copy of the specified data file\nCurrently only supports the dialogue option.",
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
        },
      11: {
        id: "load",
        usage: "load (avatar|dialogue|partition|folder) [url]",
        cmd: "load",
        value: 11,
        desc: "Upload a copy of the specified data file.\nThe file can be an attachment, or you can supply the optional [url] to the file (good for iOS which doesn't have a normal filesystem)\nCurrently only supports the dialogue and avatar options.",
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
        },
      12: {
        id: "reset",
        usage: "reset",
        cmd: "reset",
        value: 12,
        desc: `Revert your character to factory settings. Not yet implemented.`,
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },

      13: {
        id: "netalerts",
        usage: "netalerts",
        cmd: "netalerts",
        value: 13,
        desc: "Check on the status of the Internet. Only partially implemented.",
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "oc", "debug" ]
      },
      14: {
        id: "jack",
        usage: "jack (in|out)",
        cmd: "jack",
        value: 14,
        desc: `Command your character to take part in a challenge (or bail)!\nNot yet implemented.`,
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "battle", "oc", "debug" ]
      },
      15: {
        id: "hey",
        usage: "hey",
        cmd: "hey",
        value: 15,
        desc: `Greet your character. Partially implemented.`,
        perm: ["partnered"],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      },        
      16: {
        id: "status",
        usage: "status",
        cmd: "status",
        value: 16,
        desc: "Get a DM with current information about your partner, such as level, xp, mood, currency, and battle stats",
        perm: [],
        enableDM: true,
        channels: [ "main", "battle", "shop", "oc", "debug" ]
      }        
  }
},

Preset: {
  normal: 1,
  generic: 2,
  official: 3,
  heel: 4,
  prog: 5,
  hertz: 6,
  cameo: 7,
  boss: 8,
  virus: 9,
  properties: {
      1: {
          id: "normal",
          name: "NormalNavi",
          value: 1,
          desc: "Robot-like Navis commonly used as NPCs.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/normal.png",
          variants: {
              default: {
                id: "default",
                custom: {
                  name: "NormNav1.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Default.png",
                  color: "#88C040",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              pink: {
                id: "pink",
                custom: {
                  name: "Navi-F.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Default2.png",
                  color: "#F7A8B0",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              army: {
                id: "army",
                custom: {
                  name: "Navi-W.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Default3.png",
                  color: "#AF6828",
                  capacity: "2",
                  alignment: "lawfulneutral",
                  personality: "default"
                }
              },
              grumpy: {
                id: "grumpy",
                custom: {
                  name: "NormNav4.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Grumpy.png",
                  color: "#D0402F",
                  capacity: "2",
                  alignment: "chaoticneutral",
                  personality: "default"
                }
              },
              ranked: {
                id: "ranked",
                custom: {
                  name: "RankedNorm.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Ranked.png",
                  color: "#4C434C",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              purple: {
                id: "purple",
                custom: {
                  name: "NormNav2.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Purple.png",
                  color: "#993090",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                } 
              },
              aqua: {
                id: "aqua",
                custom: {
                  name: "Navi-A.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Aqua.png",
                  color: "#016891",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              blue: {
                id: "blue",
                custom: {
                  name: "NormNav3.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Blue.png",
                  color: "#4E50A2",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              black: {
                id: "black",
                custom: {
                  name: "NormNavX.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/BlackRed.png",
                  color: "#000000",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              evil: {
                id: "evil",
                custom: {
                  name: "EvilNorm.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Norm/Evil.png",
                  color: "#9D1C4C",
                  capacity: "2",
                  alignment: "neutralevil",
                  personality: "default"
                }
              }
          }
      },
      2: {
          id: "generic",
          name: "GenericNavi",
          value: 2,
          desc: "Human-like Navis commonly used as NPCs.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/generic.png",
          variants: {
            egg: {
              id: "egg",
              custom: {
                name: "EggHead.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Egg.png",
                color: "#824BB0",
                capacity: "2",
                alignment: "trueneutral",
                personality: "default"
              }
            },
            chick: {
              id: "chick",
              custom: {
                name: "FemaleNavi.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Chick.png",
                color: "#F29231",
                capacity: "2",
                alignment: "trueneutral",
                personality: "default"
              }
            },
            female: {
              id: "female",
              custom: {
                name: "FemaleNavi.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Female.png",
                color: "#F9A91F",
                capacity: "2",
                alignment: "trueneutral",
                personality: "default"
              }
            },
            male: {
              id: "male",
              custom: {
                name: "MaleNavi.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Generic/Male.png",
                color: "#BF42A1",
                capacity: "2",
                alignment: "trueneutral",
                personality: "default"
              }
            }
          }
      },
      3: {
          id: "official",
          name: "OfficialNavi",
          value: 3,
          desc: "Authoritative Navis. Usually serve as NetPolice or announcers.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/official.png",
          variants: {
            default: {
              id: "default",
              custom: {
                name: "NetOffical.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetOfficial.png",
                color: "#E07828",
                capacity: "2",
                alignment: "lawfulgood",
                personality: "default"
              }
            },
            robocop: {
              id: "robocop",
              custom: {
                name: "NetPolice.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Official/NetPolice.png",
                color: "#C86818",
                capacity: "2",
                alignment: "lawfulgood",
                personality: "default"
              } 
            }
          }
      },
      4: {
          id: "heel",
          name: "HeelNavi",
          value: 4,
          desc: "They seem suspicious...",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/heel.png",
          variants: {
            default: {
              id: "default",
              custom: {
                name: "HeelNavi.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Heel/Heel.png",
                color: "#704080",
                capacity: "2",
                alignment: "chaoticneutral",
                personality: "default"
                }
            },
            mafia: {
              id: "mafia",
              custom: {
                name: "MafiaNavi.EXE",
                img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Heel/Mafia.png",
                color: "#585870",
                capacity: "2",
                alignment: "chaoticevil",
                personality: "default"
                }
            }
          }
      },
      5: {
          id: "prog",
          name: "Mr.Prog",
          value: 5,
          desc: "MMBN maintenance programs. Everybody's favorite worker bot ;)",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/empty.png",
          variants: {}
      },
      6: {
          id: "hertz",
          name: "Mr.Hertz",
          value: 6,
          desc: "Starforce replacements for Mr.Prog.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/empty.png",
          variants: {}
      },
      7: {
          id: "cameo",
          name: "Cameo Navis",
          value: 7,
          desc: "Fan favorite NetNavis.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/cameo.png",
          variants: {
              protoman: {
                id: "protoman",
                custom: {
                  name: "ProtoMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Protoman.png",
                  color: "#B00C1F",
                  capacity: "2",
                  alignment: "lawfulgood",
                  personality: "default"
                  }
              },
              roll: {
                id: "roll",
                custom: {
                  name: "Roll.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Roll.png",
                  color: "#EA5B82",
                  capacity: "2",
                  alignment: "neutralgood",
                personality: "default"
                }
              },
              searchman: {
                id: "searchman",
                custom: {
                  name: "SearchMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Searchman.png",
                  color: "#53733A",
                  capacity: "2",
                  alignment: "lawfulneutral",
                personality: "default"
                }
              },
              larkman: {
                id: "larkman",
                custom: {
                  name: "LarkMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Larkman.png",
                  color: "#3A73B7",
                  capacity: "2",
                  alignment: "chaoticneutral",
                personality: "default"
                }
              },
              otenko: {
                id: "otenko",
                custom: {
                  name: "Otenko.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Otenko.png",
                  color: "#EAB74B",
                  capacity: "2",
                  alignment: "lawfulgood",
                  personality: "default"
                }
              },
              toadman: {
                id: "toadman",
                custom: {
                  name: "ToadMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Toadman.png",
                  color: "#80CC70",
                  capacity: "2",
                  alignment: "neutralgood",
                  personality: "default"
                }
              },
              tomahawkman: {
                id: "tomahawkman",
                custom: {
                  name: "TomahawkMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Tomahawkman.png",
                  color: "#67C1E2",
                  capacity: "2",
                  alignment: "trueneutral",
                  personality: "default"
                }
              },
              gyroman: {
                id: "gyroman",
                custom: {
                  name: "GyroMan.EXE",
                  img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/Cameo/Gyroman.png",
                  color: "#EAA116",
                  capacity: "2",
                  alignment: "chaoticneutral",
                  personality: "default"
                } 
              }
          }
      },
      8: {
          id: "boss",
          name: "Boss Navis",
          value: 8,
          desc: "Opponent NetNavis for boss battles.",
          img: "http://flyingkatsu.com/dsc/BattleNetworkFK/avatars/empty.png",
          variants: {
          }
      },
      9: {
          id: "virus",
          name: "Virus",
          value: 9,
          desc: "Placeholder until Version 0.5.0 or so. Part of Virus Breeding add-on.",
          img: "avatars/empty.png",
          variants: {}
      }
  },

  hasBase: function(basekey) {
    return this.properties[this[basekey]];
  },
  hasVariant: function(basekey,variantkey) {
    if( this.hasBase(basekey) ) {
      return this.properties[this[basekey]].variants[variantkey];
    }
    return false;
  },
  getSummary: function(key) {
    let vlist = this.properties[key].variants;
    let output = `VariantKey ::: VariantName\n------------------------\n`;
    let count = 0;
    for ( let v in vlist ) {
      count++;
      output += `${vlist[v].id} ::: ${vlist[v].custom.name}\n`;
      if (count == 5) output += `------------------------\n`;
    }
    if (count == 0) output = `------------------------\nNone of these variants is available yet!\n`;
    output += `------------------------\n`;
    return output;
  },
  getDetails: function() {
    let str = `------------------------\n\n`;
    for ( let p in this.properties ) {
      let base = this.properties[p];
      if (Object.keys(base.variants).length > 0) {
        str += `**${base.name}** : ${base.desc}\n${btk}${btk}${btk}\nBaseType: ${base.id}\nVariants: `;
        let count = Object.keys(base.variants).length;
        for ( let vkey in base.variants ) {
          str += `${base.variants[vkey].id}`;
          if ( count-- != 1 ) str += " | ";
        }
        str += `${btk}${btk}${btk}\n\n`;
      }
    }
    return str;
  },
  getVariants: function(key) {
    let vlist = this.properties[key].variants;
    let count = 0;
    let output = [];
    for ( let v in vlist ) {
      if (vlist[v].custom) {
        count++;
        output.push(this.checkVariant( this.properties[key], vlist[v], { current: count, total:Object.keys(vlist).length } ) );
      }
    }
    return output;
  },
  checkVariant: function(b, v, count) {
    if ( v ) {
      return { 
        name: v.custom.name, 
        thumbnail: v.custom.img, 
        color: v.custom.color,
        description: `${formatCmd( "create NAME "+b.id.toUpperCase()+" "+v.id.toUpperCase() )}`,
        footer: `Variant ${count.current} out of ${count.total}`
      };
    } else { return null; }
  }
},

Challenge: {
  crisis: 1,
  virusbust: 2,
  bossbattle: 3,
  royale: 4,
  naviduel: 5,
  virusduel: 6,
  raid: 7,
  properties: {
      1: {
          id: "crisis",
          name: "Crisis",
          value: 1,
          desc: "A problem posed by a NetAlert; can include VirusBust, BossBattle, Royale, and Raid.",
          img: "icons/crisis.png"
      },
      2: {
          id: "virusbust",
          name: "VirusBust",
          value: 2,
          desc: "Random encounter against viruses (Navi+EquipVirus allowed).",
          img: "icons/virusbust.png"
      },
      3: {
          id: "bossbattle",
          name: "BossBattle",
          value: 3,
          desc: "Triggered event for 1 player vs COM. Three rounds of VirusBust and one final Navi duel.",
          img: "icons/bossbattle.png"
      },
      4: {
          id: "royale",
          name: "Royale",
          value: 4,
          desc: "PvP match simulated between three+ players’ elected Navi.",
          img: "icons/royale.png"
      },
      5: {
          id: "naviduel",
          name: "NaviDuel",
          value: 5,
          desc: "PvP match simulated between two players’ elected Navi.",
          img: "icons/naviduel.png"
      },
      6: {
          id: "virusduel",
          name: "VirusDuel",
          value: 6,
          desc: "PvP match simulated between two players’ elected farm Virus.",
          img: "icons/virusduel.png"
      },
      7: {
          id: "raid",
          name: "Raid",
          value: 7,
          desc: "A battle royale against a common enemy. Take him down with the help of others before the time limit ends.",
          img: "icons/raid.png"
      }
    },
    getDetails: function() {
      let str = `Here is a list of all planned battle modes:\n\n`;
      for ( let p in this.properties ) {
        str += `**${this.properties[p].name}**\n${this.properties[p].desc}\n\n`;
      }
      return str;
    }
  },

};

if (Object.freeze) Object.freeze(ENUM);
module.exports = ENUM;