import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    stages: [
        {duration: '10s', target: 5},
        {duration: '10s', target: 10},
        {duration: '10s', target: 0}
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 200']
    }
}

const data = new SharedArray('Leitura do Json', function(){
    return JSON.parse(open('./dados.json')).crocodilos
})

export default function(){
    const crocodileID = data[Math.floor(Math.random() * data.length)].id
    const BASE_URL = "https://test-api.k6.io/public/crocodiles/" + crocodileID
    const resq = http.get(BASE_URL);

    check(resq, {
        'status code 200': (r) => r.status === 200
    })
}

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }