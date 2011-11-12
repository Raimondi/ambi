/*
Ambi Programming Language 0.4.0 A Reverse Polish (and polish) Notation Calculator and Programming Language
Copyright (C) 2009  David Pratten david@davidpratten.com

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
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
function dump(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object') { //Array/Hashes/Objects
 for(var item in arr) {
  var value = arr[item];
 
  if(typeof(value) == 'object') { //If it is an array,
   dumped_text += level_padding + "'" + item + "' ...\n";
   dumped_text += dump(value,level+1);
  } else {
   dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
  }
 }
} else { //Stings/Chars/Numbers etc.
 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
} 




/**
 * Start Copied from http://www.nicknettleton.com/zine/javascript/trim-a-string-in-javascript
 */
String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); }
/**
 * End Copied from http://www.nicknettleton.com/zine/javascript/trim-a-string-in-javascript
 */
// trim trailing ;
String.prototype.trimsemis = function() { return this.replace(/;$/g, ''); }




/***************************************************
Expression evaluation stack
***************************************************/


function AmbiExprStack(ProgStack) {
	this.rpn = true; // perhaps we need to do the execution as part of the creation 
	this.stackval = new Array();
	this.stackvar = new Array();
	this.ProgStack = ProgStack; // ref to caller
// operators

}
AmbiExprStack.prototype.OpList = Array();
AmbiExprStack.prototype.OpFunc = Array();
AmbiExprStack.prototype.ConstList = Array();
AmbiExprStack.prototype.ConstFunc = Array();

// true Constant
AmbiExprStack.prototype.AmbiExprTrue = function(that)  {
	that.push(1);
}
AmbiExprStack.prototype.ConstList.push("true");
AmbiExprStack.prototype.ConstFunc.push(AmbiExprStack.prototype.AmbiExprTrue);
AmbiExprStack.prototype.ConstList.push("pass");
AmbiExprStack.prototype.ConstFunc.push(AmbiExprStack.prototype.AmbiExprTrue);

// false Constant
AmbiExprStack.prototype.AmbiExprFalse = function(that)  {
	that.push(0);
}
AmbiExprStack.prototype.ConstList.push("false");
AmbiExprStack.prototype.ConstFunc.push(AmbiExprStack.prototype.AmbiExprFalse);

// pi Constant
AmbiExprStack.prototype.AmbiExprPI = function(that)  {
	//alert(Math.PI);
	that.push(Math.PI);
}
AmbiExprStack.prototype.ConstList.push("pi");
AmbiExprStack.prototype.ConstFunc.push(AmbiExprStack.prototype.AmbiExprPI);

// e Constant
AmbiExprStack.prototype.AmbiExprE = function(that)  {
	that.push(Math.E);
}
AmbiExprStack.prototype.ConstList.push("e");
AmbiExprStack.prototype.ConstFunc.push(AmbiExprStack.prototype.AmbiExprE);


// - Operator
AmbiExprStack.prototype.AmbiExprMinus = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push(b - a);
	} else {
		that.push(a - b);
	}
}
AmbiExprStack.prototype.OpList.push("-");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiExprMinus);

// + Operator
AmbiExprStack.prototype.AmbiExprPlus = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push(b + a);
}
AmbiExprStack.prototype.OpList.push("+");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiExprPlus);

// * Operator
AmbiExprStack.prototype.AmbiMult = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push(b * a);
}
AmbiExprStack.prototype.OpList.push("*");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMult);

// - Operator
AmbiExprStack.prototype.AmbiDiv = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push(b / a);
	} else {
		that.push(a / b);
	}
}
AmbiExprStack.prototype.OpList.push("/");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiDiv);

// - Operator
AmbiExprStack.prototype.AmbiMod = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push(b % a);
	} else {
		that.push(a % b);
	}
}
AmbiExprStack.prototype.OpList.push("%");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMod);


