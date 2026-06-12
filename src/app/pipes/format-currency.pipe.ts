import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatCurrency', standalone: true })
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number | null, currency: string = 'PKR'): string {
    if (value === null) return `${currency} 0`;
    const formatted = new Intl.NumberFormat('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
    return `${currency} ${formatted}`;
  }
}
