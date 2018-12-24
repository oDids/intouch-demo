var random_numbers = [];
var turns = -1;
var initial_bet = 10;
/**
 * draws and updates everything displayed on screen
 */
function updateUI(ctx, shape_array, multipliers, random_numbers) {

    // create black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1100, 650);

    // put all the multipliers on screen (hidden by boxes)
    // potential for cheating?
    ctx.fillStyle = "red";
    ctx.fillText(multipliers[0], 125, 125);
    ctx.fillText(multipliers[1], 325, 125);
    ctx.fillText(multipliers[2], 525, 125);
    ctx.fillText(multipliers[3], 125, 325);
    ctx.fillText(multipliers[4], 325, 325);
    ctx.fillText(multipliers[5], 525, 325);
    ctx.fillText(multipliers[6], 125, 525);
    ctx.fillText(multipliers[7], 325, 525);
    ctx.fillText(multipliers[8], 525, 525);

    // loop through shapes in shape array and only draw the boxes that are covering hidden numbers, not the numbers collected already.
    for (var i: number = 0; i < shape_array.length; i++) {
        if (i != random_numbers[0] - 1 && i != random_numbers[1] - 1 && i != random_numbers[2] - 1 && i != random_numbers[3] - 1) {
            const shape: Shape = shape_array[i];
            shape.draw();
        }
    }
    //prints the random numbers the player collected for the turns they have taken, and defaults to 0 for the others
    ctx.fillText(String(random_numbers[0] || 0), 750, 100);
    ctx.fillText(String(random_numbers[1] || 0), 800, 100);
    ctx.fillText(String(random_numbers[2] || 0), 850, 100);
    ctx.fillText(String(random_numbers[3] || 0), 900, 100)

    
}

/**
 * loops through the multipliers the player has gained, comparing each multiplier to each other multiplier, skipping checking against itself. returns true when the same multiplier occurs twice
 * further performance improvements could be made by caching the pairs that have been compared, and storing the reverse. then avoiding cheecking any components in the cache. over engineering for this particular problem.
 */
function get_winning_value(chosen_multipliers) {
    for (var i = 0; i < chosen_multipliers.length; i++) {
        let i_value = chosen_multipliers[i];

        for (var j = 0; j < chosen_multipliers.length; j++) {
            if (j === i) {
                console.log(`i = ${i} | j = ${j} | SKIPPED`);
                continue
            }

            let j_value = chosen_multipliers[j];
            console.log(`i = ${i}:${i_value} | j = ${j}:${j_value}`);
            if (j_value === i_value) {
                return i_value;
            }
        }
    }
}

/**
 * creates an array and works out the multipliers to store in it
 */
function get_multipliers(multipliers) {
    const chosen_multipliers = [];
    for (let i of random_numbers) {
        chosen_multipliers.push(multipliers[i -1]);
    }
    
    console.log("chosen multipliers : " + chosen_multipliers);

    return chosen_multipliers;
}

/**
* describes what all shapes have in common
*/
interface Shape {
    draw(): void;
    x: number;
    y: number;
    color: string;
    lineWidth: number;
}

/**
 * describes a square and how to draw one
 */
class Box implements Shape {
    //boxes position
    public x: number = 0;
    public y: number = 0;
    // fill color?

    // boxes height and width
    public w: number = 0;
    public h: number = 0;
    public lineWidth: number = 5;
    public color: string = "red";
    public ctx: CanvasRenderingContext2D;

    constructor(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D, color: string = "red") {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //this.lineWidth = line_width;
        this.color = color;
        this.ctx = ctx;
    }
    public draw = (): void => {
        this.ctx.save();
        this.ctx.beginPath(); //gotta begin path before anything
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = "red";
        // this.ctx.lineWidth = this.lineWidth;
        this.ctx.rect(this.x, this.y, this.w, this.h);
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
        // this.ctx.arc(400, 400, 100, 0, 2 * Math.PI); // 2pi in radions is 360 deg = full circle
        this.ctx.stroke();
        this.ctx.restore();
    }

}

/**
 * describes a circle and how to draw one
 */
