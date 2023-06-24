import Settings from "./Settings"
import commands from "./commands"

export const onLoad = () => commands
export const onUnload = () => { for (const unregisterCommands of commands) unregisterCommands() }
export const settings = Settings