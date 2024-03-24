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
      id: 0,
      residualDept: loanAmount * -1,
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
      const prevRepaymentRate = result[i - 1].repayment;

      // if the prev residual dept was smaller than the repayment rate
      // the last payment was the last
      if (prevResidualDept < prevRepaymentRate) {
        break;
      }

      const interest = (prevResidualDept / (100 * 12)) * debitInterest;
      const repayment = rate - interest;

      // new residualDept is prev minus curr repayment
      let residualDept = prevResidualDept - repayment;
      // if the result would be below 0 the current repayment is just what we have left
      if (residualDept < 0) {
        residualDept = prevResidualDept;
      }

      result.push({
        id: i,
        residualDept,
        interest,
        repayment,
        rate,
      });
    }

    return result;
  }
}
