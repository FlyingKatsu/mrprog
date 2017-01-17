const SECRET = require("./require/conf.json");
const CONFIG = require("./require/config.js");
const NPC = require("./require/npc.js");
const CUSTOM = require("./require/custom.js");
const ENUM = require("./require/enum.js");

const JSONFILE = require('jsonfile');
const REQUEST = require('request');
//const URL = require('url');
const DISCORD = require('discord.js');
const CLIENT = new DISCORD.Client();

const SERVER = {
  guild: null,
  roles: {
    any: null,
    partnered: null,
    mod: null,
    admin: null
  },
  channels: {
    main: null,
    info: null,
    battle: null,
    shop: null,
    oc: null,
    debug: null
  },
  isValid: true
};


// =========================================================
//  STATE VARIABLES
// =========================================================
var allPartners = new Map();
var disconnected = false;

// =========================================================
//  UTILITY FUNCTIONS
// =========================================================
var FORMAT = {
  inline: function( text, prefix ) {
    let btk = "`";
    let pfx = prefix || "";
    return `${btk}${pfx}${text}${btk}`;
  },
  
  code: function( text, prefix ) {
    let btk3 = "```";
    let pfx = prefix || "";
    return `${btk3}\n${pfx}${text}\n${btk3}`;
  },
  
  mention: function( user ) {
      return `<@${user.username}#${user.discriminator}>`;
  },
  
  injectVar: function( owner, user, text ) {
    return text.replace(/@Owner/ig, owner.toString())
      .replace(/@User/ig, user.toString());
  },
  
  embed: function( input ) {
    let output = new DISCORD.RichEmbed();
    if( input.author ) output.setAuthor( input.author );
    if( input.title ) output.setTitle( input.title );
    if( input.desc ) output.setDescription( input.desc );
    if( input.thumb ) output.setThumbnail( input.thumb );
    if( input.imgurl ) output.setImage( input.imgurl );
    if( input.color ) output.setColor( input.color );
    if( input.foot ) output.setFooter( input.foot );
    return output;
  }
};
if (Object.freeze) Object.freeze(FORMAT);

