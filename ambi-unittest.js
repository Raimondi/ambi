/**
 * START sprintf() for JavaScript v.0.4 http://code.google.com/p/sprintf/
 */

function str_repeat(i, m) {
    for (var o = []; m > 0; o[--m] = i);
    return (o.join(''));
}

function sprintf() {
    var i = 0,
        a, f = arguments[i++],
        o = [],
        m, p, c, x;
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) o.push(m[0]);
        else if (m = /^\x25{2}/.exec(f)) o.push('%');
        else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) throw ("SprintfError: Too few arguments.");
            if (/[^s]/.test(m[7]) && (typeof (a) != 'number')) throw ("SprintfError: Expecting number but found " + typeof (a));
            switch (m[7]) {
            case 'b':
                a = a.toString(2);
                break;
            case 'c':
                a = String.fromCharCode(a);
                break;
            case 'd':
                a = parseInt(a);
                break;
            case 'e':
                a = m[6] ? a.toExponential(m[6]) : a.toExponential();
                break;
            case 'f':
                a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
                break;
            case 'o':
                a = a.toString(8);
                break;
            case 's':
                a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
                break;
            case 'u':
                a = Math.abs(a);
                break;
            case 'x':
                a = a.toString(16);
                break;
            case 'X':
                a = a.toString(16).toUpperCase();
                break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a > 0 ? '+' + a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length;
            p = m[5] ? str_repeat(c, x) : '';
            o.push(m[4] ? a + p : p + a);
        } else throw ("Huh ?!");
        f = f.substring(m[0].length);
    }
    return o.join('');
}
/**
 * END sprintf() for JavaScript v.0.4 http://code.google.com/p/sprintf/
 */
var showvars = function (pretext, varformat, posttext, ambiVars) { // first sprintf parameter is varname, second is value
        pretextoutput = false;
        outstr = '';
        //alert(Vars);
        for (key in ambiVars) {
            if (!pretextoutput) {
                pretextoutput = true;
                outstr = pretext;
            }
            outstr += sprintf(varformat, key, ambiVars[key]);
        }
        if (pretextoutput) {
            outstr += posttext;
        }
        return outstr;
    }
var shownllist = function (ambiResults) { // first sprintf parameter is varname, second is value
        outstr = '';
        //alert(Vars);
        for (key in ambiResults) {
            if (ambiResults[key]) {
                outstr += sprintf('%s', ambiResults[key]) + '\n';
            }
        }
        return outstr;
    }

