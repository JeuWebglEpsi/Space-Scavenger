var ATH = function () {
    var ath = this;
    this.lifebar = 0;
    this.ammo = 0;
    this.svgns = "http://www.w3.org/2000/svg";
    this.highlightedItem = [];
}
ATH.prototype.get = function (prop) {
    return this[prop];
}
ATH.prototype.set = function (prop, value) {
    this[prop] = value;
}

ATH.prototype.initialize = function (life, ammo) {
    this.lifebar = life;
    this.ammo = ammo;

}
ATH.prototype.toScreenXY = function (position, camera, jqdiv) {
    var pos = position.clone();
    var projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    pos.applyProjection(projScreenMat);

    return {
        x: (pos.x + 1) * jqdiv.width() / 2 + jqdiv.offset().left,
        y: (-pos.y + 1) * jqdiv.height() / 2 + jqdiv.offset().top
    };

}
ATH.prototype.drawRect = function (obj, o) {
    var r = document.getElementById('rect_' + obj.id);
    if (r) {
        r.setAttributeNS(null, 'x', (o.x - 12.5));
        r.setAttributeNS(null, 'y', (o.y - 12.5));
    } else {
        var rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'id', 'rect_' + (obj.id));
        rect.setAttributeNS(null, 'x', (o.x - 12.5));
        rect.setAttributeNS(null, 'y', (o.y - 12.5));
        rect.setAttributeNS(null, 'height', '25');
        rect.setAttributeNS(null, 'width', '25');
        rect.setAttributeNS(null, 'stroke', '#2FF');
        rect.setAttributeNS(null, 'fill', 'transparent');
        rect.setAttributeNS(null, 'stroke-width', '1');
        $('.athrenderer').append(rect);
    }
}
//draw ath
ATH.prototype.update = function () {
    var ath = this;

    var frustum = new THREE.Frustum();
    var cameraViewProjectionMatrix = new THREE.Matrix4();

    var life = $('.athlife');
    life.find('font').text(game.localPlayer.get('_life'));
    life.find('progress.life').val(game.localPlayer.get('_life'));


    var cartridge = $('.athammo');
    cartridge.find('font').text(game.localPlayer.get('_ammo'));
    cartridge.find('progress.ammo').val(game.localPlayer.get('_ammo'));
    var c2d = $('.athrenderer');
    c2d.html('');
    window.scene.traverse(function (obj) {
        if (obj.name === "toHighlight") {



            // every time the camera or objects change position (or every frame)

            window.camera.updateMatrixWorld(); // make sure the camera matrix is updated
            window.camera.matrixWorldInverse.getInverse(window.camera.matrixWorld);
            cameraViewProjectionMatrix.multiplyMatrices(window.camera.projectionMatrix, window.camera.matrixWorldInverse);
            frustum.setFromMatrix(cameraViewProjectionMatrix);



            var o = ath.toScreenXY(obj.position, window.camera, $('.athrenderer'));
            if (o.x > 0 && o.x < c2d.width() && frustum.intersectsObject(obj)) {
                ath.drawRect(obj, o);
            }
        }
    })
}
ATH.prototype.highlightItem = function (item) {
    //TODO
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = ATH;
else
    window.ATH = ATH;
