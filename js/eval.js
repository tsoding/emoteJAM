const BINARY_OPS = {
    '+': (lhs, rhs) => lhs + rhs,
    '-': (lhs, rhs) => lhs - rhs,
    '*': (lhs, rhs) => lhs * rhs,
    '/': (lhs, rhs) => lhs / rhs,
    '%': (lhs, rhs) => lhs % rhs,
};

const UNARY_OPS = {
    '-': (arg) => -arg,
};

class Lexer {
    constructor(src) {
        this.src = src;
    }

    unnext(token) {
        this.src = token + this.src;
    }

    next() {
        this.src = this.src.trimStart();

        if (this.src.length == 0) {
            return null;
        }

        function is_token_break(c) {
            const syntax = '(),';
            return c in BINARY_OPS || c in UNARY_OPS || syntax.includes(c);
        }

        if (is_token_break(this.src[0])) {
            const token = this.src[0];
            this.src = this.src.slice(1);
            return token;
        }

        for (let i = 0; i < this.src.length; ++i) {
            if (is_token_break(this.src[i]) || this.src[i] == ' ') {
                const token = this.src.slice(0, i);
                this.src = this.src.slice(i);
                return token;
            }
        }

        const token = this.src;
        this.src = '';
        return token;
    }
}

function parse_primary(lexer) {
    let token = lexer.next();
    if (token !== null) {
        if (token in UNARY_OPS) {
            let operand = parse(lexer);
            return {
                "kind": "unary_op",
                "op": token,
                "operand": operand,
            };
        } else if (token === '(') {
            let expr = parse(lexer);
            token = lexer.next();
            if (token !== ')') {
                throw new Error(`Expected ')' but got '${token}'`);
            }
            return expr;
        } else if (token === ')') {
            throw new Error(`No primary expression starts with ')'`);
        } else {
            let next_token = lexer.next();
            if (next_token === '(') {
                const args = [];

                next_token = lexer.next();
                if (next_token === ')') {
                    return {
                        "kind": "funcall",
                        "name": token,
                        "args": args,
                    };
                }

                lexer.unnext(next_token);
                args.push(parse(lexer));

                next_token = lexer.next();
                while (next_token == ',') {
                    args.push(parse(lexer));
                    next_token = lexer.next();
                }

                if (next_token !== ')') {
                    throw Error(`Expected ')' but got '${next_token}'`);
                }

                return {
                    "kind": "funcall",
                    "name": token,
                    "args": args,
                };
            } else {
                if (next_token !== null) {
                    lexer.unnext(next_token);
                }
                return {
                    "kind": "symbol",
                    "value": token
                };
            }
        }
    } else {
        throw new Error('Expected primary expression but reached the end of the input');
    }
}

function parse(lexer) {
    let lhs = parse_primary(lexer);

    let op_token = lexer.next();
    if (op_token !== null) {
        if (op_token in BINARY_OPS) {
            let rhs = parse(lexer);
            return {
                "kind": "binary_op",
                "op": op_token,
                "lhs": lhs,
                "rhs": rhs,
            };
        } else {
            lexer.unnext(op_token);
        }
    }

    return lhs;
}

function compile_expr(src) {
    const lexer = new Lexer(src);
    const result = parse(lexer);
    const token = lexer.next();
    if (token !== null) {
        console.log(typeof(token));
        console.log(token);
        throw new Error(`Unexpected token '${token}'`);
    }
    return result;
}

function run_expr(expr, user_context = {}) {
    console.assert(typeof(expr) === 'object');

    switch (expr.kind) {
    case 'symbol': {
        const value = expr.value;
        const number = Number(value);
        if (isNaN(number)) {
            if (user_context.vars && value in user_context.vars) {
                return user_context.vars[value];
            }

            throw new Error(`Unknown variable '${value}'`);
        } else {
            return number;
        }
    } break;

    case 'unary_op': {
        if (expr.op in UNARY_OPS) {
            return UNARY_OPS[expr.op](run_expr(expr.operand, user_context));
        }

        throw new Error(`Unknown unary operator '${expr.op}'`);
    } break;

    case 'binary_op': {
        if (expr.op in BINARY_OPS) {
            return BINARY_OPS[expr.op](run_expr(expr.lhs, user_context), run_expr(expr.rhs, user_context));
        }

        throw new Error(`Unknown binary operator '${expr.op}'`);
    } break;

    case 'funcall': {
        if (user_context.funcs && expr.name in user_context.funcs) {
            return user_context.funcs[expr.name](...expr.args.map((arg) => run_expr(arg, user_context)));
        }

        throw new Error(`Unknown function '${expr.name}'`);
    } break;

    default: {
        throw new Error(`Unexpected AST node '${expr.kind}'`);
    }
    }
}
