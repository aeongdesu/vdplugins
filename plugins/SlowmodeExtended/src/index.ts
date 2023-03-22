import { constants } from "@vendetta/metro/common"

const defaultValue = constants.SLOWMODE_VALUES

let values: number[] = []

for (let i = 0; i <= 21600; i++) {
    if (i <= 60 && i < 120) values.push(i)
    else if (i >= 120 && i % 60 === 0 && i <= 3600) values.push(i)
    else if (i >= 7200 && i % 3600 === 0) values.push(i)
}
constants.SLOWMODE_VALUES = values

export const onUnload = () => constants.SLOWMODE_VALUES = defaultValue