var UTIL = {
  setServer: function( channels ) {
    
    let tempMain = channels.main;
    
    // Set MAIN to DEBUG if MAIN is NULL
    if ( !channels.main ) {
      if ( channels.debug ) {
        tempMain = channels.debug;
        console.log("UTIL:: Channel DEBUG will be used because MAIN is null");
      } else {
        console.log("UTIL:: You must specify a DEBUG or MAIN channel ID!");
        SERVER.isValid = false;
      }
    }
    
    // Get the guild object for the server
    SERVER.guild = CLIENT.guilds.get( CONFIG.guildID );
    
    if ( SERVER.guild ) {      
      // Connect SERVER to actual channel objects
      // redirecting any null channel IDs to MAIN
      SERVER.channels.main = SERVER.guild.channels.get( tempMain );
      SERVER.channels.info = SERVER.guild.channels.get( channels.info || tempMain );
      SERVER.channels.battle = SERVER.guild.channels.get( channels.battle || tempMain );
      SERVER.channels.shop = SERVER.guild.channels.get( channels.shop || tempMain );
      SERVER.channels.oc = SERVER.guild.channels.get( channels.oc || tempMain );
      SERVER.channels.debug = SERVER.guild.channels.get( channels.debug || tempMain );
      
      // Set up roles
      UTIL.setRoles();
    } else {
      // If the guild wasn't found, the SERVER isn't valid
      console.log("Couldn't find the SERVER!");
      SERVER.isValid = false;
    }
    
    // If the main (or debug) channel wasn't found, the SERVER isn't valid
    if ( !SERVER.channels.main ) SERVER.isValid = false;
    
    if (Object.freeze) Object.freeze(SERVER);

  },
  
  setRoles: function() {
    SERVER.roles.any = SERVER.guild.roles.find('name', CONFIG.roles.any);
    SERVER.roles.partnered = SERVER.guild.roles.find('name', CONFIG.roles.partnered);
    SERVER.roles.mod = SERVER.guild.roles.find('name', CONFIG.roles.mod);
    SERVER.roles.admin = SERVER.guild.roles.find('name', CONFIG.roles.admin);
  },
  
  boolMapReduce: function(input, arr, fnIN, fnOUT) {
    var result = input;
    for (var i=0; i<arr.length; i++) {
      result = fnOUT( result, fnIN(arr[i]) );
    }
    return result;
  },
  
  reduceAND: function(r, item) {
    return r && item;
  },
  
  reduceOR: function(r, item) {
    return r || item;
  },
  
  channelMatch: function( channel ) {
    return function( channel, item ) {
      return SERVER.channels[item] === channel;
    }
  },
  
  roleMatch: function( user ) {
    return function( user, item ) {
      console.log(user);
      return SERVER.guild.member(user).roles.has(SERVER.roles[item].id);
    }
  },
  
  isFilePermitted: function( ) {
    /*let type = header.content-type.split(" ")[0]
    if ( type !== "text/plain" && type !== "application/json") return false;
    if ( header.transfer-encoding === "chunked" ) {
      console.log("TODO: Count bytes as they arrive");
    } else {
      return header.content-length <= 1000000; //1MB
    }*/
    return true;
  },
  
  sendFileRequest: function( uri, callbackA, callbackB ) {
    
    REQUEST( uri , function(error, response, body) {      
      if( !error && response.statusCode === 200 ) {
        callbackA( JSON.parse(body) );
      } else {
        console.log("There was an error loading your file...\n" + error);
        callbackA( {} );
      }
      console.log("========");
    })
      .on( 'response', function(response) {
        let self = this;
        let invalidCode = "";
        
        let ctype = response.headers["content-type"].split(" ")[0];
        if( !ctype.includes("text/plain") && !ctype.includes("application/json") ) {
          console.log("Type: " + ctype);
          console.log("Wrong File Type!  Aborting...");
          invalidCode = "filetype";
          self.abort();
        }
      
        let byteCounter = 0;
        response.on( 'data', function( data ) { 
          console.log(`B:: ${byteCounter}`);    
          
          if( byteCounter + data.length > SECRET.maxfilesize * 1000 ) {
            console.log("File too large!  Aborting...");
            invalidCode = "filesize";
            self.abort();
            
          } else {
            byteCounter += data.length; 
            console.log(`B:: decoded ${data.length} total: ${byteCounter}`);
          }
        } );
        response.on( 'end', function() {
          console.log("Finished loading file request");
          callbackB( { code: this.statusCode, reason: invalidCode } );
        } );
      } );
  }
};
if (Object.freeze) Object.freeze(UTIL);