// dup - Operator
AmbiExprStack.prototype.AmbiDup = function(that)  {
	a = that.popval();
	that.push(a);
	that.push(a);
}
AmbiExprStack.prototype.OpList.push("dup");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiDup);

// swap - Operator
AmbiExprStack.prototype.AmbiSwap = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push(a);
	that.push(b);
}
AmbiExprStack.prototype.OpList.push("swap");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSwap);



// unary - Operator
AmbiExprStack.prototype.AmbiUM = function(that)  {
	a = that.popval();
	that.push(a*-1);
}
AmbiExprStack.prototype.OpList.push("_");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiUM);

// max Operator
AmbiExprStack.prototype.AmbiMax = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push(Math.max(a,b));
}
AmbiExprStack.prototype.OpList.push("max");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMax);

// max Operator
AmbiExprStack.prototype.AmbiMin = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push(Math.min(a,b));
}
AmbiExprStack.prototype.OpList.push("min");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMin);



// sqrt Operator
AmbiExprStack.prototype.AmbiSQRT = function(that)  {
	a = that.popval();
	that.push(Math.pow(a,.5));
}
AmbiExprStack.prototype.OpList.push("sqrt");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSQRT);

// sq Operator
AmbiExprStack.prototype.AmbiSQ = function(that)  {
	a = that.popval();
	that.push(Math.pow(a,2));
}
AmbiExprStack.prototype.OpList.push("sq");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSQ);

// abs Operator
AmbiExprStack.prototype.AmbiABS = function(that)  {
	a = that.popval();
	that.push(Math.abs(a));
}
AmbiExprStack.prototype.OpList.push("abs");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiABS);

// ln Operator
AmbiExprStack.prototype.AmbiLN = function(that)  {
	a = that.popval();
	that.push(Math.log(a));
}
AmbiExprStack.prototype.OpList.push("ln");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiLN);

//
// Boolean Operators
//
// < Operator
AmbiExprStack.prototype.AmbiLT = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push((b < a)*1);
	} else {
		that.push((a < b)*1);
	}
}
AmbiExprStack.prototype.OpList.push("<");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiLT);
AmbiExprStack.prototype.OpList.push("lt");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiLT);

// > Operator
AmbiExprStack.prototype.AmbiGT = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push((b > a)*1);
	} else {
		that.push((a > b)*1);
	}
}
AmbiExprStack.prototype.OpList.push(">");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiGT);
AmbiExprStack.prototype.OpList.push("gt");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiGT);

// <= Operator
AmbiExprStack.prototype.AmbiLTE = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push((b <= a)*1);
	} else {
		that.push((a <= b)*1);
	}
}
AmbiExprStack.prototype.OpList.push("<=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiLTE);
AmbiExprStack.prototype.OpList.push("lte");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiLTE);

// >= Operator
AmbiExprStack.prototype.AmbiGTE = function(that)  {
	a = that.popval();
	b = that.popval();
	if (that.rpn) {
		that.push((b >= a)*1);
	} else {
		that.push((a >= b)*1);
	}
}
AmbiExprStack.prototype.OpList.push(">=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiGTE);
AmbiExprStack.prototype.OpList.push("gte");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiGTE);

// != Operator
AmbiExprStack.prototype.AmbiNEQ = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push((b != a)*1);
}
AmbiExprStack.prototype.OpList.push("!=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiNEQ);
AmbiExprStack.prototype.OpList.push("<>");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiNEQ);
AmbiExprStack.prototype.OpList.push("neq");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiNEQ);

// == Operator
AmbiExprStack.prototype.AmbiEQ = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push((b == a)*1);
}
AmbiExprStack.prototype.OpList.push("==");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiEQ);
AmbiExprStack.prototype.OpList.push("eq");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiEQ);

// && Operator
AmbiExprStack.prototype.AmbiAND = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push((b && a)*1);
}
AmbiExprStack.prototype.OpList.push("&&");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiAND);
AmbiExprStack.prototype.OpList.push("and");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiAND);

