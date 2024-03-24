import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerComponent } from './planner.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RepaymentService } from './repayment.service';
import { DUIInput } from 'david-ui-angular';
import { By } from '@angular/platform-browser';

describe('PlannerComponent', () => {
  let component: PlannerComponent;
  let fixture: ComponentFixture<PlannerComponent>;

  let repaymentService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerComponent],
      providers: [
        {
          provide: RepaymentService,
          useValue: {
            calculateRepaymentPlan: jest.fn().mockReturnValue(['REPAYMENT']),
          },
        },
      ],
    })
      .overrideComponent(PlannerComponent, {
        set: {
          imports: [CommonModule, ReactiveFormsModule, DUIInput],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PlannerComponent);
    component = fixture.componentInstance;

    repaymentService = TestBed.inject(RepaymentService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should hide table without repayments', () => {
    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('ag-grid-angular'));
    expect(elem).toBeNull();
  });

  it('should calculate repayments on submit ', () => {
    component.formGroup.patchValue({
      debitInterest: 2.12,
      loanAmount: 100000,
      repaymentRate: 2,
      fixedInterestRate: 10,
    });
    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('dui-button'));
    expect(elem.attributes['type']).toEqual('submit');

    elem.triggerEventHandler('click');

    expect(
      repaymentService.calculateRepaymentPlan.mock.calls[0]
    ).toMatchSnapshot();

    expect(component.repayments).toMatchSnapshot();
  });

  it('should show table if repayments are available', () => {
    component.repayments = ['REPAYMENT'] as any;

    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('ag-grid-angular'));
    expect(elem.properties['rowData']).toMatchSnapshot();
    expect(elem.properties['columnDefs']).toMatchSnapshot();
  });
});