var COMMAND = {
  shutdown: function(msg, args) {
    SERVER.channels.main
      .sendMessage(`${SERVER.roles.partnered} ${CONFIG.botname} has been taken offline by ${msg.author}`)
      .catch(console.log);
    CLIENT.destroy()
      .catch(console.log);
  },
  test: function(msg, args) {
    SERVER.channels.debug
      .sendEmbed( FORMAT.embed( { description: `This is just a test.` } ) )
      .catch(console.log);
  },
  help: function(msg, args) {
    if( args[0] ) {
      SERVER.channels.info
        //.sendEmbed( FORMAT.embed( {  } ) )
        .sendCode( 'md', this.getDetails() )
        .catch(console.log);
    } else {
      msg.author
        .sendCode( 'md', this.getDetails() )
        .catch(console.log);
    }
  },
  bases: function(msg, args) {
    if ( ENUM.Preset.hasOwnProperty(args[0]) ) {
      SERVER.channels.info
        .sendMessage(`Summarizing all variants available for base keyword ${args[0].toUpperCase()}...`)
        .catch(console.log);
      SERVER.channels.info
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 
          'normal', 'normal', ENUM.Preset.getSummary(ENUM.Preset[args[0]]), "", 
          `${args[0].toUpperCase()} Base Variants`, ENUM.Preset.properties[ENUM.Preset[args[0]]].img ) ) )
        .catch(console.log);
    } else {
      SERVER.channels.info
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 
          'normal', 'normal', ENUM.Preset.getDetails(), "", "Available Base Keywords" ) ) )
        .catch(console.log);
    }
  },
  variants: function(msg, args) {
    if (ENUM.Preset.hasOwnProperty(args[0])) {
      let variants = ENUM.Preset.getVariants(BaseTypeEnum[args[0]]);

      if (variants.length == 0) {
        SERVER.channels.info.sendMessage(`${msg.author}: No variants available for base keyword ${args[0].toUpperCase()}...`);

      } else {
        SERVER.channels.info.sendMessage(`${msg.author}: Listing all variants for base keyword :${args[0].toUpperCase()}...`);
        for ( let i=0; i<variants.length; i++ ) {
          if ( variants[i] != null ) 
            SERVER.channels.info
              .sendEmbed( FORMAT.embed(variants[i]) )
              .catch(console.log);
        }
      }
    } else {
      if ( args[0] ) {
        msg.channel
          .sendEmbed( FORMAT.embed( NPC.getEmbed( 
            'error', 'error',
            `ERROR!! ERROR!! ERROR!!\n\nUNRECOGNIZED BASE KEYWORD IN COMMAND:\n\n ${FORMAT.inline("VARIANTS " + args[0].toUpperCase())}\n\nPlease pick a valid base keyword and try this command again`) ) )
          .catch(console.log);
        COMMAND.bases(msg, args);
      } else {
        FORMAT.embed( NPC.getEmbed( 
            'error', 'error',
            `ERROR!! ERROR!! ERROR!!\n\nPlease pick a valid base keyword and try this command again`) )
          .catch(console.log);
        COMMAND.bases(msg, args);
      }
    }
  },
  create: function(msg, args) {
    /*if ( allPartners.has( msg.author.id ) ) {
      let partner = allPartners.get(msg.author.id);
      msg.reply(`BUT YOU ALREADY HAVE A ${CONFIG.partnerLabel.toUpperCase()}`).catch(console.log);
      allPartners.get(msg.author.id).respond( msg, 'confused');
    } else {*/

      var name = base = variant = null;
      if(args.length > 2) { // assume name is all of the leftovers
        base = args[0]; variant = args[1];name = args.slice(2).join("_");
      } else
      if ( args.length == 2 ) { // Be smart interpreter
        if ( ENUM.Preset.hasBase(args[0].toLowerCase()) ) {
          base = args[0];
          if ( ENUM.Preset.hasVariant(base.toLowerCase(),args[1].toLowerCase()) ) { variant = args[1]; }
          else { name = args[1]; }
        } else { name = args[0]; base = args[1]; }
      } else
      if ( args.length == 1 )  { // Assume it is a name or a base
        if ( ENUM.Preset.hasBase(args[0].toLowerCase()) ) { base = args[0]; }
        else { name = args[0]; }
      }

      base = ( base ) ? base.toLowerCase() : null;
      variant = ( variant ) ? variant.toLowerCase() : null;

      let verifiedBase = ( base === null || ENUM.Preset.hasBase(base) );
      let verifiedVariant = ( variant === null || ENUM.Preset.hasVariant(base,variant) );

      if ( base === null  || !verifiedBase ) base = ENUM.Preset.properties[ Object.keys(ENUM.Preset.properties)[0] ].id;
      if ( variant === null || !verifiedVariant ) variant = Object.keys(ENUM.Preset.properties[ENUM.Preset[base]].variants)[0];
      //console.log(name);
      name = ( name != null ) ?  name : ENUM.Preset.properties[ENUM.Preset[base]].variants[variant].name;
      //console.log(base + " " + variant + " " + name);
      allPartners.set( msg.author.id, new CHARACTER.Partner(msg.author, name, base, variant) );
      msg.channel.sendMessage( FORMAT.embed( 
        allPartners.get(msg.author.id).getEmbed( msg, 'greeting') ) )
        .catch(console.log);
      SERVER.guild.member(msg.author)
        .addRole( SERVER.roles.partnered )
        .catch(console.log);
    //}
  },
  check: function(msg, args) {
    msg.reply('This feature not yet supported.')
      .catch(console.log);
  },
  stats: function(msg, args) {
    msg.reply('This feature not yet supported.')
      .catch(console.log);
  },
  customize: function(msg, args) {
    msg.reply('This feature not yet supported.')
      .catch(console.log);
  },
  reset: function(msg, args) {
    msg.reply('This feature not yet supported. Planned for V.0.2.0')
      .catch(console.log);
  },
  netalerts: function(msg, args) {
    msg.reply('NOTE: This feature not yet fully supported. Planned for V.0.2.0')
      .catch(console.log);
    SERVER.channels.main
      .sendMessage(`${SERVER.roles.partnered}`)
      .catch(console.log);
    msg.channel
      .sendEmbed( FORMAT.embed( NPC.announcer.getEmbed('warning', 'error', 
        `Attention all NetOps! A virus has infected the ${SERVER.channels.battle} channel!`,
        "") ) )
      .catch(console.log);
  },
  jack: function(msg, args) {
    if ( allPartners.has(msg.author.id) ) {
      let partner = allPartners.get(msg.author.id);
      if ( args[0] ) {
        if ( args[0].toLowerCase() == 'in' ) {
          msg.channel
            .sendEmbed( partner.getEmbed(msg, 'netalert') )
            .catch(console.log);
        } else
        if ( args[0].toLowerCase() == 'out' ) {
          msg.channel
            .sendEmbed( partner.getEmbed(msg, 'bails') )
            .catch(console.log);
        } else {
          msg.channel
            .sendEmbed( partner.getEmbed(msg, 'confused') )
            .catch(console.log);
        }
      } else {
        msg.channel
            .sendEmbed( partner.getEmbed(msg, 'confused') )
            .catch(console.log);
      }
    } else {
      msg.channel
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 
          'normal', 'warning',
          `You don't have a ${CONFIG.partnerLabel} yet!\n\nType the following command to make yourself a ${CONFIG.partnerLabel}:\n\n${FORMAT.inline("CREATE NAME.EXE")}`,
          "" ) ) )
        .catch(console.log);
    }
    msg.reply('This feature not yet fully supported. Planned for V.0.2.0').catch(console.log);
  },
  hey: function(msg, args) {
    if(allPartners.has(msg.author.id)) {
      msg.channel
        .sendEmbed( allPartners.get(msg.author.id).getEmbed( msg, 'greeting') )
        .catch(console.log);
    }
  },
  clear: function(msg, args) {
    // TODO: Check user individual permissions to delete messages
    let numDel = (args[0]) ? parseInt(args[0]) : 10;
    if (numDel <= 2 || numDel >= 200) {
      msg.reply( ` CLEAR command accepts only values greater than 2 and less than 200!` )
        .catch(console.log);
    } else {
      msg.channel.bulkDelete(numDel)
        .then(
          msg.channel
            .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 
              'normal', 'warning', 
              `${numDel} MESSAGES DELETED.`, 
              `by @${msg.author.username}#${msg.author.discriminator} in #${msg.channel.name}` ) ) )
            .catch(console.log)
      ).catch(console.log);
    }
  },
  challenge: function(msg, args) {
    SERVER.channels.info
      .sendEmbed( FORMAT.embed ( NPC.announcer.getEmbed( 
        'normal', 'normal', ENUM.Challenge.getDetails(), "" ) ) )
      .catch(console.log);
  },
  save: function(msg, args) {
    // TODO: Process arguments
    JSONFILE.writeFile("temp/test_" + msg.author.id + ".txt", NPC.guide, {spaces: 2}, function(error){ 
      console.log("Writing...");
      console.log("ERROR: " + error);
      console.log("Done writing!");
      msg.author.send("Here is your file!", { file: "temp/test_" + msg.author.id + ".txt" })
        .then( console.log("finished sending the attachment, so delete file and enable user to do read/writes again") )
        .catch(console.log);
    });
  },
  load: function(msg, args) {
    // TODO: Process first argument
    
    // Get Attachment data
    if (msg.attachments.size > 0) {
      console.log("Checking for Attached File");
      let atfile = msg.attachments.first();      
      // TODO: Handle Result
      UTIL.sendFileRequest( atfile.url, 
        function(json) { console.log("JSON: " + json); },
        function(status) { console.log("Status Code: " + status.code); console.log("Reason: " + status.reason); }
        );
      
    // Get URL data
    } else if ( args[1] ) {
      console.log("Checking for URL");
      // TODO: Handle Result
      UTIL.sendFileRequest( args[1], 
        function(json) { console.log("JSON: " + json); },
        function(status) { console.log("Status Code: " + status.code); console.log("Reason: " + status.reason); }
        );

    } else {
      console.log("No file detected!");
      console.log(args);
      return;
    }
  },
  // Helper functions that used to be part of ENUM.Command
  getDetails: function() {
    let str = ``;
    for ( let p in ENUM.Command.properties ) {
      str += `${FORMAT.code(ENUM.Command.properties[p].usage, CONFIG.prefix)}\n${ENUM.Command.properties[p].desc}\nUsable only by: ${ENUM.Command.properties[p].perm}\n\n`
    }
    return str;
  },
  isUserPermitted: function( cmd, msg ) {
    return UTIL.boolMapReduce( false, ENUM.Command.properties[ENUM.Command[cmd]].perm, UTIL.roleMatch(msg.author), UTIL.reduceOR );
  },
  isPermitted: function( cmd, msg ) {
    if ( msg.channel.type === "dm" ) {
      return ENUM.Command.properties[ENUM.Command[cmd]].enableDM && this.isUserPermitted( cmd, msg );
    } else {
      return UTIL.boolMapReduce( false, ENUM.Command.properties[ENUM.Command[cmd]].channels, UTIL.channelMatch(msg.channel), UTIL.reduceOR ) && this.isUserPermitted( cmd, msg );
    }
  }
};
if (Object.freeze) Object.freeze(COMMAND);

