const SECRET = require("./require/conf.json");
const CONFIG = require("./require/config.js");
const NPC = require("./require/npc.js");
const CUSTOM = require("./require/custom.js");
const ENUM = require("./require/enum.js");
const CHARACTER = require("./require/character.js");

const JSONFILE = require('jsonfile');
const REQUEST = require('request');
const DISCORD = require('discord.js');
const CLIENT = new DISCORD.Client();

const SERVER = {
  guild: null,
  roles: {
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
  },
  
  isAlphaNumericJP: function( str ) {
    // Adapted from Michael Martin-Smucker on StackOverflow
    // http://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript/25352300#25352300
    let code, i, len;    
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      // NOTE: decimals are shifted by one due to comparison as > < instead of >= <=
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123) && // lower alpha (a-z)
          // Japanese Chars
          !(code > 12351 && code < 12448) && // Hiragana 3040-309f
          !(code > 12447 && code < 12544) && // Katakana 30a0 - 30ff
          !(code > 65381 && code < 65440) && // Half-width kana ff66 - ff9f
          !(code > 19967 && code < 40880) && // Common Kanji 4e00 - 9faf
          !(code > 13311 && code < 19894)) // Rare Kanji 3400 - 4db5
      { return false; }
    }
    return true;
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
    return function( item ) {
      return SERVER.channels[item] === channel;
    }
  },
  
  roleMatch: function( user ) {
    return function( item ) {
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
  // Admin / Mod Functions
  shutdown: function(msg, args, useOC) {
    SERVER.channels.main
      .sendMessage(`${SERVER.roles.partnered} ${CONFIG.botname} has been taken offline by ${msg.author}`)
      .catch(console.log);
    CLIENT.destroy()
      .catch(console.log);
  },
  test: function(msg, args) {
    SERVER.channels.debug
      .sendEmbed( FORMAT.embed( { desc: `This is just a test.` } ) )
      .catch(console.log);
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
  
  // Informative Functions
  help: function(msg, args, useOC) {
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
  init: function(msg, args, useOC) {},
  info: function(msg, args, useOC) {},
  
  // Partner Customization
  create: function(msg, args, useOC) {
    if ( allPartners.has( msg.author.id ) ) {
      let partner = allPartners.get(msg.author.id);
      msg.reply(`BUT YOU ALREADY HAVE A ${CONFIG.partnerLabel.toUpperCase()}`)
        .catch(console.log);
      msg.channel.sendMessage( FORMAT.embed( 
        allPartners.get(msg.author.id).getEmbed( msg.author, useOC, 'confused') ) )
        .catch(console.log);
    } else {

      var name = args[0].strip("*").strip(CONFIG.suffix) || null,
          base = args[1].toLowerCase() || null,
          variant = args[2].toLowerCase() || null;
      
      if ( FORMAT.isAlphaNumericJP( args[0].strip(CONFIG.suffix) ) ) {
        msg.reply(`${FORMAT.inline(name)} is not a valid [name]\n[name] should be alphanumeric, kana, and/or kanji.\nAny required suffix will be added automatically.`)
          .catch(console.log);
        return;
      }
      
      if ( CONFIG.enforceSuffix ) name += CONFIG.suffix;
      
      if ( !ENUM.Preset.hasBase( base ) ) {
        msg.reply(`${FORMAT.inline(base)} is not a recognized [preset]`)
          .catch(console.log);
        return;
      }
      
      if ( !ENUM.Preset.hasVariant( base, variant ) ) {
        msg.reply(`${FORMAT.inline(base)} ${FORMAT.inline(variant)} is not a recognized [preset] [variant] pair`)
          .catch(console.log);
        return;
      }
      
      allPartners.set( msg.author.id, 
        new CHARACTER.Partner( { 
          owner: msg.author, 
          name: name, 
          base: base, 
          variant: variant } ) );
      msg.channel.sendMessage( FORMAT.embed( 
        allPartners.get(msg.author.id).getEmbed( msg.author, useOC, 'greeting') ) )
        .catch(console.log);
      SERVER.guild.member(msg.author)
        .addRole( SERVER.roles.partnered )
        .catch(console.log);
    }
  },  
  rename: function(msg, args, useOC) {},
  recolor: function(msg, args, useOC) {},
  save: function(msg, args, useOC) {
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
  load: function(msg, args, useOC) {
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
  reset: function(msg, args, useOC) {
    msg.reply('This feature not yet supported. Planned for V.0.2.0')
      .catch(console.log);
  },
  
  // Partner Interaction
  netalerts: function(msg, args, useOC) {
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
  jack: function(msg, args, useOC) {
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
  hey: function(msg, args, useOC) {
    if(allPartners.has(msg.author.id)) {
      msg.channel
        .sendEmbed( allPartners.get(msg.author.id).getEmbed( msg, 'greeting') )
        .catch(console.log);
    }
  },
  status: function(msg, args, useOC) {},  
  
  // Helper functions that used to be part of ENUM.Command
  getDetails: function() {
    let str = ``;
    for ( let p in ENUM.Command.properties ) {
      str += `${FORMAT.code(ENUM.Command.properties[p].usage, CONFIG.prefix)}\n${ENUM.Command.properties[p].desc}\nUsable only by: ${ENUM.Command.properties[p].perm}\n\n`
    }
    return str;
  },
  isUserPermitted: function( cmd, msg ) {
    if ( ENUM.Command.properties[ENUM.Command[cmd]].perm.length == 0 ) return true;
    return UTIL.boolMapReduce( false, ENUM.Command.properties[ENUM.Command[cmd]].perm, UTIL.roleMatch(msg.author), UTIL.reduceOR );
  },
  isPermitted: function( cmd, msg ) {
    if ( msg.channel.type === "dm" ) {
      return ENUM.Command.properties[ENUM.Command[cmd]].enableDM && this.isUserPermitted( cmd, msg );
    } else {
      return UTIL.boolMapReduce( false, ENUM.Command.properties[ENUM.Command[cmd]].channels, UTIL.channelMatch(msg.channel), UTIL.reduceOR ) && this.isUserPermitted( cmd, msg );
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
  challenge: function(msg, args) {
    SERVER.channels.info
      .sendEmbed( FORMAT.embed ( NPC.announcer.getEmbed( 
        'normal', 'normal', ENUM.Challenge.getDetails(), "" ) ) )
      .catch(console.log);
  }
};
if (Object.freeze) Object.freeze(COMMAND);

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
  CLIENT.user.setAFK(true);
  CLIENT.user.setStatus('dnd');
  CLIENT.user.setGame("Unexpected Disconnect!");
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
    
    CLIENT.user.setAFK(false);
    CLIENT.user.setStatus('online');
    CLIENT.user.setGame(CONFIG.game);
    
  } else {
    
    console.log('Mr.Prog the Discord bot is now online');
    CLIENT.user.setStatus('dnd');
    
    if ( CONFIG.isDebugMode ) {
      CLIENT.user.setGame("DEBUG MODE");
      UTIL.setServer( CONFIG.channels.debugmode );
    } else {
      CLIENT.user.setGame(CONFIG.game);
      UTIL.setServer( CONFIG.channels.normalmode );
    }

    if ( SERVER.isValid ) {
      SERVER.channels.main.sendMessage(
        `${SERVER.roles.partnered} ${CONFIG.botname} is now online!`
      ).catch(console.log);
      CLIENT.user.setStatus('online');
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
  
  // Find out if we should display OC avatars
  let useOC = CONFIG.EnableOC && SERVER.channels.oc === msg.channel;
  
  // React to mention at me in MAIN or DM only
  if ( msg.mentions.users.exists('username', SECRET.botuser) 
      && (msg.type === "dm" || msg.channel === SERVER.channels.main) ) {
    if ( allPartners.has( msg.author.id ) ) {
      let partner = allPartners.get(msg.author.id);
      // Check in on partner status
      msg.channel
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'normal', 'normal', 
          `Hello, ${msg.author}!\n\nHow is your ${CONFIG.partnerLabel}, ${partner.name}, doing?` ) ) )
        .catch(console.log);
      // Get partner response
      msg.channel
        .sendEmbed( FORMAT.embed( partner.getEmbed( msg.author, useOC, 'feeling' ) ) )
        .catch(console.log);
    } else {
      // Remind user to create a partner for themselves
      msg.channel
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'normal', 'normal', 
          `Hello, ${msg.author}!\n\nType the following to make your own ${CONFIG.partnerLabel}:\n\n${FORMAT.code("create NAME BASE VARIANT", CONFIG.prefix)}` ) ) )
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
  
  // Get the user's name 
  let name = (msg.channel.type === "text") ? msg.member.displayName : msg.author.username;
  
  // Check permissions for the command
  if (ENUM.Command.hasOwnProperty(cmd)) {
    
    if ( COMMAND.isPermitted(cmd, msg) ) {
    //if ( true ) {
      // process command
      COMMAND[cmd](msg, args, useOC);
    } else {
      // alert that this user is not permitted
      msg.author
        .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'error', 'error', 
        `ERROR!! ERROR!! ERROR!!\n\n${FORMAT.code(`User: ${name}\nChannel: ${msg.channel.name}\nCommand: ${CONFIG.prefix}${cmd}${args.join(" ")}`)}\n\nACCESS DENIED!!`) ) )
        .catch(console.log);
      msg.author
        .sendMessage(`${name}, you are not permitted to use ${FORMAT.inline(cmd, CONFIG.prefix)} in ${msg.channel}`)
        .catch(console.log);
      /*msg.delete(1000)
        .then(msg => console.log(`Deleted message from ${msg.author}`))
        .catch(console.error);*/
    }
  } else {
    // alert that the command wasn't recognized
    msg.author
      .sendEmbed( FORMAT.embed( NPC.guide.getEmbed( 'error', 'error', 
      `ERROR!! ERROR!! ERROR!!\n\n${FORMAT.code(`User: ${name}\nChannel: ${msg.channel.name}\nCommand: ${CONFIG.prefix}${cmd}${args.join(" ")}`)}\n\nCOMMAND NOT RECOGNIZED!!`) ) )
      .catch(console.log);
    msg.author
      .sendMessage(`${name}, type ${FORMAT.inline(cmd, CONFIG.prefix)} to list all recognized commands.`)
      .catch(console.log);
    /*msg.delete(1000)
      .then(msg => console.log(`Deleted message from ${msg.author}`))
      .catch(console.error);*/
  }
  
} );


// Login to Discord
CLIENT.login(SECRET.tk);