import { findByProps } from "@vendetta/metro"
import { DRAFT_TYPE } from "./Constants"
import { showToast } from "@vendetta/ui/toasts"
import { getAssetIDByName } from "@vendetta/ui/assets"

const UploadStore = findByProps("getUploads")
const { sendMessage } = findByProps("sendMessage", "receiveMessage")
const { CloudUpload } = findByProps("CloudUpload")

export default async (args: any[], ctx: CommandContext) => {
    const file = UploadStore.getUploads(ctx.channel.id, DRAFT_TYPE)[0].item
    if (!file.mimeType.includes("audio")) return showToast("Only audio files are supported", getAssetIDByName("Small"))
    showToast("Sending voice message...")
    const upload = new CloudUpload({ file }, ctx.channel.id, false, 0)
    upload.on("complete", () => sendMessage(ctx.channel.id, {
        content: "",
    }))
    upload.on("error", () => showToast("Failed to upload voice message", getAssetIDByName("Small")))
    upload.upload()
}