var CHARACTER = {
  proto: {
    basic: function() {
  this.owner = CLIENT.user;
  this.baseKey = 1;
  this.variantKey = 0;
  this.level = 0;
  this.xp = 0;
  this.mood = 1;
  this.numResets = 0;
  this.custom = new Customization();

  this.getEmbed = function(msg, situation) {
    return {
      author: this.getName(),
      description: FORMAT.injectVar( this.owner, msg.author,
          this.getDialogue(situation, ENUM.Feeling.properties[this.mood].id) ),
      thumbnail: this.getImg(msg.channel),
      color: this.getColor(),
    };
  };

  // Custom GETTERS
  this.getName = function() {
    return this.custom.name || this.getVariant().custom.name;
  };
  this.getBase = function() {
    return ENUM.Preset.properties[this.baseKey];
  };
  this.getVariant = function() {
    return this.getBase().variants[this.variantKey];
  };
  this.getImg = function(channel) {
    if ( CONFIG.EnableOC && SERVER.channels.oc === channel && this.custom.img ) {
      return this.custom.img;
    } else {
      return this.getVariant().custom.img;
    }
  };
  this.getColor = function() {
    return this.custom.color || this.getVariant().custom.color;
  };
  this.getCapacity = function() {
    return this.custom.capacity || this.getVariant().custom.capacity;
  };
  this.getAlignment = function() {
    return this.custom.alignment || this.getVariant().custom.alignment;
  };
  this.getPersonality = function() {
    return this.custom.personality || this.getVariant().custom.personality;
  };
  this.getModifier = function( situation ) {
    return this.custom.modifiers[situation].mod || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].modifiers[situation].mod;
  };
  this.getDialogue = function( situation, feeling ) {
    return this.custom.modifiers[situation].dialogue[feeling] || 
      ENUM.Personality.properties[ENUM.Personality[this.getPersonality()]].modifiers[situation].dialogue[feeling];
  };

  // Custom SETTERS
  this.setName = function( v ) {
    this.name = v;
  };
  this.setBase = function( v ) {
    this.custom.base = v;
  };
  this.setImg = function( v ) {
    this.custom.image = v;
  };
  this.setColor = function( v ) {
    this.custom.color = v;
  };
  this.setCapacity = function( v ) {
    this.custom.capacity = v;
  };
  this.setAlignment = function( v ) {
    this.custom.alignment = v;
  };
  this.setPersonality = function( v ) {
    this.custom.personality = v;
  };
  this.setModifier = function( situation, mod ) {
    this.custom.modifiers[situation].mod = mod;
  };
  this.setDialogue = function( situation, feeling, text ) {
    this.custom.modifiers[situation].dialogue[feeling] = text;
  };
},
    enemy: function() {
    let self = this;
    return (function(){
      this.prototype = self.proto;
      this.drop = [{ zenny: 50 }];
      // TODO: Add drop-related functions here to act as prototype
    })();
  }
  },
  
  // TODO: Add other constructors here, for things like Viruses and Bosses
  Enemy: function(name, base, variant, drop) {
    let self = this;
    return (function() {
      this.prototype = self.proto.enemy;
      if (name) this.custom.name = name;
      if (base) this.baseKey = base;
      if (variant) this.variantKey = variant; // defaults to zero, so no need to check zero case
      if (drop && drop.length > 0) this.drop = drop;
    })();
  },
  Partner: function(user, name, base, variant) {
    let self = this;
    return (function() {
      this.prototype = self.proto.basic;
      this.owner = user;
      if (CONFIG.enforceSuffix && name && !name.includes(CONFIG.suffix) ) { name += CONFIG.suffix; }
      if (name) this.custom.name = name;
      if (base) this.baseKey = base;
      if (variant) this.variantKey = variant; // defaults to zero, so no need to check zero case
    })();
  }
}
if (Object.freeze) Object.freeze(CHARACTER);


