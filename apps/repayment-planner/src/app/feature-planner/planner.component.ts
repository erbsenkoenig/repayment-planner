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
import { ColDef } from 'ag-grid-community';

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
    { field: 'residualDept', headerName: 'Restschuld', flex: 1 },
    { field: 'interest', headerName: 'Zinsen', flex: 1 },
    { field: 'repayment', headerName: 'Tilgung', flex: 1 },
    { field: 'rate', headerName: 'Rate', flex: 1 },
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
