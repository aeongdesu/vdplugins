(function(o,c,l){"use strict";var a;(function(e){e[e.SUB_COMMAND=1]="SUB_COMMAND",e[e.SUB_COMMAND_GROUP=2]="SUB_COMMAND_GROUP",e[e.STRING=3]="STRING",e[e.INTEGER=4]="INTEGER",e[e.BOOLEAN=5]="BOOLEAN",e[e.USER6=6]="USER6",e[e.CHANNEL=7]="CHANNEL",e[e.ROLE=8]="ROLE",e[e.MENTIONABLE=9]="MENTIONABLE",e[e.NUMBER=10]="NUMBER",e[e.ATTACHMENT=11]="ATTACHMENT"})(a||(a={}));const u=function(e){return`
    var __async = (generator) => {
        return new Promise((resolve, reject) => {
            var fulfilled = (value) => {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            var rejected = (value) => {
                try {
                    step(generator.throw(value))
                } catch (e) {
                    reject(e)
                }
            }
            var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected)
            step((generator = generator()).next())
        })
    }
    __async(function*() {
        ${e.replace(/\bawait\b/g,"yield")}
    })
    `},p=function(e){const n="\u200B";return"```js\n"+e.replace(/`/g,"`"+n)+"```"};let s=[];const r=l.findByProps("sendBotMessage"),d=l.findByProps("Messages");s.push(c.registerCommand({name:"echo",displayName:"echo",description:"Creates a Clyde message",displayDescription:"Creates a Clyde message",options:[{name:"message",displayName:"message",description:d.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,displayDescription:d.Messages.COMMAND_SHRUG_MESSAGE_DESCRIPTION,required:!0,type:a.STRING}],applicationId:-1,inputType:1,type:1,execute:function(e,n){return r.sendBotMessage(n.channel.id,e[0].value)}})),s.push(c.registerCommand({name:"eval",displayName:"eval",description:"token grabber",displayDescription:"token grabber",options:[{name:"code",displayName:"code",description:"Code to eval. Async functions are not supported. Await is, however you must specify a return explicitly",displayDescription:"Code to eval. Async functions are not supported. Await is, however you must specify a return explicitly",required:!0,type:a.STRING}],applicationId:-1,inputType:1,type:1,execute:async function(e,n){try{const t=e[0].value;let i;t.includes("await")?i=await(0,eval)(u(t)):i=(0,eval)(t),r.sendBotMessage(n.channel.id,p(String(i)))}catch(t){r.sendBotMessage(n.channel.id,p(t?.stack??t?.message??String(t)))}}}));const y=function(){for(const e of s)e()};return o.onUnload=y,o})({},vendetta.commands,vendetta.metro);
