// https://quickchart.io/sandbox#%7B%22chart%22%3A%22%7B%5Cn%20%20type%3A%20'line'%2C%5Cn%20%20data%3A%20%7B%5Cn%20%20%20%20labels%3A%20%5B'January'%2C%20'February'%2C%20'March'%2C%20'April'%2C%20'May'%5D%2C%5Cn%20%20%20%20datasets%3A%20%5B%5Cn%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20label%3A%20'Dogs'%2C%5Cn%20%20%20%20%20%20%20%20data%3A%20%5B50%2C%2060%2C%2070%2C%20180%2C%20190%5D%2C%5Cn%20%20%20%20%20%20%20%20fill%3A%20false%2C%5Cn%20%20%20%20%20%20%20%20borderColor%3A%20'blue'%2C%5Cn%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%20%20%7B%5Cn%20%20%20%20%20%20%20%20label%3A%20'Cats'%2C%5Cn%20%20%20%20%20%20%20%20data%3A%20%5B100%2C%20200%2C%20300%2C%20400%2C%20500%5D%2C%5Cn%20%20%20%20%20%20%20%20fill%3A%20false%2C%5Cn%20%20%20%20%20%20%20%20borderColor%3A%20'green'%2C%5Cn%20%20%20%20%20%20%7D%2C%5Cn%20%20%20%20%5D%2C%5Cn%20%20%7D%2C%5Cn%7D%22%2C%22width%22%3A500%2C%22height%22%3A300%2C%22version%22%3A%222.9.4%22%7D
interface ChartData {
    width?: string                         // Pixel width
    height?: string                        // Pixel height
    devicePixelRatio?: number              // Pixel ratio (2.0 by default)
    format?: string                        // png, svg, or webp
    backgroundColor?: string               // Canvas background
    version?: string                       // Chart.js version
    key?: string;                          // API key (optional)
    chart: string | any                    // Chart.js configuration
}

interface Data {
    name: string
    labels: number[]
    data: number[]
}

export const generateChart = async (chart: Data) => {
    const res = await fetch("https://quickchart.io/chart/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(defaultConfig(chart))
    })
    if (!res.ok) throw new Error("Failed to generate chart")
    return (await res.json()).url
}

const defaultConfig = (data: Data) => ({
    backgroundColor: "#36393e",
    chart: {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                borderJoinStyle: "round",
                borderCapStyle: "round",
                fill: false,
                borderColor: "#ffcc22",
                lineTension: 0.1,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Days ago",
                        fontSize: 12,
                        fontStyle: "bold",
                        fontColor: "white",
                        fontFamily: "sans-serif",
                        lineHeight: 1.2,
                        padding: 4
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "white"
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Rank",
                        fontSize: 12,
                        fontStyle: "bold",
                        fontColor: "white",
                        fontFamily: "sans-serif",
                        padding: 4
                    },
                    grindLines: {
                        display: false,
                        color: "white",
                        drawBorder: true,
                        tickMarkLength: 10
                    },
                    ticks: {
                        reverse: true,
                        fontColor: "white",
                        fontFamily: "sans-serif"
                    }
                }]
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                text: `${data.name}'s Rank History`,
                fontSize: 15,
                fontColor: "white",
                fontFamily: "sans-serif",
                fontStyle: "bold",
                padding: 10,
                lineHeight: 1.2
            },
            plugins: {
                tickFormat: {
                    useGrouping: true
                }
            }
        }
    }
})