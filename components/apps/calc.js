import React, { Component } from 'react';
const Parser = require('expr-eval').Parser;

const parser = new Parser({
    operators: {
        add: true, concatenate: false, conditional: false, divide: true, factorial: true,
        multiply: true, power: true, remainder: true, subtract: true,
        logical: false, comparison: false, 'in': false, assignment: false,
    }
});

// display symbol -> expression that expr-eval understands
const toExpression = (display) => display
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, '(PI)')
    .replace(/√\(/g, 'sqrt(')
    .replace(/(\d+(\.\d+)?)%/g, '($1/100)')
    .replace(/²/g, '^2');

const formatNumber = (n) => {
    if (!Number.isFinite(n)) return null;
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-9 && n !== 0)) return n.toExponential(8).replace(/\.?0+e/, 'e');
    return String(parseFloat(n.toPrecision(12)));
};

const BUTTONS = [
    ['7', '8', '9', '÷', '⌫', 'C'],
    ['4', '5', '6', '×', '(', ')'],
    ['1', '2', '3', '−', 'x²', '√'],
    ['0', '.', '%', '+', 'π', '='],
];

export class Calc extends Component {
    constructor() {
        super();
        this.inputRef = React.createRef();
        this.state = {
            expression: '',
            result: '',
            error: false,
            history: [],
            justEvaluated: false,
        };
    }

    componentDidMount() {
        this.focusInput();
    }

    focusInput = () => {
        // avoid popping up the soft keyboard on phones; buttons are used there
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
        if (this.inputRef.current) this.inputRef.current.focus();
    }

    evaluate = (expression) => {
        const expr = toExpression(expression);
        if (!expr.trim()) return null;
        try {
            return formatNumber(parser.evaluate(expr));
        } catch (e) {
            return null;
        }
    }

    press = (key) => {
        let { expression, justEvaluated, history, result } = this.state;

        if (key === 'C') {
            this.setState({ expression: '', result: '', error: false, justEvaluated: false });
            return;
        }
        if (key === '⌫') {
            this.setState({ expression: justEvaluated ? '' : expression.slice(0, -1), error: false, justEvaluated: false });
            return;
        }
        if (key === '=') {
            const value = this.evaluate(expression);
            if (value === null) {
                this.setState({ error: expression.trim() !== '' });
                return;
            }
            history = [...history, { expression, value }].slice(-20);
            this.setState({ history, expression: value, result: '', error: false, justEvaluated: true }, this.scrollHistory);
            return;
        }

        const isOperator = ['+', '−', '×', '÷', '%', 'x²'].includes(key);
        // start a new calculation after "=" unless an operator continues the previous result
        if (justEvaluated && !isOperator) expression = '';

        if (key === 'x²') expression += '²';
        else if (key === '√') expression += '√(';
        else expression += key;

        this.setState({ expression, error: false, justEvaluated: false, result });
    }

    scrollHistory = () => {
        const el = document.getElementById('calc-history');
        if (el) el.scrollTop = el.scrollHeight;
    }

    handleKeyDown = (e) => {
        const map = { '*': '×', '/': '÷', '-': '−', 'Enter': '=', '=': '=', 'Backspace': '⌫', 'Escape': 'C', 'Delete': 'C', '^': '^' };
        const key = map[e.key] || e.key;
        if (/^[0-9.+()%^]$/.test(key) || ['×', '÷', '−', '=', '⌫', 'C'].includes(key)) {
            e.preventDefault();
            this.press(key);
        }
    }

    renderButton = (key) => {
        let style = "bg-white bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30";
        if (key === '=') style = "bg-ub-orange hover:bg-opacity-90 active:bg-opacity-80 font-bold";
        else if (key === 'C') style = "bg-red-600 bg-opacity-70 hover:bg-opacity-90";
        else if (/^[0-9.]$/.test(key)) style = "bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40";

        return (
            <button
                key={key}
                onClick={() => { this.press(key); this.focusInput(); }}
                className={"rounded-md text-base md:text-lg select-none focus:outline-none transition-colors duration-75 " + style}
                aria-label={key}
            >
                {key}
            </button>
        );
    }

    render() {
        const preview = this.state.justEvaluated ? '' : this.evaluate(this.state.expression);
        return (
            <div className="h-full w-full flex flex-col bg-ub-cool-grey text-white select-none" onClick={this.focusInput}>
                <div className="flex items-center justify-between px-3 py-1 text-sm border-b border-black border-opacity-40">
                    <span className="font-medium">Basic Mode</span>
                    <button className="text-xs text-gray-300 hover:text-white focus:outline-none" onClick={() => this.setState({ history: [] })}>Clear history</button>
                </div>

                <div id="calc-history" className="flex-grow min-h-0 overflow-y-auto windowMainScreen bg-ub-grey px-3 py-2 text-right">
                    {this.state.history.map((item, i) => (
                        <div key={i} className="py-1 cursor-pointer hover:bg-white hover:bg-opacity-5 rounded px-1" onClick={() => this.setState({ expression: item.value, justEvaluated: true })}>
                            <span className="text-gray-400 text-sm">{item.expression} =</span>
                            <span className="ml-2 font-medium">{item.value}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-ub-grey px-3 pb-2 border-b border-black border-opacity-40">
                    <input
                        ref={this.inputRef}
                        readOnly
                        value={this.state.expression}
                        onKeyDown={this.handleKeyDown}
                        placeholder="0"
                        className={"w-full bg-transparent text-right text-2xl md:text-3xl outline-none caret-transparent " + (this.state.error ? "text-red-400" : "text-white")}
                        aria-label="calculator display"
                    />
                    <div className="h-5 text-right text-sm text-gray-400">
                        {this.state.error ? "Malformed expression" : (preview && preview !== this.state.expression ? `= ${preview}` : "")}
                    </div>
                </div>

                <div className="grid grid-cols-6 gap-1.5 p-2 h-1/2 min-h-0" style={{ gridAutoRows: "1fr" }}>
                    {BUTTONS.flat().map(this.renderButton)}
                </div>
            </div>
        );
    }
}

export default Calc;

export const displayTerminalCalc = () => {
    return <Calc />;
}
