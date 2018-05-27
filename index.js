const discord = require('discord.js');
const client = new discord.Client();
const embed = discord.MessageEmbedImage;
const User = require('./UserDetails.js');
const fs = require('fs');

const Userdata = require('./Userdata.json');
// Firebase

const firebase = require("firebase-admin");
const serviceKey = require('./key.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceKey),
    databaseURL: 'https://randombet-58959.firebaseio.com'
});

// Firebase 

var NumberRef = firebase.database().ref('/games/number');
var MoneyRef = firebase.database().ref('/money');
var max = 10;
var events = [
    "Sold Lamborghini",
    "Helped Cops",
    "Got Promotion",
    "Sold Ice-Creams",
    "Got a gift",
    "Washed Car for customer",
    "Delievered Pizza's",
    "Fed the Pets of Neighbour",
    "Got Tip",
    "Fixed Computer",
    "Fixed TV",
    "Fixed Washing machine",
    "sold pancakes",
    "Sold Chocolates",
    "Sold Newspapers",
    "Sold Paintings",
    "Did Babaysitting"
]

// Bot  
client.on('ready', () => {
    console.log("Bot is ready to conquer the world..");
    client.user.setActivity("Happiness Around the world","WATCHING")
})

var UserMoneyData = [];
client.on('message', (message) => {
    if (message.content.substr(0, 1) === "+") {
        var rand = Math.floor(Math.random() * max + 1);
        var randMoney = Math.floor(Math.random() * 700 + 1);
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
        var randMessage = Math.floor(Math.random() * events.length);

        switch (args[0].toLowerCase()) {

            case 'info':
                message.channel.send({
                    embed: {
                        color: Math.floor(Math.random() * 16777215),
                        title: "Commands Helpline",
                        fields: [{
                            name: "+predict <Number>",
                            value: "Takes a number and compares it with the randomly generated number. For eg !predict 1"
                        }, {
                            name: "+top",
                            value: "Shows the top player of the channel."
                        }, {
                            name: "+max",
                            value: "Sets the maximum limit of maximum generating numbers."
                        }, {
                            name: "+info",
                            value: "Displays help commands."
                        },{
                            name:"+register",
                            value:"Sign in for the work-rob game"
                        },{
                            name:"+work",
                            value:"You earn money"
                        },{
                            name:"+deposit",
                            value:"Deposits your current Amount in the bank"
                        },{
                            name:"+rob <usernam>",
                            value:"Rob someone for eg. !rob @xyx"
                        },{
                            name:"+me",
                            value:"Displays your current financial condition."
                        }]
                    }
                })
                break;
            case 'pmax':
                message.channel.sendMessage("Current Maximum Limit is: " + max);
                break;
            case 'predict':
                if (args[1] == rand) {
                    message.channel.sendMessage("Congratulations! You win! " + message.author);

                    userRef.update({
                        "Username": message.author.username
                    })
                } else {
                    message.channel.sendMessage("Aww! Better Luck Next Time! The Number was " + rand);
                }
                break;

            case 'top':
                userRef.once('value', (snapshot) => {
                    message.channel.sendMessage("Top Player: " + snapshot.val().Username);
                })
                break;
            case 'max':
                max = args[1];
                message.channel.sendMessage("The New Max Limit is: " + max)
                break;

                // Money Game Commands


            case 'work':
            if(!Userdata[message.author.id]){
                let notRegisterd = new discord.RichEmbed()
                .setAuthor(message.author.username)
                .setThumbnail(message.author.avatarURL)
                .setTitle("You are not registered")
                .setDescription("Use !register to register.")

            }else{
                message.channel.sendMessage(message.author + " " + events[randMessage] + " and earned " + " $"+randMoney );
                Userdata[message.author.id].Amount += randMoney;
                                
            } 
                fs.writeFile('./Userdata.json', JSON.stringify(Userdata), err => {
                    if (err) console.log(err);
                
                })
             break;

            case 'rob':
                
                let toRob = (message.mentions.users.first().id);
                let chance = 30;

                let n = Math.random()*100;

                

                if(!Userdata[toRob]){
                    message.channel.sendMessage("User Doesnot exists!")
                }
                else{
                        if(n>chance){
                            Userdata[toRob].Amount = 0;
                            let robMsg = new discord.RichEmbed()
                            .setColor(" #ff2500")
                            .setTitle("You successfully Robbed "+Userdata[toRob].Name)
                            .setAuthor(message.author.username,message.author.avatarURL)
                            
                             message.channel.send(robMsg);
                            Userdata[toRob].TimesRobbed += 1;
                        }else{
                            message.channel.sendMessage("You were caught robbing!")
                        }
                }      
                fs.writeFile('./Userdata.json',JSON.stringify(Userdata),(err)=>{
                    if(err) console.error(err);
                })
              

            break;
            case 'me':
            if(!Userdata[message.author.id]){
                message.channel.sendMessage("You are not registered!");
            }else{

                let meData = new discord.RichEmbed()
                .setColor("#FF2500")
                .setAuthor(message.author.username,message.author.avatarURL)
                .addField("Name",Userdata[message.author.id].Name)
                .addField("Cash","$"+Userdata[message.author.id].Amount)
                .addField("Times Robbed",Userdata[message.author.id].TimesRobbed)
                .addField("Bank","$"+Userdata[message.author.id].Deposited)
                .addField("Crime Amount","$"+Userdata[message.author.id].CrimeAmount)
                .addField("Successfull Crimes",Userdata[message.author.id].SucessCrime);

                message.channel.send(meData)
                
            }
            break;

            case 'register':
            if(!Userdata[message.author.id]){
                Userdata[message.author.id] = {
                    Name:message.author.username,
                    Amount:0,
                    Deposited:0,
                    TimesRobbed:0,
                    CrimeAmount:0,
                    SucessCrime:0
                }
                message.channel.sendMessage("Thank you for signing Up for this game.GLHF ");
            }else{
                message.channel.sendMessage("User Already Exists");
            }

            fs.writeFile('./Userdata.json',JSON.stringify(Userdata),err => {
                if(err) console.log(err);
            })
            break;

            case 'deposit':
            if(args[1]!=null){
                message.channel.sendMessage("Use !deposit to deposit all of your money!")
            }
            
            if(!Userdata[message.author.id]){
                let notRegisterd = new discord.RichEmbed()
                .setAuthor(message.author.username)
                .setThumbnail(message.author.avatarURL)
                .setTitle("You are not registered")
                .setDescription("Use !register to register.");

                message.channel.send(notRegisterd);
            }else{
                Userdata[message.author.id].Deposited += Userdata[message.author.id].Amount;
                Userdata[message.author.id].Amount = 0;
                message.reply("Your Money has been successfully deposited");
            }

            fs.writeFile('./Userdata.json',JSON.stringify(Userdata),(err)=>{
                if(err) console.error(err);
            })

            break;

            case 'crime':
            let CrimeChance = 40;
            let a = Math.random()*100;

            let CrimeMoney = Math.floor(Math.random()*550)+1200;
            let DeductionMoney = Math.floor(Math.random()*400)+900;

            if(!Userdata[message.author.id]){
                let notRegisterd = new discord.RichEmbed()
                .setAuthor(message.author.username,message.author.avatarURL)
                .setTitle("You are not registered")
                .setDescription("Use !register to register.");

                message.channel.send(notRegisterd);
            }
            else {
                if(a>CrimeChance){
                Userdata[message.author.id].Amount+=CrimeMoney;
                Userdata[message.author.id].CrimeAmount+=CrimeMoney;
                Userdata[message.author.id].SucessCrime += 1;
                let CrimeMgs = new discord.RichEmbed()
                .setColor("#66CD00")
                .setTitle("Damn! You Pulled of that crime successfully!")
                .addField("Cash Earned","$"+CrimeMoney)
                .setAuthor(message.author.username,message.author.avatarURL);

                message.channel.send(CrimeMgs);
                
            }else{
                Userdata[message.author.id].Amount -= DeductionMoney;
                let CrimeMgs = new discord.RichEmbed()
                .setColor("#F00000")
                .setTitle("Cops Caught you while commiting Crime.Now Pay for it")
                .addField("Money Deducted","$"+DeductionMoney)
                .setAuthor(message.author.username,message.author.avatarURL);

                message.channel.send(CrimeMgs)
            }
        }
            fs.writeFile('./Userdata.json',JSON.stringify(Userdata),(err)=>{
                if(err) console.log(err);
            })
            break;
            default:
                message.channel.sendMessage("Invalid Command");
        }
        
    }

    //console.log(message.author.id);
})

client.login("NDM2NDQwODcwNTY5NjM5OTU2.DbnnZQ.gAWcv3JxgjVex1q3W58pqxNEVXc");