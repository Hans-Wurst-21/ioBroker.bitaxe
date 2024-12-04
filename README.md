![Logo](admin/bitaxe.png)
# ioBroker.bitaxe

[![NPM version](https://img.shields.io/npm/v/iobroker.bitaxe.svg)](https://www.npmjs.com/package/iobroker.bitaxe)
[![Downloads](https://img.shields.io/npm/dm/iobroker.bitaxe.svg)](https://www.npmjs.com/package/iobroker.bitaxe)
![Number of Installations](https://iobroker.live/badges/bitaxe-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/bitaxe-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.bitaxe.png?downloads=true)](https://nodei.co/npm/iobroker.bitaxe/)

**Tests:** ![Test and Release](https://github.com/Hans-Wurst-21/ioBroker.bitaxe/workflows/Test%20and%20Release/badge.svg)

# BitaxeOS Mining Adapter for ioBroker

The Bitaxe adapter integrates the Bitaxe Miner into ioBroker, allowing users to monitor and manage their mining operations efficiently. Adjust the frequency of the ASIC during operation.

It should work with all Bitaxes. However, I cannot promise it! 

#### Tested only on a Bitaxe 601 Gamma with AxoOS v2.4.0!

##

**Important: The adapter or Bitaxe will never ask for your seed!**

**⚠️ NEVER ⚠️**

**If you share your seed you will lose 100% of everything!**

## Features

- **Real-time Data**: Fetches and displays real-time data from the Bitaxe Miner.
- **Configuration Management**: Change the frequency and Core-Voltage of the ASIC during operation.
- **Comprehensive Monitoring**: Monitors power consumption, temperature, and mining performance metrics.
- **Reset Bitaxe**: Reset your Bitaxe (Button/boolean) - be careful

## Installation

1. Install the adapter via the ioBroker admin interface.
2. Configure the adapter settings, including the API URL and update interval.

## Configuration

The adapter can be configured with the following options:

- **API URL**: The endpoint for accessing the miner's API (e.g., `http://BITAXE_API`). (not / at the end)

- **Update Interval**: The frequency of data updates in milliseconds (default is 60000 ms).

## States

The adapter creates various channels and states to represent different metrics from the miner:

### Information Channel
- `info.connection`: Indicates whether the device or service is connected (boolean).

### Power Data Channel
- `power.power`: Current power consumption (W).
- `power.voltage`: Voltage level (mV).
- `power.current`: Current draw (mA).

### Temperature Data Channel
- `temperature.temp`: Device temperature (°C).
- `temperature.vrTemp`: VR temperature (°C).

### Mining Data Channel
- `mining.hashRate`: Current hash rate (H/s).
- `mining.bestDiff`: Best difficulty encountered.
- `mining.bestSessionDiff`: Best session difficulty.
- `mining.isUsingFallbackStratum`: Indicates if using fallback stratum.
- `mining.sharesAccepted`: Number of accepted shares.
- `mining.sharesRejected`: Number of rejected shares.

### Hardware Data Channel
- `hardware.frequency`: Operating frequency (MHz). Can be changed while the system is running.
- `hardware.coreVoltage`: Core voltage (mV). Can be changed while the system is running.
- `hardware.freeHeap`: Free memory available (bytes).
- `hardware.coreVoltageActual`: Actual core voltage (mV).
- `hardware.asicCount`: Number of ASICs in use.
- `hardware.smallCoreCount`: Number of small cores.
- `hardware.ASICModel`: ASIC model information.

### Configuration Channel
- `configuration.fanrpm`: Fan RPM.
- `configuration.fanspeed`: Fan speed (%).
- `configuration.autofanspeed`: Auto fan speed setting.
- `configuration.invertfanpolarity`: Fan polarity inversion setting.
- `configuration.invertscreen`: Screen inversion setting.
- `configuration.overheat_mode`: Overheat mode setting.
- `configuration.flipscreen`: Screen flip setting.

### System Channel
- `system.version`: Version of the system software.
- `system.boardVersion`: Version of the board.
- `system.runningPartition`: Currently running partition.
- `system.uptimeSeconds`: Uptime of the system in seconds.

### Stratum Channel
- `stratum.stratumURL`: URL of the stratum server.
- `stratum.fallbackStratumURL`: Fallback stratum server URL.
- `stratum.stratumPort`: Port used for stratum connections.
- `stratum.fallbackStratumPort`: Fallback stratum port.
- `stratum.stratumUser`: Stratum user.
- `stratum.fallbackStratumUser`: Fallback stratum user.

### Network Channel
- `network.wifiStatus`: Status of the WiFi connection.
- `network.hostname`: Hostname of the device.
- `network.macAddr`: MAC address of the device.
- `network.ssid`: SSID of the connected WiFi network.

## Logging

The adapter logs important events and errors to help with troubleshooting. Set log level to "info" for standard operation or "debug" for detailed logging.

## Changelog
<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**
* (Hans-Wurst-21) initial release

## License
MIT License

Copyright (c) 2024 Hans-Wurst-21 <github+bitaxe@hansmail.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.