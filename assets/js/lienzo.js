
var myCanvas = function (lienzo) {
    this.canvas = lienzo;
    this.ctx =  this.canvas.getContext('2d');
    this.originX = this.canvas.offsetLeft;
    this.originY = this.canvas.offsetTop;
    this.ancho = this.canvas.clientWidth;
    this.alto = this.canvas.clientHeight;
    this.nodes = [];
    this.nodeSelection =  null;
    this.matrix = [];
    this.imageArrow = new Image();
    this.imageArrow.src = "/images/arrow.png";
    this.conf = {
        color: "black",
        tamaño: 11,
        arrowFontColor: "black",
        nodeFontColor: "black",
        fontSize: "15px",
        fontFamily: "Josefin Slab",
        left_arrow_color: 'yellow',
        rigth_arrow_color: 'cyan'
    }
    

}

/**

    funcion para extraer la direccion de la flecha
*/



myCanvas.prototype.onNext = function (node,sig) {
    var nexts = node.next;
    var sw = -1;
    for (var y = 0; y < nexts.length; y++) {
        var aux = nexts[y];

        if (aux === sig) {
            sw = y;
            break;
        }
        
    }
    return sw;
}
myCanvas.prototype.generateMatrix = function () { 
    this.matrix=[];
    for (var p = 0; p < this.nodes.length; p++) {
        var el = this.nodes[p];
        var array =[];
        for (var q = 0; q < this.nodes.length; q++) {
            var aux2 = this.nodes[q];
            
            var posval = this.onNext(el,aux2);
            if (posval != -1) {

                array.push(el.values[posval]);
            }
            else
            {
                array.push(0);
            }
            
        }
        this.matrix.push(array);
           
    }

    return this.matrix;
}
myCanvas.prototype.showMatrix = function () {
    var salida = "";
    for (var f = 0; f < this.matrix.length; f++) {
        var fila = this.matrix[f];
        for (var c = 0; c < fila.length; c++) {
            var col = fila[c];
            
            
            
        }
        
    }

    console.log(this.matrix);
    
  
    
}
myCanvas.prototype.clearCanvas = function () {
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
}

myCanvas.prototype.draw = function (image,x,y,ancho,alto) {

    this.ctx.drawImage(image,x,y,ancho,alto);  

    
}
myCanvas.prototype.setNodes = function (nodes) {

    this.nodes = nodes;
    
}
myCanvas.prototype.seleccion = function (x,y) {

    var relativaX = x - this.originX + window.scrollX; 
    var relativaY = y - this.originY + window.scrollY;
    
    
    var sw = false;
    for (var k = 0; k < this.nodes.length; k++) {
        var elem = this.nodes[k];
        
        if(elem.getOriginX() < relativaX && relativaX < (elem.getOriginX() + elem.getTamaño()) && elem.getOriginY() < relativaY && relativaY < (elem.getOriginY() + elem.getTamaño()) )
        {
            this.nodeSelection = k;
            sw = true;
            break;
        }
        
    }

    return sw;
        
}

myCanvas.prototype.writeText = function (node) {
    var name = node.getName();
    var posx = node.getOriginX()+node.getTamaño()/2;
    var posy = node.getOriginY()+node.getTamaño()/2;
    if(name!=null)
    {
        this.ctx.font = "16px arial";
        this.ctx.fillStyle = this.conf.nodeFontColor;
        this.ctx.textAlign = "center"; // centrado horizontal
        this.ctx.textBaseline = "middle"; //centrado vertical
        this.ctx.fillText(name,posx,posy);
    }
}
myCanvas.prototype.paintNodes = function () { 
    for (var l = 0; l < this.nodes.length; l++) {
        var elem = this.nodes[l];
        var sig = elem.next;
        if(sig.length!==0)
        {
            var origenX = elem.getOriginX()+elem.getTamaño()/2;
            var origenY = elem.getOriginY()+elem.getTamaño()/2;

            for (var m = 0; m < sig.length; m++) {
                var el = sig[m];
                var destinoX = el.getOriginX()+el.getTamaño()/2;
                var destinoY = el.getOriginY()+el.getTamaño()/2;
                var value = elem.values[m] || '';

                this.drawArrow(origenX,origenY,destinoX,destinoY);
                this.drawValue(value,origenX,origenY,destinoX,destinoY);
                this.dibujaFlecha(origenX,origenY,destinoX,destinoY);
            }
        }
        this.paintNode(elem);
        
    }
}
myCanvas.prototype.getDirection = function (x0,y0,x1,y1) {
    var color;
    if(x1 > x0)
    {
        color = this.conf.rigth_arrow_color;
    }
    else
    {
        color = this.conf.left_arrow_color;
    }

    return color;
};


myCanvas.prototype.dibujaFlecha = function (ox,oy,dx,dy) {

    var d = Math.sqrt(Math.pow((dx-ox),2)+Math.pow((dy-oy),2));
    var an = Math.atan2(dy-oy,dx-ox)*(180/Math.PI);
    
    d-= this.nodes[0].tamaño/2;


    var x1 = ox,
        y1 = oy,
        x2 = ox+(Math.cos(an * Math.PI/180)*d),
        y2 = oy+(Math.sin(an * Math.PI/180)*d);

    var angle = Math.atan2(y2-y1,x2-x1);


    var headlen = this.conf.tamaño;   // length of head in pixels
    
    
    var flech1x = x2-headlen*Math.cos(angle-Math.PI/6);
    var flech1y = y2-headlen*Math.sin(angle-Math.PI/6);
    var flech2x = x2-headlen*Math.cos(angle+Math.PI/6);
    var flech2y = y2-headlen*Math.sin(angle+Math.PI/6);
    this.ctx.beginPath();
    this.ctx.moveTo(flech1x, flech1y);
    this.ctx.lineTo(x2,y2);
    this.ctx.lineTo(flech2x,flech2y);
    this.ctx.fillStyle = this.getDirection(x1,y1,x2,y2);
    this.ctx.strokeStyle = this.getDirection(x1,y1,x2,y2);
    this.ctx.stroke();
    this.ctx.fill();
}

