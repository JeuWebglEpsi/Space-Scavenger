/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function (object, domElement) {
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.domElement = (domElement !== undefined) ? domElement : document;
    this.hasMove = false;
    this.movementSpeed = 1000;
    this.lookSpeed = 0.01;

    this.lookVertical = true;
    this.autoForward = false;
    //this.invertVertical = true;

    this.activeLook = true;

    this.heightSpeed = false;
    this.heightCoef = 1.0;
    this.heightMin = 0.0;
    this.heightMax = 1.0;

    this.constrainVertical = false;
    this.verticalMin = 0;
    this.verticalMax = Math.PI;

    this.autoSpeedFactor = 0.0;

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.freeze = false;

    this.mouseDragOn = false;

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    if (this.domElement !== document) {

        this.domElement.setAttribute('tabindex', -1);

    }

    //

    this.handleResize = function () {

        if (this.domElement === document) {

            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;

        } else {

            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;

        }

    };



    this.onMouseMove = function (event) {
        this.mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        this.mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.object.rotation.y -= this.mouseX * 0.002;
        this.object.rotation.x += this.mouseY * 0.002;

        //this.object.rotation.x = Math.max(-(Math.PI / 2), Math.min((Math.PI / 2), this.object.rotation.x));

    };

    this.onKeyDown = function (event) {

        //event.preventDefault();

        switch (event.keyCode) {
        case 80:
            $('#menuModal').modal({
                keyboard: false
            });
            break;
        case 38:
            /*up*/
        case 90:
            /*W*/
            this.moveForward = true;
            break;

        case 37:
            /*left*/
        case 65:
            /*A*/
            this.moveLeft = true;
            break;

        case 40:
            /*down*/
        case 83:
            /*S*/
            this.moveBackward = true;
            break;

        case 39:
            /*right*/
        case 68:
            /*D*/
            this.moveRight = true;
            break;

        case 32:
            /*R*/
            this.moveUp = true;
            break;
        case 17:
            /*F*/
            this.moveDown = true;
            break;

        case 81:
            /*Q*/
            this.freeze = !this.freeze;
            break;

        }

    };

    this.onKeyUp = function (event) {

        switch (event.keyCode) {

        case 38:
            /*up*/
        case 90:
            /*W*/
            this.moveForward = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;

        case 37:
            /*left*/
        case 65:
            /*A*/
            this.moveLeft = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;

        case 40:
            /*down*/
        case 83:
            /*S*/
            this.moveBackward = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;

        case 39:
            /*right*/
        case 68:
            /*D*/
            this.moveRight = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;

        case 32:
            /*R*/
            this.moveUp = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;
        case 17:
            /*F*/
            this.moveDown = false;
            this.object.setLinearVelocity({
                x: 0,
                y: 0,
                z: 0
            });
            break;

        }

    };
    this.getDirection = function () {
        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, "YXZ");

        rotation.set(this.object.rotation.y, this.object.rotation.x, this.object.rotation.z);

        direction.applyEuler(rotation);

        return direction;

    }
    this.update = function (delta) {
        if (this.freeze) {

            return;

        }
        if (this.heightSpeed) {

            var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
            var heightDelta = y - this.heightMin;

            this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);

        } else {

            this.autoSpeedFactor = 0.0;

        }

        var actualMoveSpeed = delta * this.movementSpeed;

        var vector, pw, dir, toX = 0,
            toY = 0,
            toZ = 0;

        if (this.moveBackward || this.moveForward || this.moveLeft || this.moveRight || this.moveUp || this.moveDown || this.autoForward) {


            vector = new THREE.Vector3(0, 0, 1);
            pw = vector.applyMatrix4(this.object.matrixWorld);
            dir = pw.sub(this.object.position).normalize();


            if (this.moveForward) {
                toX += -dir.x;
                toY += -dir.y;
                toZ += -dir.z;
            }

            if (this.moveBackward) {
                toX += dir.x;
                toY += dir.y;
                toZ += dir.z;
            }

            if (this.moveLeft) {

                var axis = new THREE.Vector3(1, 0, 0);

                toX += dirLeft.x;
                toY += 0;
                toZ += dirLeft.z;

            }
            if (this.moveRight) {
                toX += -dir.x;
                toY += -dir.y;
                toZ += -dir.z;
            }

            if (this.moveUp) {
                toY = 1;
            }
            if (this.moveDown) {
                toY = -1;
            }
            this.object.setLinearVelocity({
                x: this.movementSpeed * toX,
                y: this.movementSpeed * toY,
                z: this.movementSpeed * toZ
            });
        }

        var actualLookSpeed = delta * this.lookSpeed;

        if (!this.activeLook) {

            actualLookSpeed = 0;

        }

        var verticalLookRatio = 1;

        if (this.constrainVertical) {

            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

        }

        this.lon += this.mouseX * actualLookSpeed;
        if (this.lookVertical) this.lat += this.mouseY * actualLookSpeed * verticalLookRatio;

        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);

        this.theta = THREE.Math.degToRad(this.lon);

        if (this.constrainVertical) {

            this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);

        }

        var targetPosition = this.target,
            position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.object.lookAt(targetPosition);
        this.mouseX = this.mouseY = 0

    };


    this.domElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    }, false);

    this.domElement.addEventListener('mousemove', bind(this, this.onMouseMove), false);

    this.domElement.addEventListener('keydown', bind(this, this.onKeyDown), false);
    this.domElement.addEventListener('keyup', bind(this, this.onKeyUp), false);

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    };

    this.handleResize();

};
