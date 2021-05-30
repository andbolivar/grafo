var Nodo = function (imageA,origenX,origenY) {

    this.name = null;
    this.imageA = imageA || null;
    this.previous = [];
    this.next = [];
    this.values = [];
    this.tamaño = 70;
    this.origenX  = origenX - this.tamaño/2;
    this.origenY = origenY - this.tamaño/2;

}

Nodo.prototype.setName = function (name) {
    this.name = name;
}




Nodo.prototype.getName = function () {
    return this.name;
}

Nodo.prototype.getPrevious = function () {
    return this.previous;
}

Nodo.prototype.getNext = function () {
    return this.next;
}

Nodo.prototype.getOriginX = function () {
    return this.origenX;
}

Nodo.prototype.getOriginY = function () {
    return this.origenY;
}

Nodo.prototype.getImage = function () {

    return this.imageA;
}

Nodo.prototype.getTamaño = function () {
    return this.tamaño;
}
