'use strict';

const utils = require('@iobroker/adapter-core');
const axios = require('axios');

class Bitaxe extends utils.Adapter {
    constructor(options) {
        super({
            ...options,
            name: 'bitaxe',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    async onReady() {
        this.log.info('Bitaxe adapter is starting');

        this.apiUrl = this.config.apiUrl || 'http://192.168.178.26/api/system/info';
        this.updateInterval = this.config.updateInterval || 60000;

        this.fetchDataInterval = setInterval(() => {
            this.fetchApiData();
        }, this.updateInterval);

        this.fetchApiData();
    }

    async fetchApiData() {
        try {
            if (typeof this.apiUrl !== 'string') {
                throw new Error('API URL ist nicht definiert');
            }
            const response = await axios.get(this.apiUrl);
            this.log.debug(`Raw data from API: ${JSON.stringify(response.data)}`);
            await this.setStateAsync('info.connection', { val: true, ack: true });
            await this.processApiData(response.data);
        } catch (error) {
            this.log.error(`Error fetching data: ${error.message}`);
            await this.setStateAsync('info.connection', { val: false, ack: true });
        }
    }

    async processApiData(data) {
        for (const [key, value] of Object.entries(data)) {
            const stateId = this.getStateId(key);
            if (stateId) {
                await this.setStateAsync(stateId, { val: value, ack: true });
            }
        }
    }

    getStateId(key) {
        const mapping = {
            power: 'power.power',
            voltage: 'power.voltage',
            current: 'power.current',
            temp: 'temperature.temp',
            vrTemp: 'temperature.vrTemp',
            hashRate: 'mining.hashRate',
            bestDiff: 'mining.bestDiff',
            bestSessionDiff: 'mining.bestSessionDiff',
            isUsingFallbackStratum: 'mining.isUsingFallbackStratum',
            sharesAccepted: 'mining.sharesAccepted',
            sharesRejected: 'mining.sharesRejected',
            freeHeap: 'hardware.freeHeap',
            coreVoltage: 'hardware.coreVoltage',
            coreVoltageActual: 'hardware.coreVoltageActual',
            frequency: 'hardware.frequency',
            asicCount: 'hardware.asicCount',
            smallCoreCount: 'hardware.smallCoreCount',
            ASICModel: 'hardware.ASICModel',
            ssid: 'network.ssid',
            macAddr: 'network.macAddr',
            hostname: 'network.hostname',
            wifiStatus: 'network.wifiStatus',
            stratumURL: 'stratum.stratumURL',
            fallbackStratumURL: 'stratum.fallbackStratumURL',
            stratumPort: 'stratum.stratumPort',
            fallbackStratumPort: 'stratum.fallbackStratumPort',
            stratumUser: 'stratum.stratumUser',
            fallbackStratumUser: 'stratum.fallbackStratumUser',
            version: 'system.version',
            boardVersion: 'system.boardVersion',
            runningPartition: 'system.runningPartition',
            uptimeSeconds: 'system.uptimeSeconds',
            flipscreen: 'configuration.flipscreen',
            overheat_mode: 'configuration.overheat_mode',
            invertscreen: 'configuration.invertscreen',
            invertfanpolarity: 'configuration.invertfanpolarity',
            autofanspeed: 'configuration.autofanspeed',
            fanspeed: 'configuration.fanspeed',
            fanrpm: 'configuration.fanrpm',
        };
        return mapping[key] || null;
    }

    onUnload(callback) {
        try {
            if (this.fetchDataInterval) {
                clearInterval(this.fetchDataInterval);
            }
            this.log.info('Cleaned up everything...');
            callback();
        } catch (e) {
            this.log.error(`Fehler beim Beenden des Adapters: ${e.message}`);
            callback();
        }
    }
}

if (require.main !== module) {
    module.exports = options => new Bitaxe(options);
} else {
    new Bitaxe();
}
