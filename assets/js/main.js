var myCanvas;
var gnode;
var garow;
var gshow;
var Actions = [];
var nodes = [];
var imageA;
var elementNode;
var elementShow;
var butonName;
var butonVal;
var mouseMove = false;


function actionActive(g) { 

    for (var i = 0; i < Actions.length; i++) {
        var elem = Actions[i];

        if(g === elem)
        {
            elem.ennable();
        }
        else
        {
            elem.disable();
        }
        
    }
}

function htmlReady() {

    
    
    canv = document.getElementById('lienzo');
    
    myCanvas = new myCanvas(canv);
    myCanvas.toRender();
    myCanvas.conf = {
        color: "black",
        tamaño: 12,
        arrowFontColor: "black",
        nodeFontColor: "black",
        fontSize: "17px",
        fontFamily: "impact",
        left_arrow_color: 'black',
        rigth_arrow_color: 'black'
    }


    gnode = new eventsLauncher('node');
    garow = new eventsLauncher('arow');
    gshow = new eventsLauncher('show');
  
    Actions = [gnode,garow,gshow];

    imageA = new Image();


    imageA.src = "./assets/images/1.png";


}

function doomReady() { 


    elementNode = document.getElementById('node');
    elementArow = document.getElementById('arow');
    elementShow = document.getElementById('gen_matrix');


    canv = document.getElementById('lienzo');

    gnode.addCallback('clickOnCanvas',function (event) { 

        var originx = event.clientX - myCanvas.originX + window.scrollX;
        var originy = event.clientY - myCanvas.originY + window.scrollY;

        newNode = new Nodo( imageA ,originx ,originy);
        
        do
        {
            var Nname = prompt("Ingrese nombre del nodo");
            newNode.name = Nname;

            var vnom = myCanvas.validarNombre(Nname);

        }while(!vnom || (Nname == ''));
        
        

        myCanvas.nodes.push(newNode);
        myCanvas.paintNodes();
    });

    function mostrarMatrix() {
        var matrix = myCanvas.generateMatrix();
        var nodess = myCanvas.nodes;

        var html="<thead>"
                +"<tr>"
                +"<th></th>";

        for (var k = 0; k < nodess.length; k++) {
            var v = nodess[k];
            var nombre = v.name;
            var na;
            if (nombre === null) {
                na = " ";
            }
            else
            { na = nombre;}
            
            html+="<th>"+na+"</th>";
        }
            html+=" </tr>"
                +"</thead><tbody>"


        for (var f = 0; f < matrix.length; f++) {
            var nombre = nodess[f].name;
            var na;
            if (nombre === null) {
                na = "-";
            }   
            else
            {
               na = nombre;
            }
            var farray = matrix[f];

            html+="<tr><th>"+na+"</th>";
            for (var c = 0; c < farray.length; c++) {
                var carray = farray[c];
                html+="<td>"+carray+"</td>";
                
            }
            html+="</tr>";

            
        }
         html+="</tbody>";
            var tableContent = document.getElementById("matrix");
            tableContent.innerHTML = html;

            var modal = document.getElementById("modal");
            modal.style.display = "block";
            

    }



    garow.addCallback('mouseDownOnCanvas',function (event) {
        var downX = event.clientX || event.changedTouches[0].clientX;
        var downY = event.clientY || event.changedTouches[0].clientX;
        
        

        var sele = myCanvas.seleccion(downX,downY);
        if (sele) {
            mouseMove = true;
           
            
        }
        
    });

    garow.addCallback('mouseArrastre', function (event) {
        
        var moveX = event.clientX || parseInt(event.changedTouches[0].clientX);
        var moveY = event.clientY || parseInt(event.changedTouches[0].clientY);

    
        
        if(mouseMove)
        {

            myCanvas.paintArrow(moveX,moveY);
                        
        }
    });

    garow.addCallback('mouseUp',function (event) {  
        
        var upX = event.clientX;
        var upY = event.clientY;
        if(mouseMove)
        {
    
            var auxPosNode = myCanvas.nodeSelection;
    
            var onNode = myCanvas.seleccion(upX,upY);
    
            if(onNode)
            {
                myCanvas.relacionarNodos(auxPosNode);
                var coste = prompt("Ingresar cantidad");

                var posSig = myCanvas.nodeSelection;
                var nodeSig = myCanvas.nodes[posSig];
                var nodeAnt = nodeSig.previous[nodeSig.previous.length - 1];
                nodeAnt.values.push(parseFloat(coste));
                
                myCanvas.nodeSelection = null;
                myCanvas.clearCanvas();
                myCanvas.paintNodes();

            }
            else
            {
                myCanvas.clearCanvas();
                myCanvas.paintNodes();
            }

            mouseMove = false;
            /**cuidado con esto */
    
                
            
        }
    });

    gshow.addCallback('clickShow', function (ev) {
        // var salida = "";
        // var mat = myCanvas.generateMatrix();
        // for (var i = 0; i < mat.length; i++) {
        //     var f = mat[i];
        //     for (var k = 0; k < f.length; k++) {
        //         var c = f[k];
        //         salida+=c+"    ";
        //     }
        //     salida+="\n";
        // }

        // alert(salida);
        mostrarMatrix();
    })
    /**
     * agregamos eventos a las opciones
     */
    elementNode.addEventListener('click',function () {
        actionActive(gnode);       
    });

  
    elementArow.addEventListener('click', function () {
        actionActive(garow);

        
    });

    elementShow.addEventListener('click', function (e) {
        actionActive(gshow);
        gshow.launch('clickShow',e);
    })

    // butonName.addEventListener('click', function () { 
    //     var inputN = document.getElementById('name_node');
    //     if (inputN.value!='') {

    //         var pos = myCanvas.nodeSelection;
    //         myCanvas.nodes[pos].setName(inputN.value);
    //         myCanvas.paintNode(myCanvas.nodes[pos]);
    //         myCanvas.nodeSelection = null;

    //         inputN.value = '';
    //         modalName.style.display = 'none';
    //     }

    //     mostrarMatrix();

       
        
    // });

    // butonVal.addEventListener('click', function () {
    //     var inputV = document.getElementById('value_node');
        
    //     if (inputV.value!='') {
    //         var posSig = myCanvas.nodeSelection;
    //         var nodeSig = myCanvas.nodes[posSig];
    //         var nodeAnt = nodeSig.previous[nodeSig.previous.length - 1];
    //         nodeAnt.values.push(parseFloat(inputV.value));
            
    //         myCanvas.nodeSelection = null;
    //         inputV.value = '';
    //         modalVal.style.display = 'none';
    //     }
    //     myCanvas.generateMatrix();
    //     myCanvas.showMatrix();
    //     mostrarMatrix();
    // })

    var buton = document.getElementById("buton");
    buton.addEventListener("click", function () {
        // body...
        var modal = document.getElementById("modal");
        modal.style.display = "none";
    });
    

    canv.addEventListener('click', function (ev) {
        gnode.launch('clickOnCanvas',ev);

    });

    canv.addEventListener('mousedown', function (ev) { 
        garow.launch('mouseDownOnCanvas',ev);
    });

    canv.addEventListener('mousemove', function (ev) { 
        garow.launch('mouseArrastre',ev);
    });

    canv.addEventListener('mouseup', function (ev) { 
        garow.launch('mouseUp',ev);
    });

    canv.addEventListener('touchstart', function (ev) { 
        
        garow.launch('mouseDownOnCanvas',ev);
        
        
    },false);

    canv.addEventListener('touchmove', function (ev) { 
        
        garow.launch('mouseArrastre',ev);
    },false);

    canv.addEventListener('touchend', function (ev) { 
        garow.launch('mouseUp',ev);
    },false);


    

    
}
/** doomcontentloaded:
 * este evento se lo agrega al document y nos indica en que momento se cargo la pagina html . sin estilos , ni imagenes o subframes.
 */
document.addEventListener('DOMContentLoaded',htmlReady);

window.addEventListener('load',doomReady);