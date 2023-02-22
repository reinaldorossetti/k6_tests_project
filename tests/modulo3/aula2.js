import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

export const options = {
    vus: 500,
    duration: '10s',
    noConnectionReuse: true,
    thresholds:  {
        http_req_failed: ['rate < 0.5'],
        http_req_duration: ['p(95) < 250','p(90) < 200']
    }
}

// let params = { timeout: '30s' };

const chamadas = new Counter('Quantidade de Requests');
const myGauge = new Gauge('Tempo bloqueado');
const myRate = new Rate('Taxa de requests 200');
const myTrend = new Trend('Taxa de espera');

export default function(){
    const resp = http.get('http://test.k6.io')
    chamadas.add(1)
    myGauge.add(resp.timings.blocked)
    myRate.add(resp.status)
    myTrend.add(resp.timings.waiting)
    check(resp, {
        'status code eh 200': (r) => r.status ===200
    });
    const randomTest = Math.random();
    sleep((randomTest) * 15);
}