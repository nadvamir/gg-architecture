import { deepCopy } from "../game-client/util/Util"

class Metrics {
    constructor() {
        this.data = {
            latencies: [],
            traffic_in: [],
            traffic_out: []
        }
    }

    recordLatency(latency) {
        this.data.latencies.push([new Date().getTime(), latency])
    }

    recordTrafficIn(bytes) {
        this.data.traffic_in.push([new Date().getTime(), bytes])
    }

    recordTrafficOut(bytes) {
        this.data.traffic_out.push([new Date().getTime(), bytes])
    }

    getMetrics() {
        let data = deepCopy(this.data)
        data.avg_latency = this.avg(data.latencies)
        data.avg_traffic_in = this.avg(data.traffic_in)
        data.avg_traffic_out = this.avg(data.traffic_out)
        data.max_latency = this.max(data.latencies)
        data.max_traffic_in = this.max(data.traffic_in)
        data.max_traffic_out = this.max(data.traffic_out)
        data.traffic_in_rate = this.rate(data.traffic_in)
        data.traffic_out_rate = this.rate(data.traffic_out)
        data.traffic_in_total = this.sum(data.traffic_in)
        data.traffic_out_total = this.sum(data.traffic_out)
        return data
    }

    avg(series) {
        return this.sum(series) / series.length
    }

    sum(series) {
        return series.reduce((acc, [t, l]) => acc + l, 0)
    }

    max(series) {
        return Math.max(...series.map(([t, v]) => v))
    }

    rate(series) {
        if (series.length == 0) return 0
        return this.sum(series) / (series[series.length-1][0] - series[0][0])
    }
}

export { Metrics }