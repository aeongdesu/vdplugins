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

export const generateChart = async (data: ChartData) => {
    const res = await fetch("https://quickchart.io/chart/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to generate chart")
    return (await res.json()).url
}