// || Operator
AmbiExprStack.prototype.AmbiOR = function(that)  {
	a = that.popval();
	b = that.popval();
	that.push((b || a)*1);
}
AmbiExprStack.prototype.OpList.push("||");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiOR);
AmbiExprStack.prototype.OpList.push("or");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiOR);


// ! Operator
AmbiExprStack.prototype.AmbiNEG = function(that)  {
	a = that.popval();
	that.push((!a)*1);
}
AmbiExprStack.prototype.OpList.push("!");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiNEG);
AmbiExprStack.prototype.OpList.push("not");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiNEG);


// PrintTop Operator
AmbiExprStack.prototype.AmbiPrintTop = function(that)  {
		that.ProgStack.Results.push(that.topval());
}
AmbiExprStack.prototype.OpList.push("."); // from Forth but doesn't consume top of stack
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPrintTop);
AmbiExprStack.prototype.OpList.push("printtop");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPrintTop);

// PrintAll Operator
AmbiExprStack.prototype.AmbiPrintAll = function(that)  {
	entries = that.allval(true);
	//alert (entries);
  for (var i=0; i<entries.length; i++) {
		that.ProgStack.Results.push(entries[i]);
  }
}
AmbiExprStack.prototype.OpList.push("..");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPrintAll);
AmbiExprStack.prototype.OpList.push("printall");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPrintAll);


// = Assignment Operator
AmbiExprStack.prototype.AmbiAssign = function(that)  {
//	if (that.rpn) {
	a = that.popvar();
	b = that.popval();
//	} else {
//	b = that.popval();
//	a = that.popvar();
//	}
	that.ProgStack.Vars[a] = b;
}
AmbiExprStack.prototype.OpList.push("=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiAssign);

// ++ Assignment Operator
AmbiExprStack.prototype.AmbiPlusPlus = function(that)  {
	a = that.popvar();
	that.progstack.Vars[a] = that.progstack.Vars[a]+1;
}
AmbiExprStack.prototype.OpList.push("++");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPlusPlus);

// -- Assignment Operator
AmbiExprStack.prototype.AmbiMinusMinus = function(that)  {
	a = that.popvar();
	that.progstack.Vars[a] = that.progstack.Vars[a]-1;
}
AmbiExprStack.prototype.OpList.push("--");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMinusMinus);



// += Assignment Operator
AmbiExprStack.prototype.AmbiPlusAssign = function(that)  {
//	if (that.rpn) {
	a = that.popvar();
	b = that.popval();
//	} else {
//	b = that.popval();
//	a = that.popvar();
//	}
	that.progstack.Vars[a] = that.progstack.Vars[a]+b;
}
AmbiExprStack.prototype.OpList.push("+=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiPlusAssign);



// -= Assignment Operator
AmbiExprStack.prototype.AmbiMinusAssign = function(that)  {
//	if (that.rpn) {
	a = that.popvar();
	b = that.popval();
//	} else {
//	b = that.popval();
//	a = that.popvar();
//	}
	that.progstack.Vars[a] = that.progstack.Vars[a]-b;
}
AmbiExprStack.prototype.OpList.push("-=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMinusAssign);

// *= Assignment Operator
AmbiExprStack.prototype.AmbiMultAssign = function(that)  {
//	if (that.rpn) {
	a = that.popvar();
	b = that.popval();
//	} else {
//	b = that.popval();
//	a = that.popvar();
//	}
	that.progstack.Vars[a] = that.progstack.Vars[a]*b;
}
AmbiExprStack.prototype.OpList.push("*=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiMultAssign);


// /= Assignment Operator
AmbiExprStack.prototype.AmbiDivAssign = function(that)  {
//	if (that.rpn) {
	a = that.popvar();
	b = that.popval();
//	} else {
//	b = that.popval();
//	a = that.popvar();
//	}
	that.progstack.Vars[a] = that.progstack.Vars[a]/b;
}
AmbiExprStack.prototype.OpList.push("/=");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiDivAssign);

// ceil Operator
AmbiExprStack.prototype.AmbiCEIL = function(that)  {
	a = that.popval();
	that.push(Math.ceil(a));
}
AmbiExprStack.prototype.OpList.push("ceil");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiCEIL);

// floor Operator
AmbiExprStack.prototype.AmbiFLOOR = function(that)  {
	a = that.popval();
	that.push(Math.floor(a));
}
AmbiExprStack.prototype.OpList.push("floor");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiFLOOR);

