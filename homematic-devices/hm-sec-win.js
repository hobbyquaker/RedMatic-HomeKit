const Accessory = require('./lib/accessory');

module.exports = class HmSecWin extends Accessory {
    init(config) {
        this.addService('Window', config.name)
            .get('CurrentPosition', config.deviceAddress + ':1.LEVEL', value => {
                value = value < 0 ? 0 : value;
                return value * 100;
            })

            .get('TargetPosition', config.deviceAddress + ':1.LEVEL', value => {
                value = value < 0 ? 0 : value;
                return value * 100;
            })

            .set('TargetPosition', config.deviceAddress + ':1.LEVEL', value => {
                return value === 0 && this.option('LockOnClose') ? -0.005 : (value / 100);
            })

            .get('PositionState', config.deviceAddress + ':1.DIRECTION', (value, c) => {
                switch (value) {
                    case 1:
                        return c.INCREASING;
                    case 2:
                        return c.DECREASING;
                    default:
                        return c.STOPPED;
                }
            })

            .get('ObstructionDetected', config.deviceAddress + ':1.ERROR', value => {
                return Boolean(value);
            });

        this.addService('BatteryService', config.name)
            .get('StatusLowBattery', config.deviceAddress + ':0.LOWBAT', (value, c) => {
                return value ? c.BATTERY_LEVEL_LOW : c.BATTERY_LEVEL_NORMAL;
            })
            .get('BatteryLevel', config.deviceAddress + ':2.LEVEL', value => {
                return value * 100;
            })
            .get('ChargingState', config.deviceAddress + ':2.STATUS', value => {
                return value === 2 ? 0 : 1;
            });
    }
};
