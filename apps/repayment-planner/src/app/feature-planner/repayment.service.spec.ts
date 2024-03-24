import { TestBed } from '@angular/core/testing';

import { RepaymentService } from './repayment.service';

describe('RepaymentService', () => {
  let service: RepaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateRepaymentPlan', () => {
    it('should handle loan ended before fixed interest rate is done', () => {
      expect(
        service.calculateRepaymentPlan({
          debitInterest: 2.12,
          loanAmount: 100,
          repaymentRate: 50,
          fixedInterestRate: 10,
        })
      ).toMatchSnapshot();
    });

    it('should handle loan with remaining loan after fixed interest rate', () => {
      expect(
        service.calculateRepaymentPlan({
          debitInterest: 2.12,
          loanAmount: 100,
          repaymentRate: 50,
          fixedInterestRate: 1,
        })
      ).toMatchSnapshot();
    });
  });
});