// Trig Operators
// sin Operator
AmbiExprStack.prototype.AmbiSIN = function(that)  {
	a = that.popval();
	that.push(Math.sin(a));
}
AmbiExprStack.prototype.OpList.push("sin");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSIN);

// cos Operator
AmbiExprStack.prototype.AmbiCOS = function(that)  {
	a = that.popval();
	that.push(Math.cos(a));
}
AmbiExprStack.prototype.OpList.push("cos");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiCOS);

// tan Operator
AmbiExprStack.prototype.AmbiTAN = function(that)  {
	a = that.popval();
	that.push(Math.tan(a));
}
AmbiExprStack.prototype.OpList.push("tan");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiTAN);

// asin Operator
AmbiExprStack.prototype.AmbiASIN = function(that)  {
	a = that.popval();
	that.push(Math.asin(a));
}
AmbiExprStack.prototype.OpList.push("asin");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiASIN);

// acos Operator
AmbiExprStack.prototype.AmbiACOS = function(that)  {
	a = that.popval();
	that.push(Math.acos(a));
}
AmbiExprStack.prototype.OpList.push("acos");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiACOS);

// atan Operator
AmbiExprStack.prototype.AmbiATAN = function(that)  {
	a = that.popval();
	that.push(Math.atan(a));
}
AmbiExprStack.prototype.OpList.push("atan");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiATAN);

// Import Export
AmbiExprStack.prototype.AmbiIMPORT = function(that)  {
	var ImportStackval;
	var ImportStackvar;
	ImportStackval = that.ProgStack.UDFStackval.pop(); 
	ImportStackvar = that.ProgStack.UDFStackvar.pop(); 
	//alert('ImportStack '+dump(ImportStack));
	that.push(ImportStackval.pop());
	ImportStackvar.pop();
	that.ProgStack.UDFStackval.push(ImportStackval);
	that.ProgStack.UDFStackvar.push(ImportStackvar);
}
AmbiExprStack.prototype.OpList.push("import");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiIMPORT);

AmbiExprStack.prototype.AmbiEXPORT = function(that)  {
	var ImportStackval;
	var ImportStackvar;
	ImportStackval = that.ProgStack.UDFStackval.pop(); 
	ImportStackvar = that.ProgStack.UDFStackvar.pop(); 
	//alert('ImportStack '+dump(ImportStack));
	ImportStackval.push(that.popval());
	ImportStackvar.push("");  
	that.ProgStack.UDFStackval.push(ImportStackval);
	that.ProgStack.UDFStackvar.push(ImportStackvar);
}
AmbiExprStack.prototype.OpList.push("export");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiEXPORT);


// Aggregate Operations

// sum
AmbiExprStack.prototype.AmbiSum = function(that)  {
	total = 0;
	entries = that.allval();
	//alert (entries);
  for (var i=0; i<entries.length; i++) {
		total += entries[i];
  }
	that.push(total);
}
AmbiExprStack.prototype.OpList.push("sum");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSum);

// sum of squares
AmbiExprStack.prototype.AmbiSumSq = function(that)  {
	total = 0;
	entries = that.allval();
	//alert (entries);
  for (var i=0; i<entries.length; i++) {
		total += Math.pow(entries[i],2);
  }
	that.push(total);
}
AmbiExprStack.prototype.OpList.push("sumsq");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiSumSq);

