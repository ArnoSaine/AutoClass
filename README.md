# AutoClass

Define argument types for functions and automatically add methods to prototype.

## Installation

```
npm install autoclass
```

## Example

```js
var AutoClass = require('autoclass');

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

var dovizioso = Rider('Dovi', 4);
var iannone = Rider('The Maniac', 29);

dovizioso.ShowInfo(); // Logs "Dovi, #4"
iannone.ShowInfo(); // Logs "The Maniac, #29"
```

### AutoClass(name[, ...type], func)

##### name: **String** or **Any**

A string to use as a method name. If an empty string or not a string, no methods are added.

##### type: **Constructor** or [Type](#type)

Zero or more constructors. `func` arguments are validated using these corresponding types. Methods are added to prototypes of constructors. Methods are not added to array or variadic types.

##### func: **Function**

Function to execute, when [instance](#values-and-instances) as function or instance's method is invoked. `func` should have equal amount of named arguments as types are declared. `func` gets called with formatted and validated (see [type](#type)) argument [values](#values-and-instances). Its `this` value is set to object with argument names of `func` as keys and argument instances as values.

##### Returns: [Instance](#values-and-instances)

```js
var MyClass = AutoClass(
    'MyClass',
    String,
    function (text) {
        return text;
    }
);
```

### Type

Three kinds of types can be declared - basic, array, and variadic.

```js
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
);

MyClass('text', null, [1, 2, 3], 'a', 'b', 'c', true); // Logs: "MyClass"
```

### Type conversions

If `instanceof` test fails, instance is passed to constructor.

```js
var Rider = AutoClass(
    'Rider',
    String,
    Number,
    function (nickname, number) {
        console.log(typeof number); // Logs "number"
        return {nickname, number};
    }
);

var dovizioso = Rider('Dovi', '04');
```

If class requires at least two types (variadic type is not considered), constructing from object literal is possible.

```js
// `ShowInfo` requires `Rider`
ShowInfo({
    nickname: 'PoleMan',
    number: 51
}); // Logs: "PoleMan, #51"
```

### Values and instances

Function arguments are **values**. Use `this.argumentName` to access **instance**.

```js
var MyClass = AutoClass('MyClass', Number, function (number) {return number;});

var TestType = AutoClass(
    'TestType',
    MyClass,
    AutoClass,
    function (a, type) {
        console.log(a);
        console.log(this.a instanceof type);
    }
);

TestType(123, MyClass); // Logs: 123; true
```

Function and method calls return **instance**. Use `.valueOf()` to access return **value**.

```js
var MyClass = AutoClass(
    'MyClass',
    Object,
    function (obj) {
        return obj;
    }
);

var ref = {};

console.log(MyClass(ref).valueOf() === ref); // Logs: true
```

### Create classes

Validate inputs, return value.

```js
var BikeNumber = AutoClass(
    'BikeNumber',
    Number,
    function (number) {
        if (isNaN(number)) {
            throw new Error('Bike number must be positive integer, got NaN.');
        }
        if (number < 1) {
            throw new Error(`Bike number must be positive integer, got ${number}.`);
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

try {
    Rider('The Ice Man', -36); // Throws: "Error: Bike number must be positive integer, got -36."
} catch (e) {
    console.log(e);
}

try {
    Rider('The Doctor', 'VR46'); // Throws: "Error: Bike number must be positive integer, got NaN."
} catch (e) {
    console.log(e);
}
```

## License

ISC
