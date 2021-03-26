// Vai construir nosso terminal seguinto o padrão Builder.
import blessed from 'blessed';

export default class ComponentsBuilder {
    #screen;  // Create a terminal screen.
    #layout;  // Create a base layout where all other layouts will be in. Like div inside div.
    #chat;  // Create a layout for the chat space.
    #input;
    #status;  // How many users are logged in the chat.
    #activityLog;  // Acivity log about the chat.

    constructor() {

    }

    // # -> Define como privado.
    #baseComponent() {
        // Vai retornar as propriedades comuns para todos os components
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbar: {
                ch: ' ',
                inverse: true
            },
            // Habilita colocar cores e tags no texto (tipo <p>, <br>).
            tags: true
        }
    }

    setScreen({ title }) {
        // Vai retornar a tela.
        this.#screen = blessed.screen({
            smartCSR: true,  // Fazer redimensionamentos automátios na tela.
            title
        });
        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0));  // Fechar o programa.
        return this;
    }

    setLayoutComponent() {
        this.#layout = blessed.layout({  // Criando uma janela onde vai ter outras janelas. Tipo div dentro de div.
            parent: this.#screen,
            width: '100%',
            height: '100%'
        });
        return this;
    }

    setInputComponent(onEnterPressed) {
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        });

        input.key('enter', onEnterPressed);
        this.#input = input;
        return this;
    }

    setChatComponent() {
        this.#chat = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            align: 'left',  // Chat vai ficar do lado esquerdo.
            width: '50%',
            height: '90%',
            items: ['{bold}Messenger{/bold}']
        })
        return this;
    }
    
    setStatusComponent() {
        this.#status = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            items: ['{bold}Users on Room{/bold}']
        });
        return this;
    }

    setActivityLogComponent() {
        this.#activityLog = blessed.list({
            ...this.#baseComponent(),
            parent: this.#layout,
            width: '25%',
            height: '90%',
            style: {
                fg: 'yellow',  // Text color.
            },
            items: ['{bold}Activity Log{/bold}']
        });
        return this
    }

    build() {
        const components = {
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            activityLog: this.#activityLog,
            status: this.#status
        }
        return components;
    }

}
