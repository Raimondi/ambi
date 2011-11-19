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
var shownlerrors = function (ambiErrors) { // first sprintf parameter is varname, second is value
    outstr = '';
    //alert(Vars);
    for (key in ambiErrors) {
        if (typeof(ambiErrors[key])!='undefined') {
            if (ambiErrors[key] != 'AmbiError: There is no expression to evaluate.')  {
                outstr += ambiErrors[key] + '\n';
            }
        } else {
            outstr += 'Undefined\n';
        }
    }
    return outstr;
}

var shownllist = function (ambiResults,prefix) { // first sprintf parameter is varname, second is value
    outstr = '';
    //alert(Vars);
    for (key in ambiResults) {
        if (typeof(ambiResults[key])!='undefined') {
            outstr += ambiResults[key].toPrecision(15).replace(/\.0*$/, '').replace(/(\.[^0]*)0*$/, '$1') + '\n';
        } else {
            outstr += 'Undefined\n';
        }
    }
    return outstr==''?'':prefix+outstr;
}
var stacknllist = function (TopStackVal, TopStackVar) { // first sprintf parameter is varname, second is value
    outstr = '';
    //alert(Vars);
    var revTopStackVal = TopStackVal.reverse();
    var revTopStackVar = TopStackVar.reverse();
    for (key in revTopStackVal) {
        if (typeof(revTopStackVar[key])!="undefined") {
            outstr += revTopStackVar[key]+'\n';
        } else { 
            if (typeof(revTopStackVal[key])!="undefined") {
                outstr += revTopStackVal[key].toPrecision(15).replace(/\.[0]*$/, '').replace(/(\.[^0]*)0*$/, '$1') + '\n';
            } else {
                outstr += 'Undefined\n';
            }
        }
    }
    return outstr;
}
var execanddisplay = function() {
    $j.jStorage.set("ambisource", $j('#source').val())
    $j.jStorage.set("ambifunctions", $j('#functions').val())
    res = ambieval($j('#functions').val()+$j('#source').val(), Vars);
    Vars = res['Vars']
    updatevars();
    $j('#stack').val(
        shownlerrors(res['Errors'],'')+
        stacknllist(res['TopStackVal'],res['TopStackVar'])+
        shownllist(res['Results'],'\nPrinted Results:\n')+
        showvars('\nVariables:\n', '%s: %s\n', '', Vars)
        );
    $j.jStorage.set("ambiVars", Vars);

}
var updatevars = function() {
    if (!$j.isEmptyObject(Vars)) {
        $j('#clearvars').show();
    } else {
        $j('#clearvars').hide();
    }
}
var Vars = {}
$j = jQuery.noConflict();
$j.fn.extend({
    insertAtCaret: function(myValue){ // from http://stackoverflow.com/questions/946534/insert-text-into-textarea-with-jquery/946556#946556
      return this.each(function(i) {
        if (document.selection) {
          //For browsers like Internet Explorer
          this.focus();
          sel = document.selection.createRange();
          sel.text = myValue;
          this.focus();
        }
        else if (this.selectionStart || this.selectionStart == '0') {
          //For browsers like Firefox and Webkit based
          var startPos = this.selectionStart;
          var endPos = this.selectionEnd;
          var scrollTop = this.scrollTop;
          this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
          this.focus();
          this.selectionStart = startPos + myValue.length;
          this.selectionEnd = startPos + myValue.length;
          this.scrollTop = scrollTop;
        } else {
          this.value += myValue;
          this.focus();
        }
      })
    }
    });
    $j(document).ready(function () {
    Vars = $j.jStorage.get("ambiVars", {});
    updatevars();
    $j('#source').keyup(
    function(event) {
        if (event.keyCode == 46 || event.keyCode == 32 || event.keyCode == 8 || event.keyCode == 13 || event.keyCode == 190) {
            execanddisplay();
        }
    });
    $j('#source').focus().select();
    $j('code.ambi').attr('title', 'Click to load this code.');
    $j('code.ambi').click(

    function () {
        //$j('#source').val($j(this).val());
        document.runform.source.value = $j(this).val()
        $j('#source').focus().select();
        //$j('#result').focus().select();
    });
    $j('#showkbd').click(
    function () {
        $j('#virtualkbd').toggle();
        $j('#showkbd').toggle();
        $j('#hidekbd').toggle();
        $j.jStorage.set("ambishowkbd", true);
        return false;
    });
    $j('#hidekbd').click(
    function () {
        $j('#virtualkbd').toggle();
        $j('#showkbd').toggle();
        $j('#hidekbd').toggle();
        $j.jStorage.set("ambishowkbd", false);
        return false;
    });
    if ($j.jStorage.get("ambishowkbd", false)) {
        $j('#showkbd').toggle();
    } else {
        $j('#virtualkbd').toggle();
        $j('#hidekbd').toggle();
    };
    $j('#functions').val($j.jStorage.get("ambifunctions", 'function; log; // N Base log; import import ln swap ln / export;\nfunction; areaofcircle; // R areaofcircle ; pi import sq product export;\nfunction; perimeterofcircle; // R areaofcircle ; pi import 2 product export;'));
    $j('#source').val($j.jStorage.get("ambisource", ''));
    $j('#functions').attr('spellcheck', 'false');
    $j('#source').attr('spellcheck', 'false');
    execanddisplay();
    $j('.ambikbd').click(
    function () {
        var padding = '';
        if ($j(this).attr('title').slice(0,6) != 'Keypad' ) {
            padding = ' ';
        }
        var input = $j(this).text();
        if (input == 'Space') input = ' ';
        $j("#source").insertAtCaret(padding+input+padding); //
        execanddisplay();
        return false;
    });
    $j('#clearvars').click(
    function () {
        Vars = {};
        $j.jStorage.set("ambiVars", Vars);
        execanddisplay();
        return false;
    });
    $j('.eg').click(
    function () {
        var code;
        $j('#source').focus().val(egtext($j(this).html()));
        execanddisplay();
        return false;
    });
   $j('#clear').click(
    function () {
        $j('#source').val('');
        execanddisplay();
        $j('#source').focus() // focus with cursor at end of field
        return false;
    });
    $j('.eg').mouseover(
    function () {
       $j(this).attr('title',egtext($j(this).html()));
        return false;
    });
});
var egtext = function(egno) {
    var code;
    switch(egno)
    {
        case "#1": code = '1 2 + '; break;
        case "#2": code = '// #2 Notice that the results of the calculation are shown in the "Results" column to the right. //;\n3 5 * 45 + '; break;
        case "#3": code = '// #3 Press the backspace key and watch Ambi recalculate the shorter expressions. ;\n2 3 + sq '; break;
        case "#4": code = '// #4 Add further numbers and then mathematical operators (e.g. -,sqrt,sin, ...)and watch Ambi recalculate the longer expressions. //;\n25 sqrt '; break;
        case "#5": code = '// #5 Click the "Keyboard" icon for help with what operators are available.;\n11 13  - '; break;
        case "#6": code = '// #6 Comments begin or end with a //;\n// Expressions and comments are terminated by a ;\n7 11 / sqrt '; break;
        case "#7": code = '// #7 All calculations are performed in your browser;\n// Ambi stores the state of the current calculation in your browser\'s local storage.;\n13 17 *'; break;
        case "#8": code = '// #8 The "." command will print the lastest calculation.;\n// The ".." command will print all the values;\n12.31 76.34 54.12 11.98 .. sum . \n'; break;
        case "#9": code = '// #9 "My Ambi Functions" are also available for use just like any other function.;\n// For example, a function to calculate the area of a circle is defined below.;\n10 . areaofcircle . '; break;
        default: code = '// Unknown example.'
    }
    return code;
}