AmbiExprStack.prototype.AmbiProduct = function(that)  {
	total = 1;
	entries = that.allval();
	//alert (entries);
  for (var i=0; i<entries.length; i++) {
		total *= entries[i];
  }
	that.push(total);
}
AmbiExprStack.prototype.OpList.push("product");
AmbiExprStack.prototype.OpFunc.push(AmbiExprStack.prototype.AmbiProduct);

//	this.UDFList = new Array();
//	this.UDFEntryStep = new Array();

AmbiExprStack.prototype.AmbiUDF = function(searchStr) {
	//alert('aaa .'+searchStr);
  for (var i=0; i<this.ProgStack.UDFList.length; i++) {
    if (this.ProgStack.UDFList[i]===searchStr.trim()) {
      return this.ProgStack.UDFEntryStep[i];
    }
  }
	return false;
}


AmbiExprStack.prototype.AmbiFunc = function(searchStr) {
	//alert (AmbiExprStack.prototype.OpList);
  for (var i=0; i<AmbiExprStack.prototype.OpList.length; i++) {
    if (AmbiExprStack.prototype.OpList[i]===searchStr.trim()) {
      return AmbiExprStack.prototype.OpFunc[i];
    }
  }
	return false;
}

AmbiExprStack.prototype.AmbiConst = function(searchStr) {
	//alert (AmbiExprStack.prototype.ConstList);
  for (var i=0; i<AmbiExprStack.prototype.ConstList.length; i++) {
    if (AmbiExprStack.prototype.ConstList[i]===searchStr) {
      return AmbiExprStack.prototype.ConstFunc[i];
    }
  }
	return false;
}

AmbiExprStack.prototype.ResolveVars = function (Val) {
	if (Val.slice(0,1) == '$') {
		return this.ProgStack.Vars[Val];  // possibly undefined value!
	} else {
		return "'"+Val+"' is not a variable.";
  }
}

AmbiExprStack.prototype.popval = function() {
	var popVal = this.stackval.pop();
	this.stackvar.pop(); 
	if (popVal == undefined) 
	  return "Empty stack!"; 
	else 
		return popVal; 
}





AmbiExprStack.prototype.allval = function(keep) {
	if (typeof(keep) == 'undefined') keep = false;
  outarr = this.stackval;
	if (!keep) {
		this.stackval = new Array();
		this.stackvar = new Array();
	}
	return outarr;
}


AmbiExprStack.prototype.popvar = function() {
	var popVar = this.stackvar.pop();
	this.stackval.pop(); 
	if (popVar.slice(0,1) != '$') {
	  return "Empty stack or not a variable"; 
	} else {
		return popVar; 
	}
}


AmbiExprStack.prototype.push = function(newItem) {
  var Undefined;
	if (typeof(newItem) == 'string' && newItem.slice(0,1) == '$') {
		this.stackvar.push(newItem);
		this.stackval.push(this.ResolveVars(newItem));
	} else {
		this.stackvar.push(Undefined);
		this.stackval.push(newItem);
	}
}

AmbiExprStack.prototype.topval = function() {
	if (!this.len) {
	  return "Empty stack!"; 
	} else {
		return this.stackval[this.stackval.length-1]; 
	}
}

AmbiExprStack.prototype.len = function() {
	return this.stackval.length;
}

AmbiExprStack.prototype.AmbiExprTokenise = function(exprstring) {

	//alert(exprstring);
	tokens = exprstring.split(new RegExp("\\s+"));
	//alert (o.OpList);
	//alert (tokens);
	
	//   Ambi   Magic   
	//alert   (dump(tokens));   
	if   (tokens.length)   {   
		OpFunc  = this.AmbiFunc(tokens[0]); 
		//alert(OpFunc);
		if (OpFunc && !(tokens[0].trim()=='import')) { 
			//alert('polish');
			this.rpn = false; // Polish  Notation!
			tokens.reverse();   
		}   
	}   
return tokens;	
}


