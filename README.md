# AutoClass

Define argument types for functions and automatically add methods to prototype.


```js
var Rider = AutoClass(
    'Rider',
    String,
    Number,
    function (nick, number) {
        return {
            nick: nick,
            number: number
        };
    }
);

var ShowInfo = AutoClass(
    'ShowInfo',
    Rider,
    function (rider) {
        console.log(rider.nick + ', #' + rider.number);
    }
);

var dovi = Rider.valueOf()('Dovi', 4);
var iannone = Rider.valueOf()('The Maniac', 29);

dovi.ShowInfo(); // Logs "Dovi, #4"
iannone.ShowInfo(); // Logs "The Maniac, #29"
```

### Type conversions

```js
var Rider = AutoClass(
    'Rider',
    String,
    Number,
    function (nick, number) {
        console.log(typeof number); // Logs "number"
        return {
            nick: nick,
            number: number
        };
    }
);

var dovi = Rider.valueOf()('Dovi', '04');
```

### Create classes
Validate inputs, return value.

```js
var RacingNumber = AutoClass(
    'RacingNumber',
    Number,
    function (number) {
        if (isNaN(number) || number < 1) {
            throw new Error('Racing number must be positive integer.');
        }
        return Math.floor(number);
    }
);

var Rider = AutoClass(
    'Rider',
    String,
    RacingNumber,
    function (nick, racingNumber) {...}
);

```

License
----

ISC

