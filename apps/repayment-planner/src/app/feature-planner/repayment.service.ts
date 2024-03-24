import { Injectable } from '@angular/core';
import { Repayment } from './repayment.types';

@Injectable({
  providedIn: 'root',
})
export class RepaymentService {
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
      id: 0,
      residualDept: loanAmount,
      interest: 0,
      rate: loanAmount * -1,
      repayment: loanAmount * -1,
    });

    const amountOfPayments = fixedInterestRate * 12;

    const initialInterestComponent = (loanAmount / (100 * 12)) * debitInterest;
    const initialRepaymentComponent = (loanAmount / (100 * 12)) * repaymentRate;
    const rate = initialRepaymentComponent + initialInterestComponent;

    result.push({
      id: 1,
      residualDept: loanAmount - initialRepaymentComponent,
      interest: initialInterestComponent,
      repayment: initialRepaymentComponent,
      rate,
    });

    for (let i = 2; i <= amountOfPayments; i++) {
      // get prev residual dept for interest calculation
      const prevResidualDept = result[i - 1].residualDept;

      const interest = (prevResidualDept / (100 * 12)) * debitInterest;
      const repayment = rate - interest;

      // new residualDept is prev minus curr repayment
      let residualDept = prevResidualDept - repayment;
      let currRate = rate;
      // if the result would be below 0 the current repayment is just what we have left
      if (residualDept < repayment) {
        currRate = residualDept;
      }

      result.push({
        id: i,
        residualDept: residualDept,
        interest,
        repayment,
        rate: currRate,
      });

      if (residualDept < repayment) {
        break;
      }
    }

    return result;
  }
}
