"use strict";
var BinaryPrec;
(function (BinaryPrec) {
    BinaryPrec[BinaryPrec["PREC0"] = 0] = "PREC0";
    BinaryPrec[BinaryPrec["PREC1"] = 1] = "PREC1";
    BinaryPrec[BinaryPrec["COUNT_PRECS"] = 2] = "COUNT_PRECS";
})(BinaryPrec || (BinaryPrec = {}));
var BINARY_OPS = {
    '+': {
        func: function (lhs, rhs) { return lhs + rhs; },
        prec: BinaryPrec.PREC0
    },
    '-': {
        func: function (lhs, rhs) { return lhs - rhs; },
        prec: BinaryPrec.PREC0
    },
    '*': {
        func: function (lhs, rhs) { return lhs * rhs; },
        prec: BinaryPrec.PREC1
    },
    '/': {
        func: function (lhs, rhs) { return lhs / rhs; },
        prec: BinaryPrec.PREC1
    },
    '%': {
        func: function (lhs, rhs) { return lhs % rhs; },
        prec: BinaryPrec.PREC1
    }
};
var UNARY_OPS = {
    '-': function (arg) { return -arg; }
};
var Lexer = (function () {
    function Lexer(src) {
        this.src = src;
    }
    Lexer.prototype.unnext = function (token) {
        this.src = token + this.src;
    };
    Lexer.prototype.next = function () {
        this.src = this.src.trimStart();
        if (this.src.length == 0) {
            return null;
        }
        function is_token_break(c) {
            var syntax = '(),';
            return c in BINARY_OPS || c in UNARY_OPS || syntax.includes(c);
        }
        if (is_token_break(this.src[0])) {
            var token_1 = this.src[0];
            this.src = this.src.slice(1);
            return token_1;
        }
        for (var i = 0; i < this.src.length; ++i) {
            if (is_token_break(this.src[i]) || this.src[i] == ' ') {
                var token_2 = this.src.slice(0, i);
                this.src = this.src.slice(i);
                return token_2;
            }
        }
        var token = this.src;
        this.src = '';
        return token;
    };
    return Lexer;
}());
function parse_primary(lexer) {
    var token = lexer.next();
    if (token !== null) {
        if (token in UNARY_OPS) {
            var operand = parse_expr(lexer);
            return {
                "kind": "unary_op",
                "payload": {
                    "op": token,
                    "operand": operand
                }
            };
        }
        else if (token === '(') {
            var expr = parse_expr(lexer);
            token = lexer.next();
            if (token !== ')') {
                throw new Error("Expected ')' but got '" + token + "'");
            }
            return expr;
        }
        else if (token === ')') {
            throw new Error("No primary expression starts with ')'");
        }
        else {
            var next_token = lexer.next();
            if (next_token === '(') {
                var args = [];
                next_token = lexer.next();
                if (next_token === ')') {
                    return {
                        "kind": "funcall",
                        "payload": {
                            "name": token,
                            "args": args
                        }
                    };
                }
                if (next_token === null) {
                    throw Error("Unexpected end of input");
                }
                lexer.unnext(next_token);
                args.push(parse_expr(lexer));
                next_token = lexer.next();
                while (next_token == ',') {
                    args.push(parse_expr(lexer));
                    next_token = lexer.next();
                }
                if (next_token !== ')') {
                    throw Error("Expected ')' but got '" + next_token + "'");
                }
                return {
                    "kind": "funcall",
                    "payload": {
                        "name": token,
                        "args": args
                    }
                };
            }
            else {
                if (next_token !== null) {
                    lexer.unnext(next_token);
                }
                return {
                    "kind": "symbol",
                    "payload": {
                        "value": token
                    }
                };
            }
        }
    }
    else {
        throw new Error('Expected primary expression but reached the end of the input');
    }
}
function parse_expr(lexer, prec) {
    if (prec === void 0) { prec = BinaryPrec.PREC0; }
    if (prec >= BinaryPrec.COUNT_PRECS) {
        return parse_primary(lexer);
    }
    var lhs = parse_expr(lexer, prec + 1);
    var op_token = lexer.next();
    if (op_token !== null) {
        if (op_token in BINARY_OPS && BINARY_OPS[op_token].prec == prec) {
            var rhs = parse_expr(lexer, prec);
            return {
                "kind": "binary_op",
                "payload": {
                    "op": op_token,
                    "lhs": lhs,
                    "rhs": rhs
                }
            };
        }
        else {
            lexer.unnext(op_token);
        }
    }
    return lhs;
}
function compile_expr(src) {
    var lexer = new Lexer(src);
    var result = parse_expr(lexer);
    var token = lexer.next();
    if (token !== null) {
        console.log(typeof (token));
        console.log(token);
        throw new Error("Unexpected token '" + token + "'");
    }
    return result;
}
function run_expr(expr, user_context) {
    var _a;
    if (user_context === void 0) { user_context = {}; }
    console.assert(typeof (expr) === 'object');
    switch (expr.kind) {
        case 'symbol': {
            var symbol = expr.payload;
            var value = symbol.value;
            var number = Number(value);
            if (isNaN(number)) {
                if (user_context.vars && value in user_context.vars) {
                    return user_context.vars[value];
                }
                throw new Error("Unknown variable '" + value + "'");
            }
            else {
                return number;
            }
        }
        case 'unary_op': {
            var unary_op = expr.payload;
            if (unary_op.op in UNARY_OPS) {
                return UNARY_OPS[unary_op.op](run_expr(unary_op.operand, user_context));
            }
            throw new Error("Unknown unary operator '" + unary_op.op + "'");
        }
        case 'binary_op': {
            var binary_op = expr.payload;
            if (binary_op.op in BINARY_OPS) {
                return BINARY_OPS[binary_op.op].func(run_expr(binary_op.lhs, user_context), run_expr(binary_op.rhs, user_context));
            }
            throw new Error("Unknown binary operator '" + binary_op.op + "'");
        }
        case 'funcall': {
            var funcall = expr.payload;
            if (user_context.funcs && funcall.name in user_context.funcs) {
                return (_a = user_context.funcs)[funcall.name].apply(_a, funcall.args.map(function (arg) { return run_expr(arg, user_context); }));
            }
            throw new Error("Unknown function '" + funcall.name + "'");
        }
        default: {
            throw new Error("Unexpected AST node '" + expr.kind + "'");
        }
    }
}
