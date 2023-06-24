import { commands } from "./commands"
import Settings from "./Settings"

export default {
    onLoad: () => commands,
    onUnload: () => { for (const unregisterCommands of commands) unregisterCommands() },
    settings: Settings
}