AmbiExprStack.prototype.AmbiUDFEXEC = function(that, OpUDF)  {
	//a = that.popval();
	that.ProgStack.AmbiExec(OpUDF) // experimental
}


AmbiExprStack.prototype.eval = function(exprstring) {
	// no comments yet

	var outstr = '';
	var tokens = this.AmbiExprTokenise(exprstring)

	//alert (dump(tokens));   
	for (i in tokens) {
		 var token  = tokens[i];  
		if (typeof(token) == 'undefined' || token == '') continue; // ignore empty tokens
		//alert(token);
		token = token.toLowerCase( ); // all to lower
		var floattoken  = parseFloat(token) ; 
		if (!isNaN(floattoken)) {  
			this.push(floattoken); 
		}  else {  
			if (typeof(token) == 'string' &&  token.slice(0,1) ==  '$') {
				this.push(token); 
			}  else {  
				//alert (token); 
				var OpUDF = this.AmbiUDF(token);
				//alert('bbb '+OpUDF);
				if (OpUDF) {
					this.ProgStack.UDFStackval.push(this.stackval);
					this.ProgStack.UDFStackvar.push(this.stackvar);
					this.ProgStack.VarsStack.push(this.ProgStack.Vars);
					this.ProgStack.Vars = new Array();
					var res = this.AmbiUDFEXEC(this, OpUDF)
					this.stackval = this.ProgStack.UDFStackval.pop();
					this.stackvar = this.ProgStack.UDFStackvar.pop();
					this.ProgStack.Vars = this.ProgStack.VarsStack.pop();
				} else {
					OpFunc = this.AmbiFunc(token);  
					//alert(OpFunc); 
					if (OpFunc) {  
						var res = 	OpFunc(this); 
						if (typeof(res)!='undefined') { 
							outstr += OpFunc(this); 
						} 
					} else { 
						var ConstFunc = this.AmbiConst(token);  
						if (ConstFunc) {
							ConstFunc(this);
						} else {
							return "'"+token+"' is an unknown operator"; 
						}
					}
				}
			} 
		} 
	} 
	return outstr 
}

/***************************************************
Program evaluation stack
***************************************************/

function AmbiProgStack(ambiVars) {
	this.rpn = true; // perhaps we need to do the execution as part of the creation 
	this.stack = new Array();
	this.prog = new Array();
	this.progoperands = new Array();
	this.progoperator = new Array();
	this.UDFList = new Array();
	this.UDFEntryStep = new Array();
	this.UDFStackval = new Array();
	this.UDFStackvar = new Array();
	this.VarsStack = new Array();
	this.Vars = ambiVars;
	this.Results = new Array();
	
// ProgOperators

}
AmbiProgStack.prototype.OpList = Array();
AmbiProgStack.prototype.OpFunc = Array();
AmbiProgStack.prototype.OpArity = Array();

AmbiProgStack.prototype.AmbiProgDOWHILE = function(that, Operands)  {

	// NEED TO ADD STACK UNDERFLOW PROTECTION HERE
	
	var res = false;
//	if (that.rpn) {
//		var b = 1;
//		var a = 0;
//	} else {
		var d = 3;
		var c = 2;
		var b = 1;
		var a = 0;
//	}
	that.AmbiExec(Operands[a]);
	
	do {
		that.AmbiExec(Operands[b]);
	} while (that.AmbiExec(Operands[c]))
	return that.AmbiExec(Operands[d]);




}
AmbiProgStack.prototype.OpList.push("dowhile");
AmbiProgStack.prototype.OpFunc.push(AmbiProgStack.prototype.AmbiProgDOWHILE);
AmbiProgStack.prototype.OpArity.push(4);

