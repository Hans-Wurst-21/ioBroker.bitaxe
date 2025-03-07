'use strict';

const utils = require('@iobroker/adapter-core');
const axios = require('axios');
// axios.defaults.timeout = 5000;

class Bitaxe extends utils.Adapter {
    constructor(options) {
        super({
            ...options,
            name: 'bitaxe',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
    }

    async onReady() {
        this.log.info('Bitaxe adapter is starting');

        await this.subscribeStatesAsync('*');

        this.apiUrl = this.config.apiUrl;
        this.updateInterval = this.config.updateInterval;

        this.fetchDataInterval = this.setInterval(() => {
            this.fetchApiData();
        }, this.updateInterval);

        this.fetchApiData();
    }

    async fetchApiData() {
        try {
            if (typeof this.apiUrl !== 'string') {
                throw new Error('API URL is not defined');
            }
            const response = await axios.get(`${this.apiUrl}/api/system/info`);
            // this.log.debug(`Raw data from API: ${JSON.stringify(response.data)}`);
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

    async onStateChange(id, state) {
        if (state && !state.ack) {
            const idParts = id.split('.');
            const stateName = idParts[idParts.length - 1];

            if (stateName === 'frequency') {
                await this.updateFrequency(state.val);
            } else if (stateName === 'RESET_Bitaxe') {
                await this.resetBitaxe();
            } else if (stateName === 'coreVoltage') {
                await this.updatecoreVoltage(state.val);
            }
        }
    }

    async updatecoreVoltage(CoreVoltage) {
        try {
            if (typeof this.apiUrl !== 'string') {
                throw new Error('API URL is not defined');
            }
            await axios.patch(
                `${this.apiUrl}/api/system`,
                { coreVoltage: CoreVoltage },
                { headers: { 'Content-Type': 'application/json' } },
            );
            this.log.debug(`Core Voltage updated to ${CoreVoltage}mV`);
            await this.setStateAsync('hardware.coreVoltage', { val: CoreVoltage, ack: true });
        } catch (error) {
            this.log.error(`Error updating Core Voltage: ${error.message}`);
        }
    }

    async updateFrequency(Frequency) {
        try {
            if (typeof this.apiUrl !== 'string') {
                throw new Error('API URL is not defined');
            }
            await axios.patch(
                `${this.apiUrl}/api/system`,
                { frequency: Frequency },
                { headers: { 'Content-Type': 'application/json' } },
            );
            // this.log.debug(`Frequency updated to ${Frequency}`);
            await this.setStateAsync('hardware.frequency', { val: Frequency, ack: true });
        } catch (error) {
            this.log.error(`Error updating frequency: ${error.message}`);
        }
    }

    async resetBitaxe() {
        try {
            if (typeof this.apiUrl !== 'string') {
                throw new Error('API URL is not defined');
            }
            await axios.post(`${this.apiUrl}/api/system/restart`);
            this.log.info('Bitaxe has been reset');
        } catch (error) {
            this.log.error(`Error resetting Bitaxe: ${error.message}`);
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
                this.clearInterval(this.fetchDataInterval);
            }
            this.log.info('Cleaned up everything...');
            callback();
        } catch (e) {
            this.log.error(`Error when exiting the adapter: ${e.message}`);
            callback();
        }
    }
}

if (require.main !== module) {
    module.exports = options => new Bitaxe(options);
} else {
    new Bitaxe();
}
