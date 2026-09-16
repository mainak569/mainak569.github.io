import React, { Component } from 'react';
import ReactGA from 'react-ga4';

const CONTACT_EMAIL = "mainak.lnmiit@gmail.com";
// FormSubmit relays form posts to the inbox without a backend or API keys
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Gedit extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            subject: "",
            message: "",
            errors: {},
            status: "idle", // idle | sending | sent | error
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prev => ({ [name]: value, errors: { ...prev.errors, [name]: null } }));
    }

    validate = () => {
        const errors = {};
        if (!this.state.name.trim()) errors.name = "Please enter your name";
        if (!EMAIL_RE.test(this.state.email.trim())) errors.email = "Please enter a valid email so I can reply";
        if (!this.state.message.trim()) errors.message = "Message must not be empty";
        this.setState({ errors });
        return Object.keys(errors).length === 0;
    }

    sendMessage = async () => {
        if (this.state.status === "sending" || !this.validate()) return;

        const name = this.state.name.trim();
        const email = this.state.email.trim();
        const subject = this.state.subject.trim() || "New message from mainak.me";
        const message = this.state.message.trim();

        this.setState({ status: "sending" });
        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _subject: `[mainak.me] ${subject}`,
                    _replyto: email,
                    _template: "table",
                    _captcha: "false",
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || String(data.success) === "false") throw new Error(data.message || "Request failed");

            ReactGA.event({ category: "Send Message", action: "sent" });
            this.setState({ status: "sent", name: "", email: "", subject: "", message: "" });
        } catch (e) {
            this.setState({ status: "error" });
        }
    }

    mailtoLink = () => {
        const body = `${this.state.message}\n\n— ${this.state.name}${this.state.email ? ` (${this.state.email})` : ""}`;
        return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(this.state.subject || "Hello from mainak.me")}&body=${encodeURIComponent(body)}`;
    }

    renderLine = (num, field, placeholder, className, type = "text") => (
        <div className="relative">
            <input
                name={field}
                type={type}
                value={this.state[field]}
                onChange={this.handleChange}
                className={"w-full focus:bg-ub-gedit-light outline-none text-sm pl-7 pr-2 py-1 bg-transparent " + className}
                placeholder={this.state.errors[field] || placeholder}
                spellCheck="false"
                autoComplete={field === "email" ? "email" : field === "name" ? "name" : "off"}
            />
            <span className="absolute left-1 top-1/2 transform -translate-y-1/2 font-bold text-sm text-ubt-gedit-blue">{num}</span>
            {this.state.errors[field] && this.state[field] ? <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-red-300">{this.state.errors[field]}</span> : null}
        </div>
    )

    render() {
        const { status, errors } = this.state;
        return (
            <div className="w-full h-full relative flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-gedit-light bg-opacity-60 border-b border-t border-blue-400 text-sm">
                    <span className="font-bold ml-2 truncate">Send a Message to Me</span>
                    <div className="flex">
                        <button onClick={this.sendMessage} disabled={status === "sending"} className="border border-black bg-black bg-opacity-50 px-3 py-0.5 my-1 mx-1 rounded hover:bg-opacity-80 focus:outline-none">
                            {status === "sending" ? "Sending…" : "Send"}
                        </button>
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col bg-ub-gedit-dark font-normal windowMainScreen">
                    <div className="absolute left-0 top-0 h-full w-6 bg-ub-gedit-darker"></div>
                    {this.renderLine(1, "name", "Your Name", "text-ubt-gedit-orange font-medium" + (errors.name ? " placeholder-red-300" : ""))}
                    {this.renderLine(2, "email", "Your Email (so I can reply)", "text-ubt-gedit-orange" + (errors.email ? " placeholder-red-300" : ""), "email")}
                    {this.renderLine(3, "subject", "Subject (may be a feedback for this website!)", "text-ubt-gedit-blue")}
                    <div className="relative flex-grow">
                        <textarea
                            name="message"
                            value={this.state.message}
                            onChange={this.handleChange}
                            className={"w-full gedit-message font-light text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-7 pr-2 py-1 bg-transparent" + (errors.message ? " placeholder-red-300" : "")}
                            placeholder={errors.message || "Message"}
                            spellCheck="false"
                        />
                        <span className="absolute left-1 top-1 font-bold text-sm text-ubt-gedit-blue">4</span>
                    </div>
                </div>
                <div className="px-2 py-1 text-xs bg-ub-gedit-darker text-gray-300 flex flex-wrap justify-between">
                    <span>
                        {status === "sent" && <span className="text-green-400">✓ Message sent — thanks! I'll get back to you soon.</span>}
                        {status === "error" && <span className="text-red-300">Couldn't send right now. <a className="underline" href={this.mailtoLink()}>Open it in your email app</a> instead.</span>}
                        {(status === "idle" || status === "sending") && <span>Plain Text</span>}
                    </span>
                    <span>or email <a className="underline hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></span>
                </div>
                {
                    (status === "sending"
                        ?
                        <div className="flex justify-center items-center animate-pulse h-full w-full bg-gray-400 bg-opacity-30 absolute top-0 left-0">
                            <img className={" w-8 absolute animate-spin"} src="./themes/Yaru/status/process-working-symbolic.svg" alt="Ubuntu Process Symbol" />
                        </div>
                        : null
                    )
                }
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit> </Gedit>;
}
