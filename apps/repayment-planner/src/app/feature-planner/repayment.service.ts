import { Injectable } from '@angular/core';
import { Repayment } from './repayment.types';

@Injectable({
  providedIn: 'root',
})
export class RepaymentService {
  constructor() {}

  calculateRepaymentPlan({
    debitInterest,
    loanAmount,
    repaymentRate,
    fixedInterestRate,
  }: {
    debitInterest?: number | null;
    loanAmount?: number | null;
    repaymentRate?: number | null;
    fixedInterestRate?: number | null;
  }): Repayment[] {
    if (!debitInterest || !loanAmount || !repaymentRate || !fixedInterestRate) {
      return [];
    }

    const result = [] as Repayment[];

    // push initial payment
    result.push({
      residualDept: loanAmount * -1,
      interest: 0,
      rate: loanAmount * -1,
      repayment: loanAmount * -1,
    });

    const amountOfPayments = fixedInterestRate * 12;

    // (Darlehenshöhe / 100) x Zinssatz
    const initialInterestComponent = (loanAmount / (100 * 12)) * debitInterest;
    // (Darlehenshöhe / 100) x Tilgungssatz im Jahr
    const initialRepaymentComponent = (loanAmount / (100 * 12)) * repaymentRate;
    // Zinsanteil + Tilgungsanteil
    const rate = initialRepaymentComponent + initialInterestComponent;

    result.push({
      residualDept: loanAmount - initialRepaymentComponent,
      interest: initialInterestComponent,
      repayment: initialRepaymentComponent,
      rate,
    });

    for (let i = 2; i <= amountOfPayments; i++) {
      const prevResidualDept = result[i - 1].residualDept;

      // (Darlehenshöhe / 100) x Zinssatz
      const interest = (prevResidualDept / (100 * 12)) * debitInterest;
      const repayment = rate - interest;

      result.push({
        residualDept: prevResidualDept - repayment,
        interest,
        repayment,
        rate,
      });
    }

    return result;
  }
}
