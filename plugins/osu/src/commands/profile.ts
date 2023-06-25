import { isNotSetup, registerCommand } from "../utils"
import { ApplicationCommandOptionType } from "../../../../ApplicationCommandTypes"
import { findByProps } from "@vendetta/metro"
import { generateChart } from "../api/quickchart"

const { sendBotMessage } = findByProps("sendBotMessage")

export default registerCommand({
  name: "profile",
  description: "Display statistics of a user",
  options: [
    {
      name: "name",
      displayName: "name",
      description: "Specify a username",
      displayDescription: "Specify a username",
      type: ApplicationCommandOptionType.STRING as number
    }
  ],
  async execute(args, ctx) {
    if (isNotSetup()) return sendBotMessage(ctx.channel.id, "Please set apiv2 configuration in plugin settings.")
    const name = args.find(x => x?.name === "name")?.value
    const chart = await generateChart({ name: "sapphire", labels: [89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], data: [3218, 3218, 3189, 3192, 3194, 3198, 3201, 3204, 3209, 3213, 3219, 3221, 3225, 3230, 3232, 3234, 3236, 3239, 3244, 3248, 3251, 3252, 3254, 3257, 3262, 3265, 3271, 3275, 3278, 3281, 3283, 3283, 3290, 3293, 3296, 3300, 3301, 3304, 3307, 3308, 3259, 3262, 3266, 3266, 3245, 3250, 3255, 3258, 3266, 3271, 3275, 3283, 3288, 3295, 3298, 3306, 3311, 3314, 3321, 3325, 3316, 3321, 3325, 3327, 3328, 3329, 3334, 3339, 3345, 3302, 3303, 3309, 3309, 3313, 3315, 3319, 3320, 3324, 3328, 3331, 3336, 3284, 3286, 3292, 3293, 3294, 3299, 3298, 3301, 3300] })
    return sendBotMessage(ctx.channel.id, chart)
  }
})