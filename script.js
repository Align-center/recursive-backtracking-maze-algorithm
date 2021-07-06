"use strict";

document.addEventListener('DOMContentLoaded', function loaded() {

    class MazeNode {

        constructor(x, y, grid) {
            this.x = x;
            this.y = y;
            this.gridDimensions = {
                width: grid.width,
                height: grid.height
            };
            this.potentialPaths = {};
            this.parent;
            this.children = {};
            this.isStart = false;
            this.visited = false;
            this.walls = {
                north: true,
                east: true,
                south: true,
                west: true
            };
        }

        selectPotentialPaths(nodes) {

            for (let i = 0; i < nodes.length; i++) {

                if (this.x != 0) {

                    if (this.x - 1 == nodes[i].x && this.y == nodes[i].y) {

                        this.potentialPaths.west = nodes[i];
                    }
                }

                if (this.y != 0) {

                    if (this.y - 1 == nodes[i].y && this.x == nodes[i].x) {

                        this.potentialPaths.north = nodes[i];
                    }
                }

                if (this.x + 1 == nodes[i].x && this.y == nodes[i].y) {

                    this.potentialPaths.east = nodes[i];
                }

                if (this.y + 1 == nodes[i].y && this.x == nodes[i].x) {

                    this.potentialPaths.south = nodes[i];
                }
            }
        }

        selectAllPotentialPaths(nodes) {

            for (let i = 0; i < nodes.length; i++) {

                nodes[i].selectPotentialPaths(nodes);
            }
        }

        setNewChild(newNode, direction) {


            this.children[direction] = newNode;
            newNode.parent = this;

            newNode.walls[invertDirection(direction)] = false;
            this.walls[direction] = false;

            delete this.potentialPaths[direction];
        }

        removeVisitedPotentialPaths() {

            const keys = Object.keys(this.potentialPaths);
            const direction = keys[getRandomInt(0, keys.length)];

            for (let i = 0; i < keys.length; i++) {

                if (this.potentialPaths[keys[i]].visited) {

                    delete this.potentialPaths[keys[i]];
                }
            }
        }

        isEmpty(obj) {

            for (var key in obj) {

                if (obj.hasOwnProperty(key))
                    return false;
            }

            return true;
        }

        selectNewNode() {

            const keys = Object.keys(this.potentialPaths);
            var direction = keys[getRandomInt(0, (keys.length - 1))];

            return [this.potentialPaths[direction], direction];
        }

        generateWalls(ctx, dim) {

            ctx.lineWidth = 1;
            ctx.beginPath();

            if (this.isStart) {
                ctx.fillStyle = 'rgba(49, 200, 50, .7)';
                ctx.fillRect(this.x * dim, this.y * dim, dim, dim);
            }

            if (this.walls.north) {

                ctx.moveTo(this.x * dim, this.y * dim);
                ctx.lineTo(this.x * dim + dim, this.y * dim);
            }
            if (this.walls.east) {

                ctx.moveTo(this.x * dim + dim, this.y * dim);
                ctx.lineTo(this.x * dim + dim, this.y * dim + dim);
            }
            if (this.walls.south) {

                ctx.moveTo(this.x * dim, this.y * dim + dim);
                ctx.lineTo(this.x * dim + dim, this.y * dim + dim);
            }
            if (this.walls.west) {

                ctx.moveTo(this.x * dim, this.y * dim);
                ctx.lineTo(this.x * dim, this.y * dim + dim);
            }

            ctx.stroke();
        }

        generateGraph(currentNode) {

            currentNode.visited = true;

            currentNode.removeVisitedPotentialPaths();

            let newNode;

            if (!currentNode.isEmpty(currentNode.potentialPaths)) {

                newNode = currentNode.selectNewNode();

                currentNode.setNewChild(newNode[0], newNode[1]);

                newNode[0].generateGraph(newNode[0]);
            } else {

                newNode = currentNode.parent;

                if (newNode.isStart) {

                    return;
                }

                newNode.generateGraph(newNode);
            }

        }


    }

    var dimensions = 30;
    var grid = {
        width: 20,
        height: 20
    };
    var nodes;
    var canvas = document.querySelector('canvas');
    canvas.width = grid.width * dimensions;
    canvas.height = grid.height * dimensions;
    var ctx = canvas.getContext('2d');

    var btns = document.querySelectorAll('.btn');
    var dwnld = document.querySelector('.download');

    var widthInput = document.querySelector('#width');
    var heightInput = document.querySelector('#height');

    function invertDirection(direction) {

        if (direction == 'east') {
            return 'west';
        } else if (direction == 'west') {
            return 'east';
        } else if (direction == 'north') {
            return 'south';
        } else if (direction == 'south') {
            return 'north';
        }
    }

    function getRandomInt(min, max) {

        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function setDownloadLink ()  {

        dwnld.href = canvas.toDataURL();
        dwnld.download = 'maze.png';
    }

    function main() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes = [];

        for (let i = 0; i < grid.height; i++) {

            for (let j = 0; j < grid.width; j++) {
    
                let node = new MazeNode(j, i, grid);
    
                nodes.push(node);
            }
        }
    
        var start = nodes[getRandomInt(0, nodes.length)];
        start.isStart = true;

        start.selectAllPotentialPaths(nodes);
        start.generateGraph(start);

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].generateWalls(ctx, dimensions);
        }
    }

    for (let i = 0; i < btns.length; i++) {

        btns[i].addEventListener('click', function onClickSetDimensions(e) {

            if (/small/gi.test(e.target.className)) {

                grid = {
                    width: 10,
                    height: 8
                }

                canvas.width = grid.width * dimensions;
                canvas.height = grid.height * dimensions;

                main();
                setDownloadLink();
            } else if (/medium/gi.test(e.target.className)) {

                grid = {
                    width: 20,
                    height: 15
                }

                canvas.width = grid.width * dimensions;
                canvas.height = grid.height * dimensions;

                main();
                setDownloadLink();
            } else if (/large/gi.test(e.target.className)) {
                grid = {
                    width: 25,
                    height: 20
                }

                canvas.width = grid.width * dimensions;
                canvas.height = grid.height * dimensions;

                main();
                setDownloadLink();
            } else if (/custom/gi.test(e.target.className)) {

                let customWidth = widthInput.value;
                let customHeight = heightInput.value;

                grid = {
                    width: customWidth,
                    height: customHeight
                }

                canvas.width = grid.width * dimensions;
                canvas.height = grid.height * dimensions;

                main();
                setDownloadLink();
            }
        });
    }

    main();
    setDownloadLink();
});
