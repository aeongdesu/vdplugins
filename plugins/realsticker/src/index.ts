import { PatchChat } from "./patches/PatchChat"

const patches = [
    PatchChat
]

export const onUnload = () => {
    for (const unpatch of patches) unpatch()
}