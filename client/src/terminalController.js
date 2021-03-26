// Ele é um intermediário para os eventos da aplicação.
import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
    #usersColors = new Map();
    constructor() {

    }

    #pickColor() {
        return `#` + ((1 << 24) * Math.random() | 9).toString(16) + '-fg';
    }

    #getUserColor(userName) {
        if(this.#usersColors.has(userName))
            return this.#usersColors.get(userName);
        const color = this.#pickColor();
        this.#usersColors.set(userName, color);

        return color;
    }

    #onInputReceived(eventEmitter) {
        return function() {
            const message = this.getValue();
            console.log(message);
            this.clearValue();
        }
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg;
            const color = this.#getUserColor(userName);
            chat.addItem(`{${color}}{bold}${userName}{/}: ${message}`);
            // chat.addItem(`mensagem`);  // addItem() vem do blessed.
            screen.render();
        }
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            // user join
            // user left
            
            const [userName] = msg.split(/\s/);
            const color = this.#getUserColor(userName);
            activityLog.addItem(`{${color}}{bold}${msg.toString()}{/}`);
            screen.render();
        }
    }

    #onStatusUpdated({ screen, status }) {
        // [user, user]
        return users => {

            // Lets get the first element of the list. In this case, is ['{bold}Users on Room{/bold}'].
            const { content } = status.items.shift();
            status.clearItems();
            status.addItem(content);

            users.forEach(userName => {
                const color = this.#getUserColor(userName);
                status.addItem(`{${color}}{bold}${userName}{/}`)
            });

            screen.render();
        }
    }

    #registerEvents(eventEmitter, components) {
        // eventEmitter.emit('turma01', 'hey');
        // eventEmitter.on('turma01', msg => console.log(msg.toString()));

        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components));
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusUpdated(components));

    }

    async initalizeTable(eventEmitter) {
        // Quando acontecer algo no socket, retorna o evento.
        const components = new ComponentsBuilder()
            .setScreen({ title: 'HackerChat - Thalisson Bandeira' })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build();
        
        this.#registerEvents(eventEmitter, components);
        components.input.focus();
        components.screen.render();

        /*const users = ["Thalisson"];
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
        eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'Thalisson join');
        users.push("Program");
        
        eventEmitter.emit(constants.events.app.STATUS_UPDATED, users);
        eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'Program join');
        setInterval(() => {
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: "Hello World", userName: "Thalisson"});
            eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: "Hi", userName: "Program"});
        }, 2000);*/

    }

}
