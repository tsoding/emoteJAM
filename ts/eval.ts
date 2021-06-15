type BinaryOp = '+' | '-' | '*' | '/' | '%';
type BinaryOpFunc = (lhs: number, rhs: number) => number;

const BINARY_OPS: {[op in BinaryOp]: BinaryOpFunc} = {
    '+': (lhs, rhs) => lhs + rhs,
    '-': (lhs, rhs) => lhs - rhs,
    '*': (lhs, rhs) => lhs * rhs,
    '/': (lhs, rhs) => lhs / rhs,
    '%': (lhs, rhs) => lhs % rhs,
};

type UnaryOp = '-';
type UnaryOpFunc = (arg: number) => number;

const UNARY_OPS: {[op in UnaryOp]: UnaryOpFunc} = {
    '-': (arg: number) => -arg,
};

class Lexer {
    src: string

    constructor(src: string) {
        this.src = src;
    }

    unnext(token: string): void {
        this.src = token + this.src;
    }

    next(): string | null {
        this.src = this.src.trimStart();

        if (this.src.length == 0) {
            return null;
        }

        function is_token_break(c: string) {
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

type ExprKind = 'unary_op' | 'binary_op' | 'funcall' | 'symbol';

interface UnaryOpExpr {
    op: UnaryOp,
    operand: Expr,
}

interface BinaryOpExpr {
    op: BinaryOp,
    lhs: Expr,
    rhs: Expr,
}

interface FuncallExpr {
    name: string,
    args: Array<Expr>,
}

interface SymbolExpr {
    value: string
}

interface Expr {
    kind: ExprKind,
    payload: UnaryOpExpr | BinaryOpExpr | FuncallExpr | SymbolExpr
}

function parse_primary(lexer: Lexer): Expr {
    let token = lexer.next();
    if (token !== null) {
        if (token in UNARY_OPS) {
            let operand = parse(lexer);
            return {
                "kind": "unary_op",
                "payload": {
                    "op": token as UnaryOp,
                    "operand": operand,
                },
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
                const args: Array<Expr> = [];

                next_token = lexer.next();
                if (next_token === ')') {
                    return {
                        "kind": "funcall",
                        "payload": {
                            "name": token,
                            "args": args,
                        }
                    };
                }

                if (next_token === null) {
                    throw Error(`Unexpected end of input`);
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
                    "payload": {
                        "name": token,
                        "args": args,
                    }
                };
            } else {
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
    } else {
        throw new Error('Expected primary expression but reached the end of the input');
    }
}

function parse(lexer: Lexer): Expr {
    let lhs = parse_primary(lexer);

    let op_token = lexer.next();
    if (op_token !== null) {
        if (op_token in BINARY_OPS) {
            let rhs = parse(lexer);
            return {
                "kind": "binary_op",
                "payload": {
                    "op": op_token as BinaryOp,
                    "lhs": lhs,
                    "rhs": rhs,
                }
            };
        } else {
            lexer.unnext(op_token);
        }
    }

    return lhs;
}

function compile_expr(src: string) {
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

interface UserContext {
    vars?: {[name: string]: number},
    funcs?: {[name: string]: (...xs: number[]) => number},
}

function run_expr(expr: Expr, user_context: UserContext = {}): number {
    console.assert(typeof(expr) === 'object');

    switch (expr.kind) {
    case 'symbol': {
        const symbol = expr.payload as SymbolExpr;
        const value = symbol.value;
        const number = Number(value);
        if (isNaN(number)) {
            if (user_context.vars && value in user_context.vars) {
                return user_context.vars[value];
            }

            throw new Error(`Unknown variable '${value}'`);
        } else {
            return number;
        }
    }

    case 'unary_op': {
        const unary_op = expr.payload as UnaryOpExpr;

        if (unary_op.op in UNARY_OPS) {
            return UNARY_OPS[unary_op.op](run_expr(unary_op.operand, user_context));
        }

        throw new Error(`Unknown unary operator '${unary_op.op}'`);
    }

    case 'binary_op': {
        const binary_op = expr.payload as BinaryOpExpr;

        if (binary_op.op in BINARY_OPS) {
            return BINARY_OPS[binary_op.op](run_expr(binary_op.lhs, user_context), run_expr(binary_op.rhs, user_context));
        }

        throw new Error(`Unknown binary operator '${binary_op.op}'`);
    }

    case 'funcall': {
        const funcall = expr.payload as FuncallExpr;

        if (user_context.funcs && funcall.name in user_context.funcs) {
            return user_context.funcs[funcall.name](...funcall.args.map((arg) => run_expr(arg, user_context)));
        }

        throw new Error(`Unknown function '${funcall.name}'`);
    }

    default: {
        throw new Error(`Unexpected AST node '${expr.kind}'`);
    }
    }
}

console.log(run_expr(
    compile_expr("1 + f(x) * 3"),
    {
        "vars": {
            "x": 69
        },
        "funcs": {
            "f": (x) => x + 1
        },
    }));
