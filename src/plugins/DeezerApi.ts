import { log } from 'util';
import axios from 'axios';
const NRrequest = require('request')
const request = require('requestretry').defaults({
  maxAttempts: 2147483647,
  retryDelay: 1000,
  timeout: 8000
})
const crypto = require('crypto');
var rp = require('promise-request-retry');
const os = require('os');
const fs = require("fs-extra");
const path = require('path');

export class Deezer {
    
    userdata:any
    homedata:any
    logsLocation:any
    configFile:any
    userId:any
    apiUrl = 'http://www.deezer.com/ajax/gw-light.php'
    apiQueries= {
        api_version: '1.0',
        api_token: 'null',
        input: '3'
    }
    params = {
        "api_version": "1.0",
        "api_token": "null",
        "input": "3",
        "method": "deezer.getUserData"
    }
    checkform:any
    httpHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36',
        'Content-Language': 'en-US',
        'Cache-Control': 'max-age=0',
        'Accept': '*/*',
        'Accept-Charset': 'utf-8,ISO-8859-1;q=0.7,*;q=0.3',
        'Accept-Language': 'de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4'
    }
    albumPicturesHost = 'https://e-cdns-images.dzcdn.net/images/cover/'

    constructor(amir: String) {
        this.userId = amir

        if(process.env.APPDATA){
        this.userdata = process.env.APPDATA + path.sep + "Deezloader\\";
        this.homedata = os.homedir();
        }else if(process.platform == "darwin"){
        this.homedata = os.homedir();
            this.userdata = this.homedata + '/Library/Application Support/Deezloader/';
        }else if(process.platform == "android"){
            this.homedata = os.homedir() + "/storage/shared";
            this.userdata = this.homedata + "/Deezloader/";
        }else{
            this.homedata = os.homedir();
            this.userdata = this.homedata + '/.config/Deezloader/';
        }
    
    this.logsLocation = this.userdata+"logs.log";
    
    if(!fs.existsSync(this.userdata+"config.json")){

      fs.outputFileSync(this.userdata+"config.json",fs.readFileSync("./default.json",'utf8'));
    }
    
    this.configFile = require("./default.json");
    
    if(typeof this.configFile.userDefined.numplaylistbyalbum != "boolean" || typeof this.configFile.userDefined.syncedlyrics != "boolean" || typeof this.configFile.userDefined.padtrck != "boolean" || typeof this.configFile.userDefined.albumNameTemplate != "string"){
        fs.outputFileSync(this.userdata+"config.json",fs.readFileSync("./default.json",'utf8'));
        this.configFile = require(this.userdata+path.sep+"config.json");
    }
       
    }

    name():any{
      return this.userId
    }



    login(username: string, password: string, callback: { (arg0: Error): void;(arg1: any):any  }){
       
          
        NRrequest.get({url: this.apiUrl, headers: this.httpHeaders, qs: Object.assign({method:"deezer.getUserData"},this.apiQueries), json: true, jar: true}, 
         (function(err: any, res: { statusCode: number; }, body: { results: { checkForm: string; checkFormLogin: any; }; }) {
            if(!err && res.statusCode == 200) {

                
                this.apiQueries.api_token = body.results.checkForm;
                localStorage.setItem('api_token',body.results.checkForm)
                NRrequest.post({url: "https://www.deezer.com/ajax/action.php", headers: this.httpHeaders, form: {type:'login',mail:username,password:password,checkFormLogin:body.results.checkFormLogin}, jar: true}, 
                (function(err: any, res:any, body: { indexOf: (arg0: string) => number; }) {
                  
                    if(err || res.statusCode != 200) {
                       //console.log("Unable to load deezer.com")//
                        callback(new Error("Unable to load deezer.com"));
                    }else if(body.indexOf("success") > -1){
                       
                        request.get({
                            url: 'https://www.deezer.com/',
                            headers: this.httpHeaders,
                            jar: true
                          }, function (err: any, res: { statusCode: number; }, body: string) {
                            if (!err && res.statusCode == 200) {
                                                      
                                // GET USER ID
                                const userRegex = new RegExp(/{"USER_ID":"?([^",]*)/g)
                                const userId = userRegex.exec(body)[1]
                                localStorage.setItem('userId',userId)
                                //resolve(true);
                                callback(true);
                               
                            } else {
                              callback(new Error('Unable to load deezer.com'))
                            }
                          })

                    }else{
                      // console.log("Incorrect email or password.")// 
                      callback(new Error("Incorrect email or password."));
                    }
                    
                }));
            } else {
               //console.log("Unable to load deezer.com")// 
               callback(new Error("Unable to load deezer.com"));
            }
        }).bind(this));
  

   }

   getMyPlaylists(userId: string, callback: { (arg0: any): void; (arg0: null, arg1: Error): void; }) {
	var self = this;
	this.getJSON(`https://api.deezer.com/user/${userId}/playlists`, function(res: any){
		if (!(res instanceof Error)){
			callback(res);
		} else {
			callback(null, res)
		}
	})
   }

   search(text: string, type: string, callback: { (arg0: null, arg1: Error): void; (arg0: any): void; (arg0: null, arg1: Error): void; }) {
	if(typeof type === "function") {
		callback = type;
		type = "";
	} else {
		type += "?";
	}

	request.get({url: "https://api.deezer.com/search/?q=" + text, headers: this.httpHeaders, jar: true}, function(err: any, res: { statusCode: number; }, body: string) {
		if(!err && res.statusCode == 200) {
			var json = JSON.parse(body);
			if(json.error) {
				callback(null, new Error("Wrong search type/text: " + text));
				return;
			}
			callback(json);
		} else {
			callback(null, new Error("Unable to reach Deezer API"));
		}
    });
    
}


