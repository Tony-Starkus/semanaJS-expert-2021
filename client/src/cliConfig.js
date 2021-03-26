export default class CliConfig {

    constructor({ username, hostUri, room }) {
        this.username = username
        this.room = room;

        const { hostname, port, protocol } = new URL(hostUri);  // Parse a string to url.

        this.host = hostname;
        this.port = port;
        this.protocol = protocol.replace(/\W/, '');  // All no letters, replace with ''

    }

    static parseArguments(commands) {
        const cmd = new Map();
        for(const key in commands) {
            const index = parseInt(key);  // Get the key as string.
            const command = commands[key]  // Get command with actual key.
            const commandPreffix = '--'  // Our commands starts with this preffix.

            if(!command.includes(commandPreffix)) continue;  // If command doesn't have the preffix, go to next.
            
            cmd.set(
                command.replace(commandPreffix, ''),
                commands[index + 1]
            );
            
        }
        return new CliConfig(Object.fromEntries(cmd));  // Get the Map and transform in an Object type.
    }
}