AmbiProgStack.prototype.AmbiProgWHILEDO = function(that, Operands)  {

	// NEED TO ADD STACK UNDERFLOW PROTECTION HERE
	
	//alert('Operands'+Operands[0]);
	//alert('Operands'+Operands[1]);
	var res = false;
//	if (that.rpn) {
    var d = 3;
    var c = 2;
		var b = 1;
		var a = 0;
//	} else {
//		var b = 0;
//		var a = 1;
//	}
	that.AmbiExec(Operands[a]);
	while (that.AmbiExec(Operands[b])) {
		that.AmbiExec(Operands[c]);
	}
	return that.AmbiExec(Operands[d]);
	
}
AmbiProgStack.prototype.OpList.push("whiledo");
AmbiProgStack.prototype.OpFunc.push(AmbiProgStack.prototype.AmbiProgWHILEDO);
AmbiProgStack.prototype.OpArity.push(4);

AmbiProgStack.prototype.AmbiProgIF = function(that, Operands)  {

	// NEED TO ADD STACK UNDERFLOW PROTECTION HERE
	
	//alert('Operands'+Operands[0]);
	//alert('Operands'+Operands[1]);
	var res = false;
//	if (that.rpn) {
		var c = 2
		var b = 1;
		var a = 0;
//	} else {
//		var b = 0;
//		var a = 1;
//	}
	
	if (that.AmbiExec(Operands[a])) {
		that.AmbiExec(Operands[b]);
	}
	return that.AmbiExec(Operands[c]);
	
}
AmbiProgStack.prototype.OpList.push("if");
AmbiProgStack.prototype.OpFunc.push(AmbiProgStack.prototype.AmbiProgIF);
AmbiProgStack.prototype.OpArity.push(3);

AmbiProgStack.prototype.AmbiProgIFELSE = function(that, Operands)  {

	// NEED TO ADD STACK UNDERFLOW PROTECTION HERE
	
	//alert('Operands'+Operands[0]);
	//alert('Operands'+Operands[1]);
	var res = false;
//	if (that.rpn) {
		var d = 3;
		var c = 2;
		var b = 1;
		var a = 0;
//	} else {
//		var b = 0;
//		var a = 1;
//	}
	
	if (that.AmbiExec(Operands[a])) {
		that.AmbiExec(Operands[b]);
	} else {
		that.AmbiExec(Operands[c]);
	}
	return that.AmbiExec(Operands[d]);
	
}
AmbiProgStack.prototype.OpList.push("ifelse");
AmbiProgStack.prototype.OpFunc.push(AmbiProgStack.prototype.AmbiProgIFELSE);
AmbiProgStack.prototype.OpArity.push(4);


AmbiProgStack.prototype.AmbiProgFOR = function(that, Operands)  {

	// NEED TO ADD STACK UNDERFLOW PROTECTION HERE
	
	//alert('Operands'+Operands[0]);
	//alert('Operands'+Operands[1]);
	var res = false;
//	if (that.rpn) {
		var e = 4;
		var d = 3;
		var c = 2;
		var b = 1;
		var a = 0;
//	} else {
//		var b = 0;
//		var a = 1;
//	}
	that.AmbiExec(Operands[a]);

	while (that.AmbiExec(Operands[b])) {
		that.AmbiExec(Operands[d]);
		that.AmbiExec(Operands[c]);
	}
	//alert(dump(Vars));
	return that.AmbiExec(Operands[e]);;
	
}
AmbiProgStack.prototype.OpList.push("for");
AmbiProgStack.prototype.OpFunc.push(AmbiProgStack.prototype.AmbiProgFOR);
AmbiProgStack.prototype.OpArity.push(5);

AmbiProgStack.prototype.AmbiFunc = function(searchStr) {
	//alert (AmbiProgStack.prototype.OpList);
  for (var i=0; i<AmbiProgStack.prototype.OpList.length; i++) {
    if (AmbiProgStack.prototype.OpList[i]===searchStr.trim()) {
      return Array(AmbiProgStack.prototype.OpFunc[i],AmbiProgStack.prototype.OpArity[i]) ;
    }
  }
	return Array(false,false);
}

