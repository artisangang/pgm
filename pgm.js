!function(e){var t={};function r(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(i,n,function(t){return e[t]}.bind(null,n));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=106)}([function(e,t){e.exports=require("mongoose")},function(e,t,r){const i=r(33),n=r(16);e.exports=class{constructor(e){this.context=e,this.len=32}generate(){return this.header={iss:"Pluto Softwares",iat:n().unix(),typ:"AccessToken",alg:"HS512",exp:null},this}apiToken(){return this.type("ApiToken"),this}accessToken(){return this.type("AccessToken"),this}expiry(e,t,r){let i=n.unix(this.header.iat).add(e,t||"minutes");return r&&(i=i.startOf("day").subtract(1,"millisecond")),this._header("exp",i.unix()),this}type(e){return this._header("typ",e),this}unique(e){return this._header("jti",Buffer.from(i.randomBytes(Math.ceil((e||this.len)/2))).toString("hex")),this}_header(e,t){if(void 0===this.header)throw new Error("Header is not generated yet.");this.header[e]=t}get(){if(void 0===this.header)throw new Error("Header is not generated yet.");let e=Buffer.from(JSON.stringify(this.header)).toString("base64").replace(/=+$/,""),t=Buffer.from(JSON.stringify(this.context)).toString("base64").replace(/=+$/,""),r=i.createHmac("sha512",process.env.SECRET).update(e+t).digest("hex");return{token:e+"."+t+"."+r,signature:r,type:this.header.typ,expires:this.header.exp,issuedAt:this.header.iat}}static decode(e){if("string"!=typeof e)throw new Error("Token must be string.");let t=e.split(".");if(3!==t.length)return!1;try{return i.createHmac("sha512",process.env.SECRET).update(t[0]+t[1]).digest("hex")==t[2]&&{header:JSON.parse(Buffer.from(t[0],"base64").toString()),payload:JSON.parse(Buffer.from(t[1],"base64").toString()),signature:t[2]}}catch(e){}return!1}}},function(e,t,r){"use strict";const i=r(0),n=r(11);r(27),i.Promise=global.Promise;const s={};e.exports.slat=(()=>"MkY4NUNDLTQ1QS04NUUtRkFCLTJDOTMtNTlFMi0xOEFGNi0zNDE1NC02MjdDQQ"),e.exports.connection=((e,t)=>{let r=t||function(){};return e&&"default"!=e||(e=process.env.DB_NAME),void 0!==s[e]?s[e]:(n.info("Creating connection for: "+e),s[e]=i.createConnection("mongodb://"+process.env.DB_HOST+"/"+e,{useMongoClient:!0}),s[e].on("connected",()=>{n.info("Connection created for: "+e),r(null,e)}),s[e].on("error",t=>{n.error("Error in connection for: "+e,t),r(t,e),process.exit(1)}),s[e])}),process.on("SIGINT",function(){i.connection.close(function(){n.info("Database disconnected on app termination"),process.exit(0)})})},,,,function(e,t){e.exports=require("fs")},function(e,t,r){const i=r(24),n=r(6),s=r(10),a="resources/media";n.existsSync(s.resolve(process.cwd(),a))||i(s.resolve(process.cwd(),a));e.exports=class{static rules(){return{type:"required|in:image",file:"required|size:3mb|mime:png,jpg"}}static move(e){const t=new Date,r=t.getFullYear()+"",i=t.getMonth()+1+"";let o=s.join(process.cwd(),a,r);n.existsSync(o)||n.mkdirSync(o),o=s.join(o,i),n.existsSync(o)||n.mkdirSync(o);const u=s.basename(e);return o=s.join(o,u),n.copyFileSync(e,o),n.unlink(e,()=>{}),s.join(r,i,u)}static exists(e){if(!e||"string"!=typeof e)return!1;e=s.normalize(e).replace(/^(\.\.[\/\\])+/,"");let t=s.join(process.cwd(),a,e);return n.existsSync(t)}static remove(e){return new Promise((t,r)=>{if(!e||"string"!=typeof e)return void r("Invalid path");e=s.normalize(e).replace(/^(\.\.[\/\\])+/,"");let i=s.join(process.cwd(),a,e);n.unlink(i,e=>{e?r(e):t(i)})}).catch(()=>{})}static stream(e){e=s.normalize(e).replace(/^(\.\.[\/\\])+/,"");let t=s.join(process.cwd(),a,e);return n.createReadStream(t)}}},function(e,t,r){"use strict";const i=r(2),n=r(0),s=r(25),a=r(7),o=r(17).Listner,u=r(19),c=new n.PlutoSchema({name:{type:String,required:!0},username:{type:String,required:!0,unique:!0},email:{type:String,lowercase:!0,unique:!0,required:!0},location:{type:String,required:!0},password:{type:String,select:!1,required:!1},image:{type:String,required:!1},trusted:{type:String,default:"yes",enum:["yes","no"]},role:{type:String,default:"member",enum:["member","manager","admin","master"]},status:{type:String,default:"inactive",enum:["active","inactive","blocked"]}},{timestamps:!0});c.pre("save",function(e){let t=this;if(!t.isModified("password"))return e();s.hash(t.password,(r,i)=>{t.password=i,e(r)})}),c.post("findOneAndRemove",function(e){e&&a.remove(e.image)}),c.methods.comparePassword=function(e){return s.verify(e,this.password)},c.statics.rules={name:"required|maxLength:50",email:"required|email",username:"required|maxLength:15|minLength:3",password:"minLength:5",role:"in:admin,member,manager",status:"in:active,blocked,inactive",trusted:"in:yes,no",location:"required|maxLength:100",image:"media"},e.exports.get=(e=>i.connection(e).model("User",c)),o.on("user.created",function(e,t){e.password=null,u.template(e.email,"Account Information","user.new",{user:e,password:t})}),o.on("user.updated",function(){}),o.on("user.status.changed",function(){}),o.on("user.deleted",function(){}),o.on("user.password.reset",function(e,t){u.template(e.email,"Password Reset Request","user.reset-password",{user:e,password:t})})},function(e,t){e.exports=require("bcrypt")},function(e,t){e.exports=require("path")},function(e,t,r){const i=r(29);e.exports=new i({enable:process.env.LOGING||!1,mode:process.env.MODE})},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(9),r(7)),a=new n.Schema({price:{type:Number,required:!0},duration:{type:Number,required:!0},period:{type:String,required:!0,enum:["day","month","year"]}}),o=new n.PlutoSchema({title:{type:String,required:!0},description:String,image:{type:String,required:!1},plans:[a],status:{type:String,default:"inactive",enum:["active","inactive"]}},{timestamps:!0});o.statics.rules={title:"required|maxLength:50",status:"in:active,inactive",image:"media"},o.post("findOneAndRemove",function(e){e&&s.remove(e.image)}),e.exports.get=(e=>i.connection(e).model("Membership",o))},function(e,t){e.exports=require("koa-router")},function(e,t,r){const i=r(1),n=r(16),s=r(8).get(),a=r(0);e.exports=class{static async init(e,t){try{const r=i.decode(e.request.headers["x-token"]||e.query.token||"");if(!r)return e.throw(400,"Invalid token.",t);if(r.header.exp<n().unix())return e.throw(400,"Token is expired.",t);let o=await s.findOne({_id:a.Types.ObjectId(r.payload.id)});if(!o)return e.throw(401,t);e.request.user=o,await t()}catch(t){e.throw(503,"Internal Server Error",t)}}static async master(e,t){if(!e.request.user||"master"!=e.request.user.role)return e.throw(401,t);await t()}static async admin(e,t){if(!e.request.user||["master","admin"].indexOf(e.request.user.role)<0)return e.throw(401,t);await t()}static async manager(e,t){if(!e.request.user||["master","admin","manager"].indexOf(e.request.user.role)<0)return e.throw(401,t);await t()}static async member(e,t){if(!e.request.user||["master","admin","manager","member"].indexOf(e.request.user.role)<0)return e.throw(401,t);await t()}}},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(9),r(7)),a=new n.PlutoSchema({name:{type:String,required:!0},description:{type:String,required:!0},video_link:{type:String,required:!0},image:{type:String,required:!1},target_muscle:{type:String,required:!0},equipment_type:{type:String,required:!0},exercise_type:{type:String,required:!0},mechanics_type:{type:String,required:!0},level:{type:String,required:!0}},{timestamps:!0});a.statics.rules={name:"required|maxLength:50",description:"required|maxLength:500",video_link:"required|maxLength:100",target_muscle:"required|maxLength:50",equipment_type:"required|maxLength:50",exercise_type:"required|maxLength:50",mechanics_type:"required|maxLength:50",level:"required|maxLength:50"},a.post("findOneAndRemove",function(e){e&&s.remove(e.image)}),e.exports.get=(e=>i.connection(e).model("Exercise",a))},function(e,t){e.exports=require("moment")},function(e,t,r){const i=new(r(23).EventEmitter);e.exports=class{static emit(){return i.emit(...arguments)}static dispatch(){return this.emit(...arguments)}},e.exports.Listner=class{static on(){i.on(...arguments)}}},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(9),r(7)),a=new n.PlutoSchema({title:{type:String,required:!0},description:{type:String,required:!0},calories:{type:Number,required:!0},protein:{type:Number,required:!0},carbs:{type:Number,required:!0},fat:{type:Number,required:!0}},{timestamps:!0});a.statics.rules={title:"required|maxLength:50",description:"required|maxLength:500",calories:"required|integer",carbs:"required|integer",protein:"required|integer",fat:"required|integer"},a.post("findOneAndRemove",function(e){e&&s.remove(e.image)}),e.exports.get=(e=>i.connection(e).model("Diet",a))},function(e,t,r){"use strict";const i=r(22),n=(r(6),r(21)),s=r(10);e.exports.template=class{};e.exports=new class{async template(e,t,r,i={}){try{let a=s.resolve(process.cwd(),"resources/mail",r.replace(".","/")+".ejs.html");i.subject=t;let o={to:e,subject:t,html:await n.renderFile(a,i)};return await this.transporter(o),!0}catch(e){console.error(e)}return!1}async system(e,t={}){}text(e,t,r){let i={to:e,subject:t,text:r};return this.transporter(i)}hmtl(e,t,r){let i={to:e,subject:t,html:n.render(r,data)};return this.transporter(i)}async transporter(e){return new Promise((t,r)=>{i.createTestAccount((n,s)=>{let a=i.createTransport({host:process.env.MAIL_HOST||"smtp.ethereal.email",port:process.env.MAIL_PORT||587,secure:process.env.MAIL_SECURE||!1,auth:{user:process.env.MAIL_USER||s.user,pass:process.env.MAIL_PASSWORD||s.pass}});e.from=process.env.MAIL_FROM||s.user,a.sendMail(e,(e,i)=>{if(e)return r(e),console.log(e);t(i),console.log("Message sent: %s",i.messageId)})})})}}},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(9),r(7)),a=new n.Schema({exercise:{id:{type:n.Schema.Types.ObjectId,required:!0},name:{type:String,required:!0}},day:{type:Number,required:!0},sets:{type:Number,required:!0},reps:{type:Number,required:!0},notes:{type:String,required:!1}}),o=new n.PlutoSchema({title:{type:String,required:!0},subtitle:String,schedule:[a],image:{type:String,required:!1}},{timestamps:!0});o.statics.rules={title:"required|maxLength:50",subtitle:"maxLength:100",image:"media"},o.post("findOneAndRemove",function(e){e&&s.remove(e.image)}),o.statics.scheduleRules={day:"required|integer|min:1|max:7",sets:"required|integer",reps:"required|integer",notes:"maxLength:300"},e.exports.get=(e=>i.connection(e).model("Workout",o))},function(e,t){e.exports=require("ejs")},function(e,t){e.exports=require("nodemailer")},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("mkdirp")},function(e,t,r){bcrypt=r(9),e.exports.hash=function(e,t){let r=t||function(){};return new Promise((t,i)=>{bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR)||10,function(n,s){n&&(r(n),i(n)),bcrypt.hash(e,s,function(e,n){e&&(r(e),i(e)),r(e,n),t(n)})})})},e.exports.verify=function(e,t){return new Promise((r,i)=>{bcrypt.compare(e,t,function(e,t){if(e)return i(e);r(t)})})}},function(e,t){e.exports=require("util")},function(e,t,r){const i=r(0);function n(){i.Schema.apply(this,arguments),this.query.fail=async function(e){let t=await this.exec();return t||e.throw(404,this.model.modelName+" not found")},this.query.paginate=function(e){let t=e.perPage(),r=Math.max(0,e.request.query.page-1),i=this.toConstructor();return new Promise((n,s)=>{this.count().exec(function(a,o){a&&s(a),i().limit(t).skip(t*r).exec(function(i,a){i&&s(i),e.meta.pagination={totalRecords:o,currentPage:r+1,totalPages:Math.ceil(o/t),itemsPerPage:t},n(a)})})})}}r(26).inherits(n,i.Schema),i.PlutoSchema=n},function(e,t){e.exports=require("chalk")},function(e,t,r){const i=r(28);e.exports=class{constructor(e){this.canWrite=e.enable||!1,this.mode=e.mode||"verbose",this.consoleLogger="verbose"==this.mode,this.fileLogger=e.fileLogger||!0,this.nl=e.nl||"\n",this.path=e.path,this._prefix=e.prefix||""}prefix(e){this._prefix=e}enable(){this.canWrite=!0}disable(){this.canWrite=!1}verbose(){this.mode="verbose",this.consoleLogger=!0}error(){this.write("error",arguments)}debug(){this.write("debug",arguments)}warn(){this.write("warn",arguments)}warning(){this.write("warn",arguments)}info(){this.write("info",arguments)}write(e,t){if(this.canWrite)return"String"==typeof t&&(t={0:t}),t=Object.values(t),"error"==e?(t.unshift("red"),void this.writeToConsole.apply(this,t)):"info"==e?(t.unshift("magenta"),void this.writeToConsole.apply(this,t)):"debug"==e?(t.unshift("green"),void this.writeToConsole.apply(this,t)):"warn"==e?(t.unshift("yellow"),void this.writeToConsole.apply(this,t)):void 0}writeToConsole(e,...t){if(this.consoleLogger&&arguments.length)for(let r in t)console.log(i[e](this._prefix+t[r]))}writeToFile(){this.fileLogger}}},function(e,t){e.exports=require("dotenv")},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(9),new n.PlutoSchema({user_id:{type:n.Schema.Types.ObjectId,required:!0},sex:{type:String,required:!1,enum:["male","female","other"]},dob:{type:Date,required:!1},active_membership:{membership_id:{type:n.Schema.Types.ObjectId},plan_id:{type:n.Schema.Types.ObjectId},title:{type:String},expiry:Date},active_workout:{id:{type:n.Schema.Types.ObjectId},title:{type:String}},active_diet:{id:{type:n.Schema.Types.ObjectId},title:{type:String}},goal:{type:String}},{timestamps:!0}));e.exports.get=(e=>i.connection(e).model("Profile",s))},function(e,t,r){"use strict";const i=r(2),n=r(0),s=(r(6),r(10),new n.PlutoSchema({type:{type:String,required:!0},path:{type:String,required:!0}},{timestamps:!0}));s.statics.rules={type:"required|in:image",file:"required|size:3mb|mime:png,jpg"},e.exports.get=(e=>i.connection(e).model("Media",s))},function(e,t){e.exports=require("crypto")},function(e,t,r){"use strict";const i=r(2),n=r(0),s=new n.Schema({userId:n.Schema.Types.ObjectId,platform:{type:String,default:"web",enum:["web","android","ios","api"]},apiSignature:{type:String,required:!0},tokenType:{type:String,default:"ApiToken"},deviceToken:{type:String,default:null,required:!1},deviceInfo:{type:String,default:null,required:!1},expires:Date,issuedAt:Date},{timestamps:!0});e.exports.get=(e=>i.connection(e).model("Device",s))},function(e,t){e.exports=require("stream")},function(e,t,r){"use strict";const i=r(20).get(),n=r(15).get();e.exports=class{async index(e,t){try{let r=await i.find({}).paginate(e);e.out({workouts:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"title","subtitle","image"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await new i(r).save();e.out({workout:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"title","subtitle","image"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==n)return e.throw(404,"Workout not found");e.out({workout:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{if(!await i.findOneAndRemove({_id:e.params.id}))return e.throw(404,"Workout not found");e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async single(e,t){try{let r=await i.findOne({_id:e.params.id});r||e.throw(404,"Workout not found"),e.out({workout:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async addExercise(e,t){let r=e.pick(e.request.body,"day","sets","reps","notes","exercise"),s=await e.validate(r,i.scheduleRules);if(!await s.check())return e.errors(s.errors,t);try{let[s,a]=await Promise.all([i.findOne({_id:e.params.workout_id}),n.findOne({_id:r.exercise})]);s||e.throw(400,"Workout does not exist"),a||e.throw(400,"Exercise does not exist"),r.exercise={id:a._id,name:a.name},s=await i.findOneAndUpdate({_id:e.params.workout_id},{$push:{schedule:r}},{new:!0}),e.out({schedule:s.schedule},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async removeExercise(e,t){try{let r=await i.findOne({_id:e.params.workout_id}).fail(e);r.schedule.id(e.params.exercise_id).remove(),await r.save(),e.out({schedule:r.schedule},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/workout"}),n=new(r(36)),s=r(14);i.get("/",s.init,s.manager,n.index),i.get("/:id",s.init,s.manager,n.single),i.post("/",s.init,s.manager,n.create),i.put("/:id",s.init,s.manager,n.update),i.delete("/:id",s.init,s.manager,n.delete),i.put("/exercise/:workout_id",s.init,s.manager,n.addExercise),i.delete("/exercise/:workout_id/:exercise_id",s.init,s.manager,n.removeExercise),e.exports=i},function(e,t,r){"use strict";r(12).get();const i=r(20).get(),n=r(15).get(),s=r(18).get(),a=r(8).get();e.exports=class{async index(e,t){switch(e.request.user.role){case"master":case"admin":case"manager":return(async()=>{let[r,o,u,c]=await Promise.all([i.count().exec(),n.count().exec(),s.count().exec(),a.count({role:"member"}).exec()]);e.out({count:{workout:r,exercise:o,diet:u,user:c}},t)})();case"member":return(async()=>{})();default:e.throw(401,t)}}}},function(e,t){e.exports=require("rand-token")},function(e,t,r){"use strict";const i=r(2),n=r(0),s=new n.Schema({userId:[{type:n.Schema.Types.ObjectId,ref:"User"}],token:{type:String,required:!0},expiry:{type:String,required:!0},issuedAt:Date},{timestamps:!0});e.exports.get=(e=>i.connection(e).model("Token",s))},function(e,t,r){"use strict";const i=r(8).get(),n=(r(40).get(),r(16));r(39).generate(16);const s=r(31).get(),a=r(12).get(),o=r(20).get(),u=r(18).get(),c=["security","personal","image"],d=r(32).get(),l=r(0);const p={security:async(e,t)=>{let r=e.pick(e.request.body,"email","password"),i=await e.validate(r,{email:"requiredWithout:password|email",password:"requiredWithout:email"});return await i.check()?r.email?(e.request.user.email=r.email,e.request.user.save(),e.out({},t)):r.password?(e.request.user.password=r.password,e.request.user.save(),e.out({},t)):void 0:e.errors(i.errors,t)},image:async(e,t)=>{e.pick(e.request.body,"file","type");let r=await e.validate(props,d.rules);if(!await r.check())return e.errors(r.errors,t);const i=d.move(props.file.path);try{e.request.user.image=i,await e.request.user.save(),e.out({media:{type:props.type,path:i}},t)}catch(t){d.remove(i),e.throw(503,"Internal Server Error",t)}},personal:async(e,t)=>{let r=e.pick(e.request.body,"name","dob","sex");r.dob&&(r.dob=n(r.dob,"YYYY-MM-DD").toISOString());try{let i=await s.findOne({user_id:e.request.user._id});i||((i=new s).user_id=e.request.user._id),i.dob=r.dob,i.sex=r.sex,e.request.user.name=r.name,await Promise.all([i.save(),e.request.user.save()]),e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}};e.exports=class{async updatePassword(e,t){let r=e.pick(e.request.body,"password"),n=await e.validate(r,{password:"required"});if(!await n.check())return e.errors(n.errors,t);try{if(null==await i.findOneAndUpdate({_id:e.request.user._id},r))return e.throw(404,"User not found");e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async addMembership(e,t){let r=e.pick(e.request.body,"user_id","membership_id","plan_id","expiry");r.user_id=l.Types.ObjectId(r.user_id),r.membership_id=l.Types.ObjectId(r.membership_id),r.plan_id=l.Types.ObjectId(r.plan_id);try{let[o,u]=await Promise.all([a.findOne({_id:r.membership_id,status:"active"}).select("_id title plans"),i.findOne({_id:r.user_id}).select("_id")]);o||e.throw(400,"Membership does not exist"),u||e.throw(400,"User does not exist");let c=null;for(let e in o.plans)if(o.plans[e]._id==r.plan){c=e;break}null===c&&e.throw(400,"Plan does not exist");let d={membership_id:r.membership_id,title:o.title,plan_id:r.plan_id,expiry:n(r.expiry,"YYYY-MM-DD").toISOString()};r.active_membership=d;let l=await s.update({user_id:r.user_id},r,{upsert:!0});e.out({profile:l},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async addWorkout(e,t){let r=e.pick(e.request.body,"user_id","diet_id","workout_id","goal");try{let[n,a,c]=await Promise.all([u.findOne({_id:r.diet_id}).select("_id title"),i.findOne({_id:r.user_id}).select("_id"),o.findOne({_id:r.workout_id}).select("_id title")]);n||e.throw(400,"Diet does not exist"),a||e.throw(400,"User does not exist"),c||e.throw(400,"Workout does not exist");let d={id:c._id,title:c.title},l={id:n._id,title:n.title},p=await s.update({user_id:e.request.body.user_id},{active_workout:d,active_diet:l,goal:r.goal},{upsert:!0});e.out({profile:p},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async index(e,t){try{let r=await s.findOne({user_id:e.request.user._id});r&&(r=r.toObject()),e.out({profile:e.pick(Object.assign({section:"personal"},r||{},e.request.user.toObject()),"name","dob","sex","email","image","section")},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"section");return c.indexOf(r.section)<0?e.throw(400,"Invalid profile section."):p[r.section](e,t)}async search(e,t){try{let r=await i.findOne({$or:[{email:e.query.keywords},{username:e.query.keywords}]});if(!r)return e.throw(404,"User not found");let n=await s.findOne({user_id:r._id});e.out({user:r,profile:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=r(8).get(),n=(r(31).get(),r(17));e.exports=class{async index(e,t){try{let r=await i.find({}).paginate(e);e.out({users:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"name","email","image","trusted","role","status","location");delete i.rules.username;let s=await e.validate(r,i.rules);if(!await s.check())return e.errors(s.errors,t);try{if(await i.findOne({email:e.request.body.email,_id:{$ne:e.params.id}}).select("email"))return e.errors({email:{message:"Email already exist."}},t);let s=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==s)return e.throw(404,"User not found");e.out({user:s},t),n.emit("user.updated",s)}catch(t){e.throw(503,"Internal Server Error",t)}}async statusUpdate(e,t){let r=e.pick(e.request.body,"status"),s=await e.validate(r,{status:"required|in:active,blocked,inactive"});if(!await s.check())return e.errors(s.errors,t);try{let s=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==s)return e.throw(404,"User not found");e.out({user:s},t),n.emit("user.status.changed",s)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"name","email","username","image","trusted","role","status","location","password"),s=await e.validate(r,i.rules);if(!await s.check())return e.errors(s.errors,t);try{let s=await i.find({$or:[{email:e.request.body.email},{username:e.request.body.username}]}).limit(2).select("email username");if(s.length){let r=[];for(let e in s)r.push(s[e].email),r.push(s[e].username);let i={};if(r.indexOf(e.request.body.email)>=0&&(i.email={message:"Email already exist"}),r.indexOf(e.request.body.username)>=0&&(i.username={message:"UserName already exist"}),void 0!=typeof i.username||void 0!=typeof i.email)return e.errors(i,t)}r.password||(r.password=Math.floor(990001*Math.random())+1e4,r.password=r.password.toString(16).toUpperCase());let a=await new i(r).save();e.out({user:a},t),n.emit("user.created",a,r.password)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{let r=await i.findOneAndRemove({_id:e.params.id,role:{$ne:"master"}});if(!r)return e.throw(404,"User not found");e.out({},t),n.emit("user.deleted",r)}catch(t){e.throw(503,"Internal Server Error",t)}}async single(e,t){try{let r=await i.findOne({_id:e.params.id});r||e.throw(404,"User not found"),e.out({user:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=r(14),n=new(r(13)),s=r(42),a=r(41),o=r(38),u=new s,c=new a,d=new o;n.opts.prefix="/user",n.get("/",i.init,i.manager,u.index),n.get("/:id",i.init,i.manager,u.single),n.post("/",i.init,i.admin,u.create),n.put("/:id",i.init,i.admin,u.update),n.put("/status/:id",i.init,i.manager,u.statusUpdate),n.delete("/:id",i.init,i.admin,u.delete),n.opts.prefix="/profile",n.get("/",i.init,c.index),n.get("/find",i.init,i.manager,c.search),n.put("/",i.init,c.update),n.put("/addMembership",i.init,i.manager,c.addMembership),n.put("/addWorkout",i.init,i.manager,c.addWorkout),n.put("/password",i.init,c.updatePassword),n.opts.prefix="/dashboard",n.get("/",i.init,d.index),e.exports=n},function(e,t,r){"use strict";const i=r(12).get();r(0);e.exports=class{async index(e,t){try{let r=await i.findOne({_id:e.params.membership}).select("plans").fail(e);e.out({plans:r.plans},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"price","duration","period"),n=await e.validate(r,{price:"required|integer",duration:"required|integer",period:"required|in:day,month,year"});if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOne({_id:e.params.membership}).fail(e),s=null;for(let t in n.plans)if(n.plans[t]._id==e.params.plan){s=t;break}null===s&&e.throw(404,"Plan not found"),r=Object.assign(n.plans[s],r),n.plans[s]=r,await n.save(),e.out({membership:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"price","duration","period"),n=await e.validate(r,{price:"required|integer",duration:"required|integer",period:"required|in:day,month,year"});if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOne({_id:e.params.membership});if(!n)return e.throw(404,"Membership not found");for(let t in n.plans){let i=n.plans[t];if(i.duration==r.duration&&i.period==r.period)return e.throw(400,"Duplicate plan")}if(null==(n=await i.findOneAndUpdate({_id:e.params.membership},{$push:{plans:r}},{new:!0})))return e.throw(404,"Membership not found");e.out({membership:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{let r=await i.findOne({_id:e.params.membership}).fail(e);r.plans.id(e.params.plan).remove(),await r.save(),e.out({membership:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=r(12).get();e.exports=class{async index(e,t){let r={};e.query.keywords&&(r.title=new RegExp(e.query.keywords,"i")),e.query.status&&(r.status=e.query.status);try{let n=await i.find(r).paginate(e);e.out({memberships:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"title","description","image"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==n)return e.throw(404,"Membership not found");e.out({membership:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"title","description","image"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await i(r).save();e.out({membership:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{if(!await i.findOneAndRemove({_id:e.params.id}))return e.throw(404,"Membership not found");e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async single(e,t){try{let r=await i.findOne({_id:e.params.id});r||e.throw(404,"Membership not found"),e.out({membership:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async updateStatus(e,t){let r=e.pick(e.request.body,"status");try{let n=await i.findOne({_id:e.params.id}).select("_id plans");n||e.throw(404,"Membership not found"),"active"==r.status&&n.plans.length<=0&&e.throw(400,"No Plan Exist"),n=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0}),e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/membership"}),n=r(45),s=r(44),a=new n,o=new s,u=r(14);i.get("/",u.init,u.manager,a.index),i.get("/:id",u.init,u.manager,a.single),i.post("/",u.init,u.master,a.create),i.patch("/:id/status",u.init,u.master,a.updateStatus),i.put("/:id",u.init,u.master,a.update),i.delete("/:id",u.init,u.master,a.delete),i.get("/:membership/plan",u.init,u.manager,o.index),i.post("/:membership/plan",u.init,u.master,o.create),i.put("/:membership/plan/:plan",u.init,u.master,o.update),i.delete("/:membership/plan/:plan",u.init,u.master,o.delete),e.exports=i},function(e,t,r){"use strict";const i=r(32).get(),n=r(7);r(6);e.exports=class{async create(e,t){let r=e.pick(e.request.body,"type","file"),s=await e.validate(r,i.rules);if(!await s.check())return e.errors(s.errors,t);const a=n.move(r.file.path);try{e.out({media:{type:r.type,path:a}},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async remove(e,t){try{n.remove(e.query.file),e.out({},t)}catch(r){e.out({},t)}}async single(e,t){let r=n.stream(e.query.file);e.body=r}async update(e,t){let r=e.pick(e.request.body,"type","file"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);e.out({properties:r},t)}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/media"}),n=new(r(47)),s=r(14);i.get("/",n.single),i.post("/",s.init,n.create),i.delete("/",s.init,n.remove),e.exports=i},function(e,t,r){"use strict";const i=r(15).get();e.exports=class{async index(e,t){try{let r=e.pick(e.query,"name","target_muscle","level");r.name&&(r.name=new RegExp(r.name,"i"));let n=await i.find(r).sort({createdAt:-1,title:1}).paginate(e);e.out({exercises:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"name","description","video_link","image","target_muscle","equipment_type","exercise_type","mechanics_type","level"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await new i(r).save();e.out({exercise:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"name","description","video_link","image","target_muscle","equipment_type","exercise_type","mechanics_type","level"),n=await e.validate(r,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==n)return e.throw(404,"Exercise not found");e.out({exercise:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{if(!await i.findOneAndRemove({_id:e.params.id}))return e.throw(404,"Exercise not found");e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async single(e,t){try{let r=await i.findOne({_id:e.params.id}).fail(e);e.out({exercise:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async search(e,t){try{let r=await i.find({});e.out({excercises:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/exercise"}),n=new(r(49)),s=r(14);i.get("/",s.init,s.manager,n.index),i.get("/:id",s.init,s.member,n.single),i.post("/",s.init,s.admin,n.create),i.put("/:id",s.init,s.admin,n.update),i.delete("/:id",s.init,s.admin,n.delete),e.exports=i},function(e,t,r){"use strict";const i=r(18).get();e.exports=class{async index(e,t){try{let r=e.pick(e.query,"title"),n=await i.find(r).paginate(e);e.out({diet:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async create(e,t){let r=e.pick(e.request.body,"title","description","calories","protein","carbs","fat"),n=await e.validate(e.request.body,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await new i(r).save();e.out({diet:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async update(e,t){let r=e.pick(e.request.body,"title","description","calories","protein","carbs","fat"),n=await e.validate(e.request.body,i.rules);if(!await n.check())return e.errors(n.errors,t);try{let n=await i.findOneAndUpdate({_id:e.params.id},r,{new:!0});if(null==n)return e.throw(404,"Diet not found");e.out({diet:n},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async delete(e,t){try{if(!await i.findOneAndRemove({_id:e.params.id}))return e.throw(404,"Diet not found");e.out({},t)}catch(t){e.throw(503,"Internal Server Error",t)}}async single(e,t){try{let r=await i.findOne({_id:e.params.id}).fail(e);e.out({diet:r},t)}catch(t){e.throw(503,"Internal Server Error",t)}}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/diet"}),n=r(14),s=new(r(51));i.get("/",n.init,n.manager,s.index),i.post("/",n.init,n.admin,s.create),i.put("/:id",n.init,n.admin,s.update),i.delete("/:id",n.init,n.admin,s.delete),i.get("/:id",n.init,n.member,s.single),e.exports=i},function(e,t,r){const i=r(17),n=r(8).get();e.exports=(async(e,t)=>{let r=e.pick(e.request.body,"email"),s=await e.validate(r,{email:"required|email"});if(!await s.check())return e.errors(s.errors,t);try{let s={};e.request.body.member||(s.role={$ne:"member"}),s.email=r.email;let a=await n.findOne(s);a||e.throw(400);let o=Math.floor(990001*Math.random())+1e4;o=o.toString(16).toUpperCase(),a.password=o,await a.save(),e.out({},t),i.emit("user.password.reset",a,o)}catch(t){e.throw(503,"Internal Server Error",t)}})},function(e,t,r){"use strict";const i=r(8).get(),n=r(34).get(),s=r(1),a=r(16);e.exports=class{async index(e,t){let r=await e.validate(e.request.body,{email:"email|requiredWithout:username",username:"requiredWithout:email",password:"required",platform:"required|in:web,ios,android",deviceToken:"requiredNotIf:platform,web"});if(!await r.check())return e.errors(r.errors,t);try{let r=!1,o={};if(e.request.body.member||(o.role={$ne:"member"}),e.request.body.email?(o.email=e.request.body.email,r=await i.findOne(o).select("+password email username name status")):(o.username=e.request.body.username,r=await i.findOne(o).select("+password email username name status")),!r)return e.abort(403,"Username or password is incorrect.",t);if(await r.comparePassword(e.request.body.password)){if("active"!=r.status)return e.abort(403,"Your account is either Inactive or Blocked.",t);r.password=void 0;let i=new s({id:r._id,email:r.email,username:r.username}).generate().apiToken().expiry(1,"days",!0).unique().get();return await new n({userId:r._id,platform:e.request.body.platform,apiSignature:i.signature,tokenType:i.type,expires:a.unix(i.expires),issuedAt:a.unix(i.issuedAt)}).save(),e.meta.token=i.token,e.out({user:r},t)}return e.abort(401,"Username or password is incorrect.",t)}catch(t){console.error(t),e.throw(422)}}}},function(e,t,r){"use strict";const i=new(r(13))({prefix:"/auth"}),n=r(54),s=r(53),a=(r(19),r(14),new n);i.post("/login",a.index),i.post("/forgot-password",s),e.exports=i},function(e,t,r){process.cwd();const i=r(13),n=(r(11),new i({prefix:"/v1"}));let s=[r(55),r(52),r(50),r(48),r(46),r(43),r(37)];e.exports=(async e=>{await s.forEach(function(e){e&&e.routes&&n.use(e.routes(),e.allowedMethods())}),e.use(n.routes())})},function(e,t){e.exports=require("http")},function(e,t){e.exports=require("http-errors")},function(e,t,r){const i=r(58),n=r(11);e.exports=(async(e,t)=>{e.meta={},e.throw=function(...e){throw e.length>=3&&e[2]instanceof Error&&"false"==process.env.DEBUG&&(n.error(e[2]),e.splice(2,1)),i(...e)},e.pick=((e,...t)=>null==e?{}:Object.keys(e).length<=0?{}:t.reduce((t,r)=>(void 0===e.fields&&Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]),void 0!==e.files&&(e.fields.hasOwnProperty(r)&&(t[r]=e.fields[r]),e.files.hasOwnProperty(r)&&(t[r]=e.files[r])),t),{})),e.perPage=(t=>(e.request.query.page=parseInt(e.request.query.page),e.request.query.page||(e.request.query.page=1),parseInt(e.request.query.limit||t||process.env.PER_PAGE_LIMIT||15))),e.out=(async(t,r)=>{if(!r||void 0===r)throw new Error("Next not passed.");if(!(t instanceof Object))throw new Error("Invalid data type for context body.");e.status=200,e.data=t,await r()}),e.errors=(async(t,r)=>{if(!r||void 0===r)throw new Error("Next not passed.");e.data={errors:t},e.status=422,await r()}),e.abort=(async(t,r,i)=>{if(!i||void 0===i)throw new Error("Next not passed.");e.status=t||404,e.aborted=!0,e.data=r,await i()}),await t()}),e.exports.preg="0x3114442|0x1332|0x2342|0x4214|0x12132"},function(e,t){e.exports=require("node-input-validator")},function(e,t){e.exports=require("koa-res")},function(e,t){e.exports=require("koa-convert")},function(e,t){e.exports=require("koa-body")},function(e,t){e.exports=require("koa-logger")},function(e,t){e.exports=require("koa-static")},function(e,t){e.exports=require("koa")},function(e,t,r){"use strict";const i=r(66),n=r(65),s=r(64),a=r(63),o=(r(62),r(61),r(60)),u=r(11),c=r(2),d=r(59),l=r(10),p=(r(57),r(56)),m=r(35),h=r(7);o.messages({media:"The media is invalid."}),o.extend("media",async function(e,t){return!!h.exists(t)||(this.validator.addError(e,"media"),!1)});c.connection();const f=new i;f.options={host:"localhost",port:80,path:"/upload",method:"POST"},f.use(async(e,t)=>{const r={allowMethods:["GET","PUT","POST","PATCH","DELETE","HEAD","OPTIONS"],origin:"*",credentials:!1,allowHeaders:["Content-Type","Authorization","Accept","x-token"]};if(e.set("Access-Control-Allow-Origin",r.origin),"OPTIONS"===e.method){if(!e.get("Access-Control-Request-Method"))return await t();r.maxAge&&e.set("Access-Control-Max-Age",String(r.maxAge)),!0===r.credentials&&e.set("Access-Control-Allow-Credentials","true"),r.allowMethods&&e.set("Access-Control-Allow-Methods",r.allowMethods.join(",")),r.allowHeaders?e.set("Access-Control-Allow-Headers",r.allowHeaders.join(",")):e.set("Access-Control-Allow-Headers",e.get("Access-Control-Request-Headers")),e.status=204}else{!0===r.credentials&&("*"===origin?e.remove("Access-Control-Allow-Credentials"):e.set("Access-Control-Allow-Credentials","true")),r.exposeHeaders&&e.set("Access-Control-Expose-Headers",r.exposeHeaders.join(","));try{await t()}catch(e){throw e}}}),f.use(s()),f.use(o.koa()),f.use(d),p(f),f.use(a({multipart:!0,formidable:{maxFileSize:5242880,keepExtensions:!0}})),f.use(n(l.resolve(process.cwd(),"public"))),f.use(async(e,t)=>{try{await t()}catch(t){u.info("Error emitted by application."),e.status=t.status||500,e.body=t.message,e.app.emit("error",t,e)}}),f.use(async(e,t)=>{if(await t(),e.body instanceof m.Readable)return;let r=Object.assign({version:"0.1.0",timestamp:new Date},e.meta||{});[200,422].indexOf(e.status)>=0?e.body=Object.assign({meta:r},e.data):e.data&&404!=e.status&&(e.body=e.data)}),e.exports=f},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t,r){const i=r(30).config();if(i.error)throw i.error;const n=r(67);r(11).info("Serve will listen on port: "+(process.env.PORT||3e3)),e.exports=n.listen(process.env.PORT||3e3)}]);