// =========================================================
//  EVENT HANDLING
// =========================================================
// Miscellaneous Events
CLIENT.on('guildMemberAvailable', () => {
  console.log('Someone came online');
});
CLIENT.on('disconnect', closeEvent => {
  console.log('Mr.Prog went offline with code ' + closeEvent.code);
  disconnected = true;
  console.log(JSON.stringify(closeEvent.target._events.open));
  console.log("=====");
  console.log(JSON.stringify(closeEvent.target._events.message));
  console.log("=====");
  console.log(JSON.stringify(closeEvent.target._events.close));
  console.log("=====");
  console.log(JSON.stringify(closeEvent.target._events.error));
  console.log("=====");
});
CLIENT.on('reconnecting', () => {
  console.log('Mr.Prog is attempting to reconnect');
});
CLIENT.on('warn', warn => {
  console.log('WARNING: ' + warn);
});
CLIENT.on('error', error => {
  console.log('ERROR: ' + error.message);
});

// Initialization Procedure
CLIENT.on( 'ready', () => {
  
  if (disconnected) {
    console.log("RECOVERED from D/C");
  } else {
    console.log('Mr.Prog the Discord bot is now online');
    if ( CONFIG.isDebugMode ) {
      UTIL.setServer( CONFIG.channels.debugmode );
    } else {
      UTIL.setServer( CONFIG.channels.normalmode );
    }

    if ( SERVER.isValid ) {
      SERVER.channels.main.sendMessage(
        `${SERVER.roles.partnered} ${CONFIG.botname} is now online!`
      ).catch(console.log);
    } else {
      console.log("INVALID SERVER OR CHANNEL IDs. SHUTTING DOWN!");
      CLIENT.destroy().catch(console.log);
    } 
  }
} );