AmbiProgStack.prototype.pop = function() {
	var popVal = this.stack.pop(); 
	if (popVal == undefined) 
	  return "Empty stack!"; 
	else 
		return popVal; 
}

AmbiProgStack.prototype.push = function(newItem) {
	return this.stack.push(newItem);
}

AmbiProgStack.prototype.len = function() {
	return this.stack.length;
}

AmbiProgStack.prototype.eval = function() {
	// no comments yet

	//alert (exprstring);
	var outstr = '';
	//this.prog = exprlistexprstring.split(new RegExp("\\s*;\\s*"));
	//alert (o.OpList);
	//alert (exprs);
	var cleanprog = new Array();
	for (var i in this.prog) {
		expr = this.prog[i].toLowerCase( ).trim(); // all to lower
		if (expr == '' ) {
			cleanprog.push('pass'); // NOP simulation
		} else if (expr.slice(0,2) != "//" && expr.slice(-2) != "//") { 
			cleanprog.push(expr); // ignore comments
		}
	}	
	//alert   (dump(cleanprog));   
	this.prog = cleanprog;
	//   Ambi   Magic   
	if   (this.prog.length)   {   
		var FuncDets  = this.AmbiFunc(this.prog[0]); 
		var OpFunc = FuncDets[0];
		var OpArity = FuncDets[1];
		//alert(OpArity);
		if (OpFunc || this.prog[0].trim() == 'function') { 
			this.rpn = false; // Polish  Notation!
			this.prog.reverse();   
		}   
	}
  //alert(dump(this.prog));
	var expr;
	var OpFunc;
	var OpArity; 
	var FuncDets;
	for (var i in this.prog) {
		//alert(this.stack);  
		expr  = this.prog[i];  
		if (expr=='function') {
			this.UDFList.push(this.prog[this.pop()]);
			this.UDFEntryStep.push(this.pop());
		} else {
			FuncDets  = this.AmbiFunc(expr); 
			OpFunc = FuncDets[0];
			OpArity = FuncDets[1];
			//alert(OpFunc); 
			if (OpArity) {
				this.progoperator[i] = OpFunc;
				this.progoperands[i] = new Array();
				for (var j = 0; j < OpArity; j++) {
					this.progoperands[i].push(this.pop());
				}
			} 
			this.push(i);
			//alert(this.stack);
		}
	}
	//alert(dump(this.prog));
	//alert(dump(this.UDFList));
	//alert(dump(this.UDFEntryStep));


// At this point the program stack contains the entry points of program fragments.

// For now just execute the last one of these
	return this.AmbiExec(this.pop());

//	return outstr 
}

AmbiProgStack.prototype.AmbiExec = function(step) {
	//alert (step);
	if (typeof(this.progoperator[step]) != 'undefined') {
		var OpFunc = this.progoperator[step];

		//alert('breakdown'+step)
		//alert(this.progoperands[step]);   // This stuff is like the code for 'seq'

		return OpFunc(this,this.progoperands[step]); 

	} else {
		//alert('do'+step)
		var a = new AmbiExprStack(this);
		//alert(typeof(this.prog[step]));
		a.eval(this.prog[step])
		return a.topval();
	}
}

AmbiDecodeToken = function(encodestring) {
	return decodeURI(encodestring).replace(/\%3B/g,';').slice(1);
}

AmbiProgStack.prototype.AmbiProgExprise = function(exprstring) {
	
	// remove leading or trailing ;
		
	this.prog = exprstring.trim().trimsemis().split(new RegExp("\\s*;\\s*"));	
}



function ambieval(ambitext, ambiVars) {
	var b = new AmbiProgStack(ambiVars);
	b.AmbiProgExprise(ambitext);
  b.eval();
  return new Array(b.Results,
  	b.Vars);
}