class Circle implements Shape {
    //circles position
    public x: number = 0;
    public y: number = 0;
    // fill color?

    public radius: number = 50;
    public lineWidth: number = 5;
    public color: string = "red";
    public ctx: CanvasRenderingContext2D;
    constructor(x: number, y: number, radius: number, ctx: CanvasRenderingContext2D, color: string = "red", line_width: number = 8 ) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.lineWidth = line_width;
        this.color = color;
        this.ctx = ctx;
    }
    public draw = (): void => {
        this.ctx.save();
        this.ctx.beginPath(); 
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);// 2pi in radions is 360 deg = full circle
        this.ctx.stroke();
        this.ctx.restore();
    }

}

/**
 * uses fisher yates shuffle to reorder the array
 */
function number_shuffle() {
    let multipliers = ["15", "15", "15", "17", "17", "17", "19", "19", "19"];
    console.log("unshuffled multipliers " + multipliers);

    var m = multipliers.length, t, i;

    // while there are unshuffled multipliers
    while (m) {

        // pick a random unshuffled multiplier
        i = Math.floor(Math.random() * m--);

        // and swap it with that multiplier
        t = multipliers[m];
        multipliers[m] = multipliers[i];
        multipliers[i] = t;
    }
    return multipliers;
}

/**
 * adds shapes to the shape array and sets font
 */
function buildUI(ctx: CanvasRenderingContext2D, shape_array: Array<Shape>, multipliers) {
    ctx.font = "50px Arial";    

    shape_array.push(new Box(50, 50, 150, 150, ctx));
    shape_array.push(new Box(250, 50, 150, 150, ctx));
    shape_array.push(new Box(450, 50, 150, 150, ctx));
    shape_array.push(new Box(50, 250, 150, 150, ctx));
    shape_array.push(new Box(250, 250, 150, 150, ctx));
    shape_array.push(new Box(450, 250, 150, 150, ctx));
    shape_array.push(new Box(50, 450, 150, 150, ctx));
    shape_array.push(new Box(250, 450, 150, 150, ctx));
    shape_array.push(new Box(450, 450, 150, 150, ctx));
    shape_array.push(new Circle(830, 400, 120, ctx));
}

/**
 * takes the array of random numbers and generates random numbers until one is generated that is not already in the array and returns it
 */
function generate_random_number(random_numbers) {

    while (true) {
        let random_number = (Math.floor(Math.random() * 9) + 1);
        if (random_numbers.includes(random_number)) { 
            continue;
        }
        return random_number;
    }
}

function has_clicked_circle(event, canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // Circle was the last shape rendered to canvas so canvas assumes that is current path. If it was not I would have to specify
    return ctx.isPointInPath(x, y);
}

window.onload = () => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cnvs');
    // context is what we write to to do drawing etc on the canvas
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    canvas.addEventListener('click', (e) => {
        if (!has_clicked_circle(e, canvas, ctx)) {
            console.log("skipped click event");
            return;
        }
        console.log("you clicked");
        const random_number = generate_random_number(random_numbers);
        random_numbers.push(random_number);
        console.log("random number array: " + random_numbers);
        updateUI(ctx, shape_array, multipliers, random_numbers);

        
         // window timeout set to ensure UI if updated before alerting user of win/loss otherwise alert blocks the canvas from updating
        window.setTimeout(() => {
            const chosen_multipliers = get_multipliers(multipliers);
            const winning_value = get_winning_value(chosen_multipliers);
            if (winning_value !== undefined) {
                alert(`Congratulations! you win with two ${winning_value}'s. With and initial bet of ${initial_bet} you've won a total of ${initial_bet * winning_value}`);
                location.reload();
            }

            if (random_numbers.length >= 4 && winning_value === undefined) {
                alert("you lose");
                location.reload();
            }
        }, 1);
    });

    //generate multipliers in random order
    const multipliers = number_shuffle();

    const shape_array: Array<Shape> = new Array<Shape>();

    buildUI(ctx, shape_array, multipliers);

    updateUI(ctx, shape_array, multipliers, random_numbers);
}