// Message Handling
CLIENT.on( 'message', msg => {
  
  // Ignore own messages
  if (msg.author.bot) return;
  
  // React to mention at me in MAIN or DM only
  if ( msg.mentions.users.exists('username', SECRET.botuser) 
      && (msg.type === "dm" || msg.channel === SERVER.channels.main) ) {
    if ( allPartners.has( msg.author.id ) ) {
      let partner = allPartners.get(msg.author.id);
      // Check in on partner status
      msg.channel
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'normal', 'normal', 
          `Hello, ${msg.author}!\n\nHow is your ${CONFIG.partnerLabel}, ${partner.name}, doing?`, 
          null ) ) )
        .catch(console.log);
      // Get partner response
      msg.channel
        .sendEmbed( FORMAT.embed( partner.getEmbed( msg, feeling ) ) )
        .catch(console.log);
    } else {
      // Remind user to create a partner for themselves
      msg.channel
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'normal', 'normal', 
          `Hello, ${msg.author}!\n\nType the following to make your own ${CONFIG.partnerLabel}:\n\n${FORMAT.code("create NAME BASE VARIANT", CONFIG.prefix)}`, 
          null ) ) )
        .catch(console.log);
    }
  }
  
  // Ignore not commands
  if (!msg.content.startsWith(CONFIG.prefix)) return;

  // Get the arguments
  let args = msg.content.trim().split(/[ ,]+/);

  // Get the command name
  let cmd = args[0].toLowerCase().slice(CONFIG.prefix.length);
  args = args.slice(1);
  
  let name = (msg.channel.type === "text") ? msg.member.displayName : msg.author.username;
  
  // Check permissions for the command
  if (ENUM.Command.hasOwnProperty(cmd)) {
    
    //if ( COMMAND.isPermitted(cmd, msg) ) {
    if ( true ) {
      // process command
      COMMAND[cmd](msg, args);
    } else {
      // alert that this user is not permitted
      msg.author
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'error', 'error', 
        `ERROR!! ERROR!! ERROR!!\n\n${FORMAT.code(`User: ${name}\nChannel: ${msg.channel.name}\nCommand: ${CONFIG.prefix}${args.join(" ")}`)}\n\nACCESS DENIED!!`,
        null ) ) )
        .catch(console.log);
      msg.author
        .sendMessage(`${msg.author}, you are not permitted to use ${FORMAT.inline(cmd, CONFIG.prefix)} in ${msg.channel}`)
        .catch(console.log);
      msg.delete(1000)
        .then(msg => console.log(`Deleted message from ${msg.author}`))
        .catch(console.error);
    }
  } else {
    // alert that the command wasn't recognized
    msg.author
      .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'error', 'error', 
      `ERROR!! ERROR!! ERROR!!\n\n${FORMAT.code(`User: ${name}\nChannel: ${msg.channel.name}\nCommand: ${CONFIG.prefix}${args.join(" ")}`)}\n\nCOMMAND NOT RECOGNIZED!!`, null ) ) )
      .catch(console.log);
    msg.author
      .sendMessage(`${msg.author}, type ${FORMAT.inline(cmd, CONFIG.prefix)} to list all recognized commands.`)
      .catch(console.log);
    msg.delete(1000)
      .then(msg => console.log(`Deleted message from ${msg.author}`))
      .catch(console.error);
  }
  
} );


// Login to Discord
CLIENT.login(SECRET.tk);