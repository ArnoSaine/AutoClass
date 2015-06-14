import AutoClass from './../../../AutoClass';
import assert from 'assert';

////////////////////////////////
var Rider = AutoClass(
    'Rider',
    String,
    Number,
    function (nickname, number) {
        return {nickname, number};
    }
);

var ShowInfo = AutoClass(
    'ShowInfo',
    Rider,
    function (rider) {
        console.log(rider.nickname + ', #' + rider.number);
    }
);

var dovizioso = Rider.valueOf()('Dovi', 4);
var iannone = Rider.valueOf()('The Maniac', 29);

dovizioso.ShowInfo(); // Logs "Dovi, #4"
iannone.ShowInfo(); // Logs "The Maniac, #29"
////////////////////////////////
var MyClass = AutoClass(
    'MyClass',
    String,
    function (text) {
        return text;
    }
);
////////////////////////////////
var MyClass = AutoClass(
    'MyClass',
    String, // Basic types. Validated using `instanceof` operator.
    Object,
    [Number], // Array types. Each element is validated like basic type.
    [[String]], // Variadic type. Function may also have one variadic type. Validated like array type.
    Boolean, // More types...
    function (someText, obj, nums, texts, bool) {
        console.log('MyClass');
    }
).valueOf();

MyClass('text', null, [1, 2, 3], 'a', 'b', 'c', true); // Logs: "MyClass"
////////////////////////////////
var Rider = AutoClass(
    'Rider',
    String,
    Number,
    function (nickname, number) {
        console.log(typeof number); // Logs "number"
        return {nickname, number};
    }
);

var dovizioso = Rider.valueOf()('Dovi', '04');
////////////////////////////////
// `ShowInfo` requires `Rider`
ShowInfo.valueOf()({
    nickname: 'PoleMan',
    number: 51
}); // Logs: "PoleMan, #51"
////////////////////////////////
var ClassA = AutoClass('ClassA', Number, function (number) {return number;});

var ClassB = AutoClass(
    'ClassB',
    ClassA,
    function (a) {
        console.log(a);
        console.log(this.a instanceof ClassA.valueOf());
    }
);

ClassB.valueOf()(123); // Logs: 123; true
////////////////////////////////
var MyClass = AutoClass(
    'MyClass',
    Object,
    function (obj) {
        return obj;
    }
);

var MyClassFunc = MyClass.valueOf();
var ref = {};

console.log(MyClassFunc(ref).valueOf() === ref); // Logs: true
////////////////////////////////
var BikeNumber = AutoClass(
    'BikeNumber',
    Number,
    function (number) {
        if (isNaN(number) || number < 1) {
            throw new Error('Bike number must be positive integer.');
        }
        return Math.floor(number);
    }
);

var Rider = AutoClass(
    'Rider',
    String,
    BikeNumber,
    function (nickname, bikeNumber) {/*...*/}
);
////////////////////////////////

assert.throws(function () {
	BikeNumber('a');
}, Error, 'NaN');

assert.throws(function () {
	BikeNumber(0);
}, Error, 'not positive');
