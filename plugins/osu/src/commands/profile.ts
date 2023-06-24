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
        const chart = await generateChart({ "backgroundColor": "#36393e", 'chart': {
            type: 'line',
            data: {
              labels: ['89', '85', '81', '77', '73'],
              datasets: [
                {
                  data: [3200, 3520, 3052, 3730, 4503],
                  fill: false,
                  borderColor: 'orange',
                  pointRadius: 0
                }
              ],
            },
            options: {
              scales: {
                xAxes: [{
                  ticks: {
                    fontColor: 'white',
                    callback: (val) => {
                      return val.toLocaleString()
                    },
                  }
                }],
                yAxes: [{
                  ticks: {
                    fontColor: 'white',
                    min: 0,
                    callback: (val) => {
                      return val.toLocaleString()
                    },
                  }
                }]
              },
              legend: {
                display: false
              },
              title: {
                display: true,
                text: "osu plugin test",
                fontColor: "white"
              }
            }
          } })
        return sendBotMessage(ctx.channel.id, chart)
    }
})