function dounittest(utnum, utdesc, utcode, utvarsjson, utexpectedresultsjson) {
    // reconstitute Vars
    var utvars = JSON.parse(utvarsjson);
    TestCount += 1
    // do test
    var res = ambieval(utcode, utvars);
    // compare results
    var resjson = JSON.stringify(res)
    var success = resjson == utexpectedresultsjson;
    TestSuccess += (success ? 1 : 0)
    return '<tr class="unittestresult"><td>' + utnum + "</td><td>" + utdesc + "</td><td>" + utcode + "</td><td>" + resjson + "</td><td>" + (success ? 'OK' : "FAIL") + "</td></tr>"
    // report success/fail
}
var Vars = {};
var TestCount, TestSuccess;
$j = jQuery.noConflict();
$j(document).ready(function () {
    $j('#clearvars').hide();
    $j('#result').focus(

    function () {
        res = ambieval($j('#source').val(), Vars);
        $j('#result').text(shownllist(res['Results']));
        $j('#vars').html(showvars('<table>', '<tr><td>%s</td><td>%s</td></tr>', '</table>', res['Vars']));
        if (!$j.isEmptyObject(res['Vars'])) {
            $j('#clearvars').show();
        } else {
            $j('#clearvars').hide();
        }
        // create this program as a unit test case
        $j('#newunittest').text("        $j('#unittestsresults tr:last').after(dounittest(9999, 'Description', '" + $j('#source').val().replace(/(\r\n|\n|\r)/gm, "") + "', '" + JSON.stringify(Vars) + "', '" + JSON.stringify(res).replace(/'/g, "\\'") + "'));\n")
        // 
    });
    $j('#source').focus().select();
    $j('code.ambi').attr('title', 'Click to load this code.');
    $j('code.ambi').click(

    function () {
        //$j('#source').text($j(this).text());
        document.runform.source.value = $j(this).text()
        $j('#source').focus().select();
        //$j('#result').focus().select();
    });
    $j('#clearvars').click(

    function () {
        $j('#vars').html('');
        Vars = {};
        $j('#clearvars').hide();
        return false;
    });
    $j('#rununittests').click(

    function () {
        TestCount = 0;
        TestSuccess = 0;
        $j('.unittestresult').remove();
        $j('#unittestsresults tr:last').after(dounittest(1, 'Basic Addition', '1 2 + .', '{}','{"Errors":[],"Results":[3],"Vars":{},"TopStackVal":[3],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(2, 'Basic Multiplication', '1 2 * .', '{}', '{"Errors":[],"Results":[2],"Vars":{},"TopStackVal":[2],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(3, 'Basic Assignment', '1 2 * $a =', '{}', '{"Errors":[],"Results":[],"Vars":{"$a":2},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(4, 'Assign and use variable', '1 $a = 2 $b = $a $b + .', '{}', '{"Errors":[],"Results":[3],"Vars":{"$a":1,"$b":2},"TopStackVal":[3],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(5, 'For with Comment', '// Enumerate the first 10 square numbers;for;  1 $i =;  $i 11 <;  1 $i +=;  $i sq .;  ;', '{}', '{"Errors":[],"Results":[1,4,9,16,25,36,49,64,81,100],"Vars":{"$i":11},"TopStackVal":[1],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(6, 'Define and use function', '// Calculate Area Of Circle ;function; areaofcircle;  pi import sq product export;5 areaofcircle . ', '{}', '{"Errors":[],"Results":[78.53981633974483],"Vars":{},"TopStackVal":[78.53981633974483],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(7, 'Define and use multiple functions', 'function; inner-root3;  if;    import $n = import $prev = $prev $n $prev sq / + .5 * $guess = $guess $prev - abs .000000001 >;    $guess $n inner-root3 $guess =;    $guess export;function; root3;  import dup inner-root3 export ;100 root3 .', '{}', '{"Errors":[],"Results":[4.641588833420129],"Vars":{},"TopStackVal":[4.641588833420129],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(8, 'Variable without Value', '1 $a + .', '{}', '{"Errors":["AmbiError: \'$a\' doesn\'t have a value."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(9, 'For Loop', '// Function to Enumerate N numbers starting with M;function; generate;for;  import $count = import $start = $start $i =;  $i $start $count + <;  1 $i +=;  $i export;  ;1 10 generate ..', '{}', '{"Errors":[],"Results":[1,2,3,4,5,6,7,8,9,10],"Vars":{},"TopStackVal":[1,2,3,4,5,6,7,8,9,10],"TopStackVar":[null,null,null,null,null,null,null,null,null,null]}'));
        $j('#unittestsresults tr:last').after(dounittest(10, 'Ifelse, import, export', 'function; ! ;  ifelse;    import $n = $n 1 eq;    1 export;    $n 1 - ! $n * export;    ;// Use the function ;5 ! .', '{}', '{"Errors":[],"Results":[120],"Vars":{},"TopStackVal":[120],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(11, 'Basic Addition - Polish', '. +  1 2', '{}', '{"Errors":[],"Results":[3],"Vars":{},"TopStackVal":[3],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(12, 'Factorial Function (Postfix version)', '// Factorial Function (Postfix version);. ! 6 ;// Define the function ;    ;    $n 1 - ! $n * export;    1 export;    import $n = $n 1 eq;  ifelse;! ; function ', '{}', '{"Errors":[],"Results":[720],"Vars":{},"TopStackVal":[720],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(13, 'Function with name but no expression.', 'function; abc;', '{}', '{"Errors":["AmbiError: Function doesn\'t have a name plus an expression."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(14, 'Multiple expressions to evaluate.', ' 1 2 + . ;  1 2 + . ;', '{}', '{"Errors":["AmbiError: There is more than one expression to evaluate."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(15, 'Function without name or expression.', 'function', '{}', '{"Errors":["AmbiError: Function doesn\'t have a name plus an expression."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(16, 'Function definition without expression to evaluate.', 'function; ab ; 1 ', '{}', '{"Errors":["AmbiError: There is no expression to evaluate."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(17, 'For without all five expressions', '// Enumerate the first 10 square numbers;for;  1 $i =;  $i 11 <;  1 $i +=;  $i sq .;  ', '{}', '{"Errors":["AmbiError: \'for\' doesn\'t have all 5 expressions."],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));
        $j('#unittestsresults tr:last').after(dounittest(18, 'Mixed case should not confuse things.', 'FUNCTion; INNER-ROOT3; IF; IMPORT $N = IMPORT $PREV = $PREV $N $PREV SQ / + .5 * $GUESS = $GUESS $PREV - ABS .000000001 >; $guess $n inner-root3 $guess =; $guess export;function; root3; import dup inner-root3 export ;100 root3 .', '{}', '{"Errors":[],"Results":[4.641588833420129],"Vars":{},"TopStackVal":[4.641588833420129],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(19, 'Two functions one which calls the other.', 'function; inner-root3;  if;    import $n = import $prev = $prev $n $prev sq / + .5 * $guess = $guess $prev - abs .000000001 >;    $guess $n inner-root3 $guess =;    $guess export;function; root3;  import dup inner-root3 export ;100 root3 .', '{}', '{"Errors":[],"Results":[4.641588833420129],"Vars":{},"TopStackVal":[4.641588833420129],"TopStackVar":[null]}'));
        $j('#unittestsresults tr:last').after(dounittest(20, 'Undefined operator', '1 2 supercalifragilisticexpialidocious .', '{}', '{"Errors":["AmbiError: \'supercalifragilisticexpialidocious\' is an undefined operator"],"Results":[],"Vars":{},"TopStackVal":[],"TopStackVar":[]}'));


        $j('#unittestsresults').before('<p class="unittestresult">' + TestSuccess / TestCount * 100 + '% Pass Rate</p>')
        return false;
    });
});