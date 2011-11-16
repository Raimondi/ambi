/*
Ambi Programming Language 0.6.0 A Reverse Polish (and polish) Notation Calculator and Programming Language
Copyright (C) 2009-2011  David Pratten david@prattenmail.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
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
            outstr += sprintf('%s', ambiResults[key]) + '\t';
        } else {
            outstr += 'Undefined\n';
        }
    }
    return outstr;
}
var stacknllist = function (TopStackVal, TopStackVar) { // first sprintf parameter is varname, second is value
    outstr = '';
    //alert(Vars);
    for (key in TopStackVal.reverse()) {
        if (TopStackVar[key]) {
            outstr += sprintf('%s', TopStackVar[key])+'\t';
        } else { 
            if (TopStackVal[key]) {
                outstr += sprintf('%s', TopStackVal[key]) + '\t';
            } else {
                outstr += 'Undefined\n';
            }
        }
    }
    return outstr;
}
var execanddisplay = function() {
    res = ambieval($j('#source').val(), Vars);
    $j('#result').text(shownllist(res['Results']));
    $j('#stack').text(stacknllist(res['TopStackVal'],res['TopStackVar']));
    $j('#vars').html(showvars('<table id="varlist">', '<tr><td>%s</td><td>%s</td></tr>', '</table>', res['Vars']));
    if (!$j.isEmptyObject(res['Vars'])) {
        $j('#clearvars').show();
    } else {
        $j('#clearvars').hide();
    }

}

var Vars = {};
$j = jQuery.noConflict();
    $j(document).ready(function () {
    $j('#clearvars').hide();
    $j('#result').focus(
    function () {
        execanddisplay();
    });
    $j('#source').keyup(
    function(event) {
        if (event.keyCode == 32 || event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 190) {
            execanddisplay();
        }
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
});