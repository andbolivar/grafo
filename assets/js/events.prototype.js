/**
 * 
 * @param {*} eventsLauncher 
 * creando el prototypo con su respectivo suconstructor ES5
 */

    var eventsLauncher = function (name) { 
        this.name = name;
        this.callbacks = [];
        this.target = false;
    }

 /**
  * agregando funciones al prototypo
  */

    eventsLauncher.prototype.addCallback = function (eventName,callback) { 
        var obj = { 
            'eventName' : eventName,
            'callback' : callback
        }
        this.callbacks.push(obj);
    
        
    }
  
    eventsLauncher.prototype.launch = function (eName,ev) {
        
        
        if (this.target === true) {
            
            for (var i = 0; i < this.callbacks.length; i++) {
                var obj = this.callbacks[i];
                
                
                if(obj.eventName == eName)
                {
    
                    obj.callback(ev);
                    break;
                }
                
            }
        }
    }

    eventsLauncher.prototype.disable = function () { 
        this.target = false;
    }

    eventsLauncher.prototype.ennable = function () { 
        this.target = true;
    }
