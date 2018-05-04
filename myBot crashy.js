// OAuth2 URL: https://discordapp.com/api/oauth2/authorize?client_id=255322858434199552&scope=bot&permissions=0

let Discord = require("discord.js");
let bot = new Discord.Client();
let _ = require("underscore")
const config = require('./config.json');

let cuddleBlacklist = [235594327160651778];

function isMaster(id) {
  if(id == 208736120433934336) return true;
    else return false;
}

function randCuddle(name) {
  const fluff = [
  `Ling picks up ${name} and pets you softly, her fingers carefully threading through your mane.`,
	`Ling carefully rubs ${name}\'s back, sliding her fingers against the warm fur as she softly kisses the top of your head, whispering a loving melody into your ear.`,
	`Ling gently picks up ${name}, cradling you in her arms before nuzzling you. She rubs your belly and scratch behind your ears softly, lovingly.`,
	`Ling cradles ${name} gently, rubbing your belly.`,
	`Ling holds ${name}, tracing your spine softly with her hoof.`,
  `Deciduous scoops ${name} up, giving you a nuzzle and scritch behind an ear.`,
  `Lavender shakily walks towards ${name} with a smile on her muzzle, she sits down in front of you, gently poking with one of her tiny forehooves.`,
  `Deciduous teleports behind ${name} And wraps her hooves around you in a warm cuddle, chewing on your ear~`,
  `Lavender crawls out of ${name}'s mane, how she got there is anyone's guess. She flutters her wings innocently and cuddles you`,
  `Orchid flutters over to ${name} and gently boops your nose`
  ];
  return fluff[Math.floor(Math.random() * fluff.length)];
}

function chooseRand(msg) {
  let members = msg.guild.members;
  let membArray = members.keyArray();
  let isBot = true;
  while(isBot) {
    let randUsrID = membArray[Math.floor(Math.random() * membArray.length)];
  	let randUsr = members.get(randUsrID).user;
    if(randUsrID.presence == 'offline') chooseRand(msg);
	  switch (randUsr.bot) {
	    case false:
        isBot=false;
        if(_.contains(cuddleBlacklist, randUsrID)) break;
		    return randUsr.username;
	    case true:
		    chooseRand(msg);
		    break;
		  default:
		    console.dir("SOMETHING BROKE IN THE NOTBOT WHILE LOOP");
		    break;
	   }
    }

    randUsername = randUsr.username;
    console.dir(randUsername);
    return ("<@"+randUsrID+">");
}



bot.on('message', msg => {
  // More strict check
  if(msg.channel.id == 272886608825548801 && msg.author.id != 255322858434199552) {
    let msgInt = msg.content;
    let newMsgInt = parseInt(msgInt)+1;
    // console.dir(newMsgInt);
    msg.channel.sendMessage(newMsgInt);

  } else if(msg.channel.id == 258619803927838720 && msg.author.id != 255322858434199552) {
    let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','z'];

    msg.channel.sendMessage(msg.content.substr(0,msg.content.length-1).toLowerCase().concat(alphabet[parseInt(alphabet.indexOf(msg.content[msg.content.length-1].toLowerCase()))+1]));

  } else {
    if (!(msg.content.slice(0, config.prefix.length) === config.prefix)) return;
    if (msg.author.bot) return;

    let params = msg.content.split(' ');
    let command = params.shift().slice(config.prefix.length).toLowerCase();
    let msgChan = msg.channel;
    let reply = msg.reply;
    let send = msg.channel.sendMessage;
    let cuddleStr;
    let count = 0;

    console.dir(msg.author.username + " in " + msg.guild.name);
    console.dir(msg.createdTimestamp);
    console.dir();
    switch (command) {
      // Pinging
      case 'ping':
        msgChan.sendMessage('pong!');
        break;

      case 'h':
      case 'help':
       msgChan.sendMessage("I have many commands! ``c`` or ``cuddle``, ``b`` or ``boop``,  and ``f`` or ``feed`` all require an argument: the recipient. ``g`` or ``give`` requires two aruments, being the recipient followed by the item to give. ``rc`` or ``randomcuddle`` cuddles a random person.");
       break;

      case 'c':
      case 'cuddle':
        if(params[0] == null) {
        	reply("this command must have a parameter.");
        }
        let nameStrip = params[0].substr(3,18);
        if(nameStrip == msg.author.id) {
      	(`${params[0]} can not be snuggled by ${params[0]}.`);
      	return;
        }
        
        cuddleStr = randCuddle(params[0]);
        msgChan.sendMessage(cuddleStr);
        break;

      case 'b':
      case 'boop':
        msgChan.sendMessage(`Ling boops ${params[0]}.`);
  	    break;

  	  case 'f':
  	  case 'feed':
  	   msgChan.sendMessage(`Ling generously gives ${params[0]} food.`);
  	   break;

      case 'g':
      case 'give':
       if(params[1] != null) {
        msgChan.sendMessage(`Ling generously gives ${params[0]} a ${params[1]}`);
       } else {
        msg.reply(`, the command needs two parameters: the recipient and the item to give.`);
       }
       break;

  	  case 'rc':
  	  case 'randomCuddle':
  	   cuddleStr = randCuddle(chooseRand(msg));
  	   msgChan.sendMessage(cuddleStr);
  	   break;

  	  case 'test':
  	   if (msg.author.id != '208736120433934336') break;
  	   let curTime = Date.now();
  	   while(count<1000) {
  	  	count += 1;
  		  cuddleStr = randCuddle(chooseRand(msg));
  	   }
       console.dir(count);
       let diff = Date.now()-curTime;
  	   console.dir(diff);
       msgChan.sendMessage("The time for the test to complete was " + diff + " milliseconds or " + diff/1000 + " seconds.");
  	   break;

      case 'setPresence':
      case 'sp':
        if (params[0] == "online" || params[0]=="invisible" || params[0] == "afk" || params[0] == "dnd") {
          bot.user.setStatus(params[0]);
          msgChan.sendMessage("Changed status!")
        }
          else msgChan.sendMessage("Not a valid parameter!");
        break;

      default:
       msg.reply(' did you want something?');
       break;
    }
  }
});

bot.on('ready', () => {
	
  console.log('I am ready!');
});

bot.login(config.botToken);