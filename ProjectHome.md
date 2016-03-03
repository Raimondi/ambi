## Try out latest version. ##
[Ambi Calculator and Programming in your browser](http://www.davidpratten.com/ambi).

[\*New\* Now a Full Screen Chrome App and Chrome Popup Extension](https://chrome.google.com/webstore/search/ambi%20calculator)

## Author ##
The Ambi Calculator and Programming Language was created by [David Pratten](http://davidpratten.com).

## Introduction ##

Ambi is a programming language generalised from Reverse Polish Notation arithmetic and an extensible RPN Calculator hosted in the browser. Other languages such as [Forth](http://en.wikipedia.org/wiki/Forth_(programming_language)) and [RPL](http://en.wikipedia.org/wiki/RPL_%28programming_language%29) have similar roots and illustrious histories, but have embraced non-RPN elements as they developed. In contrast, Ambi attempts to stick strictly to the RPN approach. Ambi also has similarities to the [CAT](http://en.wikipedia.org/wiki/Cat_(programming_language)) language.

## Why "Ambi" ##

"Ambi" is named for its ability to be ambidextrous with expressions and programs. Ambi detects and correctly evaluates expressions and programs either in Reverse Polish Notation or in Polish Notation. For example, the following two expressions give the same answer:
```
3 5 + 2 / .
```
and
```
. / + 3 5 2
```

## Documentation ##

### Expressions ###

Expressions are terminated by semi-colons: ";" Each expression starts with a fresh stack. Variables defined in one expression are available in expressions evaluated later. Expressions can be of arbitary length. Empty expressions ";;" are equivalent to ";true;".

### Comments ###

Comments are a special kind of expression that begins and/or ends with "//".

### Operators ###

_Ambi operators are not case sensitive._

  * Arithmetic operators include: **+ - `*` / sq sqrt abs ln floor ceil min max exp inv pow**
  * The Unary Minus operator is **`_`**.
  * Aggregate operators include: **sum sumsq product**.
  * Boolean operators include: **== eq != <> neq < lt > gt <= lte >= gte && and || or ! not**
  * Trigonometry operators (radians) include: **sin cos tan asin acos atan**
  * The stack operators include **dup swap drop**
  * The assignment operator is **=**
  * Compound operators include: **+= -= /= `*`= ++ `--`**
  * The **.** or **printtop** operator will print the number on top of the stack. While the **..** or **printall** operator will print the all the numbers in the stack.

### Values ###

Booleans are represented by numeric values. Non-zero is True, 0 is False.

### Constants ###

**true** has value 1. **false** as value 0. The constants **pi** and **e** are available.

### Variables ###

Variables are names that start with "$". Examples of valid variable names include: **$a, $5, $count** Variables defined outside functions are preserved between program executions. Variables define inside functions are local to the function. There are no global variables.

### Examples ###

Simple Calculation

```
// Simple Calculation ; 
1 2 + 3 + 5 + 7 / .
```

Monitor Stack

```

// Show stack values ;
1 . 2 . + .
```



Variable Assignment

```

// Variable Assignment and Use ;
1 $a = 2 $b = $a $b + .
```

Aggregate Function Example

```

// Area of circle of radius 5 ;
5 $radius = pi $radius sq product . 
```

### Multi-expression programs ###

Programs may be built up by treating the expressions as lambdas acted on by the: **if ifelse whiledo dowhile** and **function** operators.

The **if** operator executes the second lamda expression on the stack depending on the result of executing the first. And then executes the finalise expression.

```

// if operator ;
if;
  23.4 $a = $a floor 23 ==;
  $a .;
  ;

```

Equivalently ...

```

// if operator ;
  ;
  $a .;
  23.4 $a = $a floor 23 ==;
if;
```
```
if;
  <initialise & test expression>;
  <if true expression>;
  <finalise expression>;
```
```
  <finalise expression>;
  <if true expression>;
  <initialise & test expression>;
if;
```

The **ifelse** operator is similar except that it has an <if false expression> as well.

```
ifelse;
  <initialise & test expression>;
  <if true expression>;
  <if false expression>;
  <finalise expression>;
```
```
  <finalise expression>;
  <if false expression>;
  <if true expression>;
  <initialise & test expression>;
ifelse;
```


The **whiledo** operator and **dowhile** operators differ only in that **whiledo** evaluates the test expression before executing the repeated expression while **dowhile** evaluates the repeated expression at least once and then checks the test expression.

_The reverse polish variants of these operators are not shown here for brevities sake._
```
whiledo;
  <initialise expression>;
  <test expression>;
  <repeated expression>;
  <finalise expression>;
```
```
dowhile;
  <initialise expression>;
  <repeated expression>;
  <test expression>;
  <finalise expression>;
```

The **for** operator mirror's the C style for construct.

_The reverse polish variant of this operator is not shown here._

```
for;
  <initialise expression>;
  <test expression>;
  <increment expression>;
  <repeated expression>;
  <finalise expression>;
```
```
// Enumerate the first 10 square numbers;
for;
  1 $i =;
  $i 11 <;
  1 $i +=;
  $i sq .;
  ;
```

Functions are defined using the **function** operator, which binds a lambda expression to a name. The only communication between a function and its calling context is via the **import** and **export** operators. Within a function body **import** will pop one item off the calling context's stack and push it onto the local stack. Conversely, **export** takes one item off the local stack and pushes it onto the calling context's stack.

_The reverse polish variant of this operator is not shown here._

```
function; <name>;
<function body expression>;
```
```
// Function to Enumerate N numbers starting with M;
function; generate;
for;
  import $count = import $start = $start $i =;
  $i $start $count + <;
  1 $i +=;
  $i export;
  ;

1 10 generate ..
```

### Further Examples ###

```
// Calculate Area Of Circle ;
function; areaofcircle;
  pi import sq product export;

5 areaofcircle . 
```

Recursive Factorial Function (Prefix version)
```
function; ! ;
  ifelse;
    import $n = $n 1 eq;
    1 export;
    $n 1 - ! $n * export;
    ;

// Use the function ;
5 ! .
```

Equivalent Factorial Function (Postfix version)

```
// Factorial Function (Postfix version);
. ! 6 ;
// Define the function ;

    ;
    $n 1 - ! $n * export;
    1 export;
    import $n = $n 1 eq;
  ifelse;
! ; function 
```

The following two programs are equivalent:

```

function;
max;
  ifelse;
    import dup $a = import dup $b = >;
    $a export;
    $b export;
    ;

1 100 max .;
```

```

function;
max;
  ifelse;
    > = $a dup import = $b dup import;
    export $a;
    export $b;
    ;

. max 1 100;
```

Interative Cuberoot Function using X(r+1) = 0.5[+ N/(Xr)^2](Xr.md);
```
function; cuberoot;
  dowhile;
    import dup $n = $guess =;
    $guess $prev = $n $prev sq / $prev + .5 * $guess =;
    $guess $prev - abs .000000001 >;
    $guess export ;
125 cuberoot .
```

... and a recursive Cuberoot Function

```
function; inner-root3;
  if;
    import $n = import $prev = $prev $n $prev sq / + .5 * $guess = $guess $prev - abs .000000001 >;
    $guess $n inner-root3 $guess =;
    $guess export;

function; root3;
  import dup inner-root3 export ;

100 root3 .
```

## Implementation ##

Ambi is currently implemented in javascript that executes completely in your browser.

## Version Change Log ##

0.6
  * ADD: **drop, pow, exp, and inv** operators
  * ADD: 9 short lessons on how to use ambi
  * CHG: Complete redesign of UI using browser local storage to preserve state across invocations. Added 'My Ambi Functions' which are persistent. UI now auto recalculates as the expression is edited.
  * ADD: Added extensive error reporting.
  * ADD: Virtual Keyboard.
  * CHG: Removal of global variable dependencies from ambi.js
  * ADD: Unit tests

0.4.4 Streamlining.

  * ADD: The increment and decrment **++ --** operators.
  * CHG: Removed the **seq** operator. It is no longer necessary.
  * ADD: Added the **pass** constant. It does nothing, it is behaves as a synonym for **true**.
  * CHG: The empty expression ";;" is now equivalent to ";pass;" .
  * CHG: Added <initialise expression> to the **dowhile whiledo** and **for** operators. Added <finalise expression> to the **if ifelse dowhile whiledo** and **for** operators. The initialise and finalise expressions must always present but may be **pass** or simply empty.

0.4.3 Ambi is now Turing complete.

  * ADD: Added **seq dowhile whiledo for if ifelse** operators.
  * ADD: Added **function import export** operators.
  * ADD: Added **.** operator (Synonym for printtop)
  * ADD: Added **..** operator (Synonym for printall) which prints the whole stack.
  * ADD: Added **dup** **swap** stack operators.
  * ADD: Added **min** and **max** binary arithmetic operators.
  * ADD: Added **//** comment operator
  * ADD: Added mathematical constant **e**.
  * CHG: The unary minus operator is changed from **-** to **`_`**.
  * CHG: The prefix form of the assignment operator is now **=** <var> <br>
<br>
<val><br>
<br>
<br>
<ul><li>FIX: Variables were not pushed onto stack with immutable value only by mutable reference.</li></ul>

0.4.2 further explands the arithmetic capabilities of Ambi.<br>
<br>
<ul><li>ADD: Added trigonometry operators and constants.<br>
</li><li>FIX: Expressions beginning with a constant such as <b>true</b> where not correctly evaluated.<br>
</li><li>ADD: Added display of variables.<br>
</li><li>FIX: The unary minus operator is changed from <b>un</b> to <b>um</b>.</li></ul>

0.4.1 is aimed at greatly expanding the arithmetic capabilities of Ambi.<br>
<br>
<ul><li>ADD: Added boolean operators.<br>
</li><li>ADD: Added aggregate operators.<br>
</li><li>ADD: Added many arithmetic operators.</li></ul>

0.4.0 is the first public release.