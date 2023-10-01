import { shortenAddress } from './addresses';
import { formatNumber } from './number';
import { unixToDate } from './times';

export const tooltipLabelFormatter = (label: any): string => {
    if (!label || isNaN(label)) return '';
    return unixToDate(label, 'MMMM dd yyyy');
};

export const tooltipFormatter = (value: any, _: any, item: any): string => {
    if (item && item.unit === '%') {
        return value.toFixed(2);
    }
    if (item && item.dataKey === 'totalSupply') {
        return formatNumber(value, { compact: false });
    }
    return formatNumber(value, { currency: 'USD' });
};

export const tooltipUserFormatter = (value: any, _: any, item: any): string => {
    if (item && item.unit === '%') {
        return value.toFixed(2);
    }
    return formatNumber(value, { compact: false });
};

export const tooltipPercentFormatter = (value: any): string => {
    return formatNumber(value, { percentage: true });
};

export const yAxisFormatter = (value: any) => {
    return formatNumber(value, { currency: 'USD', compact: true, fractionDigits: 0 });
};

export const yAxisPercentFormatter = (value: any) => {
    return formatNumber(value, { percentage: true });
};

export const xAxisFormatter = (value: any) => {
    if (!value || isNaN(value)) return '';
    return unixToDate(value, 'dd/MM');
};
export const xAxisFormatterWallet = (value: any) => {
    if (!value || isNaN(value)) return '';
    return shortenAddress(value);
};
