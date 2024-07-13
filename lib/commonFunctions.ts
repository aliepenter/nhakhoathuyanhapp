export const formatDate = (isoDateString: any, type: any) => {
    const date = new Date(isoDateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    if (type === 'full') {
        return `Ngày ${day} tháng ${month} năm ${year}`;
    } else {
        return `${day}/${month}/${year}`;
    }
}

export const formatMoney = (amount: any) => {
    amount = parseFloat(amount.toString().replace(/,/g, '')).toFixed(0);

    if (amount === '') {
        return '';
    }

    let formatted = '';
    let count = 0;

    for (let i = amount.length - 1; i >= 0; i--) {
        formatted = amount[i] + formatted;
        count++;

        if (count % 3 === 0 && i > 0) {
            formatted = '.' + formatted;
        }
    }

    formatted += 'đ';
    return formatted;
}