myCanvas.prototype.drawValue = function (val,x1,y1,x2,y2) { 
    
    var posX = x1 + ((x2-x1) * 0.5);
    var posY = y1 + ((y2-y1) * 0.5);
    if((x2-x1)>0){this.ctx.textBaseline = "bottom";}
    else{this.ctx.textBaseline = "top";}

    if((y2-y1)>0){this.ctx.textAlign = "start";}
    else{this.ctx.textAlign = "end";}


    this.ctx.font = "bold "+this.conf.fontSize+" "+this.conf.fontFamily;
    this.ctx.fillStyle = this.getDirection(x1,y1,x2,y2);
    console.log(this.getDirection(x1,y1,x2,y2));
    this.ctx.fillText(val,posX,posY);
};
myCanvas.prototype.drawArrow = function (x1,y1,x2,y2) {


        var direc = this.getDirection(x1,y1,x2,y2);
        var color;

        this.ctx.beginPath();//beginPath es muy nesesario para que se pueda borra del canvas 
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = this.conf.arrowFontColor;
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();

        
        
}
myCanvas.prototype.posicionarFlecha = function (x1,y1,x2,y2) {
    
    var headlen = this.conf.tamaño;   // length of head in pixels
    var angle = Math.atan2(y2-y1,x2-x1);
    var flech1x = x2-headlen*Math.cos(angle-Math.PI/6);
    var flech1y = y2-headlen*Math.sin(angle-Math.PI/6);
    var flech2x = x2-headlen*Math.cos(angle+Math.PI/6);
    var flech2y = y2-headlen*Math.sin(angle+Math.PI/6);
    this.ctx.beginPath();
    this.ctx.moveTo(flech1x, flech1y);
    this.ctx.lineTo(x2,y2);
    this.ctx.lineTo(flech2x,flech2y);
    this.ctx.strokeStyle = this.getDirection(x1,y1,x2,y2);
    this.ctx.fillStyle = this.getDirection(x1,y1,x2,y2);
    this.ctx.stroke();
    this.ctx.fill();
    // var tamaño = 25;
    // var m1 = 0,
    //     m2 = (y2-y1)/(x2-x1);
    // var op = (m2-m1)/(1+(m2*m1));
    // var angulo = 180-parseInt(Math.atan(op)*(180/Math.PI));/**encontrando el angulo de movimiento y transformandolo a grados */
    // console.log(angulo);
    
    
    // this.ctx.save();/**guarda la configuracion actual */
    // this.ctx.translate(x2+(25*0.5),y2+(25*0.5));
    // this.ctx.save();
    // this.ctx.rotate((Math.PI/180)*angulo);
    // this.ctx.save();
    // this.ctx.translate(-(x2+(25*0.5)),-(y2+(25*0.5)));

    // this.ctx.drawImage(this.imageArrow,x2-(tamaño*0.5),y2-(tamaño*0.5),tamaño,tamaño);

    // this.ctx.restore();/** restaura la configuracion actual segun las configuraciones que se guardaron en la pila */
    // this.ctx.restore();
    // this.ctx.restore();
};


myCanvas.prototype.paintArrow = function (x,y) {

    var relativaX = x - this.originX + window.scrollX; 
    var relativaY = y - this.originY + window.scrollY;
    if(this.nodeSelection !== null)
    {
        var nodeSelected = this.nodes[this.nodeSelection];

        var partidaX = nodeSelected.getOriginX()+nodeSelected.getTamaño()/2;
        var partidaY = nodeSelected.getOriginY()+nodeSelected.getTamaño()/2;

            
        this.ctx.clearRect(0,0,this.ancho,this.alto);
        this.drawArrow(partidaX,partidaY,relativaX,relativaY);
        this.posicionarFlecha(partidaX,partidaY, relativaX,relativaY);
        this.paintNodes();
    }
    
};

myCanvas.prototype.relacionarNodos = function (posNode) {

    var nodo_prin = this.nodes[posNode];
    var nodo_sig = this.nodes[this.nodeSelection];

    nodo_prin.next.push(nodo_sig);
    nodo_sig.previous.push(nodo_prin);
    this.ctx.clearRect(0,0,this.ancho,this.alto);
    this.paintNodes();
    
}


myCanvas.prototype.paintNode = function (node) { 
    
    var context = this;
    var image = node.getImage();
    var x = node.getOriginX();
    var y = node.getOriginY();
    var tamaño = node.getTamaño();
    

    if (typeof window.requestAnimationFrame !== 'undefined') {
            
        window.requestAnimationFrame(function () {
            
            context.draw(image,x,y,tamaño,tamaño);
            context.writeText(node);
        });
    } else {
        
        this.draw(image,x,y,tamaño,tamaño);  
        this.writeText(node);
    }
    
      
}

myCanvas.prototype.borrar = function (x,y,ancho,alto) { 

    this.ctx.clearRect(x,y,ancho,alto);
}



myCanvas.prototype.toRender = function () {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
}   

myCanvas.prototype.validarNombre = function (name) {

    
    var sw = true;
    for (var g = 0; g < this.nodes.length; g++) {
        var el = this.nodes[g];
        var s = el.name;
        console.log(s,name);
        
        if(s == name)
        {
            sw = false;
        }        
        
    }


    
    return sw;
}