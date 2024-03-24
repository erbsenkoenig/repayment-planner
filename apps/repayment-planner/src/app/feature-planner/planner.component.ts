import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DUIButton, DUIInput } from 'david-ui-angular';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RepaymentService } from './repayment.service';
import { Repayment } from './repayment.types';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueFormatterFunc } from 'ag-grid-community';

const valueFormatter: ValueFormatterFunc = (p) => `${p.value.toFixed(2)} EUR`;
const residualDept: ValueFormatterFunc = (p) =>
  valueFormatter({ ...p, value: p.value * -1 });

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [
    CommonModule,
    DUIInput,
    ReactiveFormsModule,
    DUIButton,
    AgGridAngular,
  ],
  templateUrl: './planner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlannerComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private repaymentService: RepaymentService = inject(RepaymentService);

  repayments: Repayment[] = [];

  colDefs: ColDef[] = [
    { field: 'id', headerName: '#', width: 50 },
    {
      field: 'residualDept',
      headerName: 'Restschuld',
      flex: 1,
      valueFormatter: residualDept,
    },
    { field: 'interest', headerName: 'Zinsen', flex: 1, valueFormatter },
    { field: 'repayment', headerName: 'Tilgung', flex: 1, valueFormatter },
    { field: 'rate', headerName: 'Rate', flex: 1, valueFormatter },
  ];

  formGroup = this.fb.group<{
    debitInterest: FormControl<number | null>;
    loanAmount: FormControl<number | null>;
    repaymentRate: FormControl<number | null>;
    fixedInterestRate: FormControl<number | null>;
  }>({
    debitInterest: this.fb.control<number | null>(null, Validators.required),
    loanAmount: this.fb.control<number | null>(null, Validators.required),
    repaymentRate: this.fb.control<number | null>(null, Validators.required),
    fixedInterestRate: this.fb.control<number | null>(
      null,
      Validators.required
    ),
  });

  calculateRepaymentPlan() {
    this.repayments = this.repaymentService.calculateRepaymentPlan(
      this.formGroup.value
    );
  }
}