getTrack(id: string, callback: { (arg0: Error): void; (arg0: any): void; (arg0: Error): void; (arg0: Error): void; (arg0: Error): void; (arg0: Error): void; (arg0: any): void; (arg0: Error): void; }) {
	var scopedid = id;
	var self = this;
	request.get({url: "https://www.deezer.com/track/"+id, headers: this.httpHeaders, jar: true}, (function(err: any, res: { statusCode: number; }, body: string) {
		var regex = new RegExp(/<script>window\.__DZR_APP_STATE__ = (.*)<\/script>/g);
		var rexec = regex.exec(body);
        var _data;
        
		try{
			_data = rexec[1];
		}catch(e){
			if(self.apiQueries.api_token != "null"){
				request.post({url: this.apiUrl, headers: this.httpHeaders, qs: self.apiQueries, body: "[{\"method\":\"song.getListData\",\"params\":{\"sng_ids\":[" + scopedid + "]}}]", jar: true}, (function(err: any, res: { statusCode: number; }, body: string) {
					if(!err && res.statusCode == 200) {
						try{
                            var json = JSON.parse(body)[0].results.data[0];
                            
							if(json["TOKEN"]) {
								callback(new Error("Uploaded Files are currently not supported"));
								return;
							}
							var id = json["SNG_ID"];
							var md5Origin = json["MD5_ORIGIN"];
							var format;
							if(this.configFile.userDefined.hifi && json["FILESIZE_FLAC"] > 0){
								format = 9;
							}else{
								format = 3;
								if(json["FILESIZE_MP3_320"] <= 0) {
									if(json["FILESIZE_MP3_256"] > 0) {
										format = 5;
									} else {
										format = 1;
									}
								}
							}
							json.format = format;
							var mediaVersion = parseInt(json["MEDIA_VERSION"]);
							json.downloadUrl = self.getDownloadUrl(md5Origin, id, format, mediaVersion);
							callback(json);
						}catch(e){
							callback(new Error("Unable to get Track"));
							return;
						}
					} else {
						callback(new Error("Unable to get Track " + id));
					}
				}).bind(self));
			}else{
				callback(new Error("Unable to get Track"));
			}
			return;
        }
        

        
		if(!err && res.statusCode == 200 && typeof JSON.parse(_data)["DATA"] != 'undefined') {
			var json = JSON.parse(_data)["DATA"];
            var lyrics = JSON.parse(_data)["LYRICS"];
            
            console.log(json)
            
			if(lyrics){
				json["LYRICS_TEXT"] = lyrics["LYRICS_TEXT"];
				json["LYRICS_SYNC_JSON"] = lyrics["LYRICS_SYNC_JSON"];
				json["LYRICS_COPYRIGHTS"] = lyrics["LYRICS_COPYRIGHTS"];
				json["LYRICS_WRITERS"] = lyrics["LYRICS_WRITERS"];
			}
			if(json["TOKEN"]) {
				callback(new Error("Uploaded Files are currently not supported"));
				return;
			}
			var id = json["SNG_ID"];
			var md5Origin = json["MD5_ORIGIN"];
			var format;
			if(this.configFile.userDefined.hifi && json["FILESIZE_FLAC"] > 0){
				format = 9;
			}else{
				format = 3;
				if(json["FILESIZE_MP3_320"] <= 0) {
					if(json["FILESIZE_MP3_256"] > 0) {
						format = 5;
					} else {
						format = 1;
					}
				}
			}
			json.format = format;
			var mediaVersion = parseInt(json["MEDIA_VERSION"]);
			json.downloadUrl = self.getDownloadUrl(md5Origin, id, format, mediaVersion);
			this.getATrack(id,function(trckjson: { [x: string]: any; }){
				json["BPM"] = trckjson["bpm"];
				callback(json);
			});
		} else {
			callback(new Error("Unable to get Track " + id));
		}
	}).bind(self));
}

getATrack(id: string, callback: { (arg0: any): void; (arg0: null, arg1: Error): void; }) {
	this.getJSON("https://api.deezer.com/track/" + id, function(res: any){
		if (!(res instanceof Error)){
			callback(res);
		} else {
			callback(null, res)
		}
	});
}
getDownloadUrl = function(md5Origin: string, id: string, format: any, mediaVersion: any) {
    console.log(md5Origin)
	var urlPart :string = md5Origin + "¤" + format + "¤" + id + "¤" + mediaVersion;
	var md5sum = crypto.createHash('md5');
	md5sum.update(new Buffer(urlPart, 'binary'));
	var md5val = md5sum.digest('hex');
	urlPart = md5val + "¤" + urlPart + "¤";
	var cipher = crypto.createCipheriv("aes-128-ecb", new Buffer("jo6aey6haid2Teih"), new Buffer(""));
	var buffer = Buffer.concat([cipher.update(urlPart, 'binary'), cipher.final()]);
	return "https://e-cdns-proxy-" + md5Origin.substring(0, 1) + ".dzcdn.net/mobile/1/" + buffer.toString("hex").toLowerCase();
}


getJSON(url: any, callback: { (arg0: Error): void; (arg0: Error): void; (arg0: any): void; }){
	request.get({url: url, headers: this.httpHeaders, jar: true}, function(err: any, res: { statusCode: number; }, body: string) {
		if(err || res.statusCode != 200 || !body) {
			
			callback(new Error());
		} else {
			var json = JSON.parse(body);
			if (json.error) {
				console.log(json)
				
				callback(new Error());
				return;
			}
			callback(json);
		}
	});
}

}
